"use client";

import { Check, Download } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  stateCodeByMapShapeId,
  stateMapShapeAssetPath,
} from "@/data/states";
import { getStateColor } from "@/lib/getStateColor";
import { formatMargin } from "@/lib/format";
import type { StateScenarioResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type ElectoralMapProps = {
  results: StateScenarioResult[];
  selectedStateCode: string;
  onSelectState: (stateCode: string) => void;
};

type TopologyTransform = {
  scale: [number, number];
  translate: [number, number];
};

type TopologyGeometry = {
  id: string;
  type: "Polygon" | "MultiPolygon";
  arcs: number[][] | number[][][];
  properties: {
    name: string;
  };
};

type StatesTopology = {
  bbox: [number, number, number, number];
  transform: TopologyTransform;
  arcs: [number, number][][];
  objects: {
    states: {
      geometries: TopologyGeometry[];
    };
  };
};

type MapPoint = [number, number];

type StateShape = {
  code: string;
  path: string;
  labelX: number;
  labelY: number;
  labelVisible: boolean;
};

type ExportStatus = "idle" | "exporting" | "saved" | "failed";

const smallStateCodes = ["VT", "NH", "MA", "RI", "CT", "NJ", "DE", "MD", "DC"];
const labelOmitCodes = new Set([...smallStateCodes, "HI"]);

function decodeArcs(topology: StatesTopology) {
  const [scaleX, scaleY] = topology.transform.scale;
  const [translateX, translateY] = topology.transform.translate;

  return topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;

    return arc.map(([deltaX, deltaY]) => {
      x += deltaX;
      y += deltaY;
      return [x * scaleX + translateX, y * scaleY + translateY] as MapPoint;
    });
  });
}

function getArcPoints(decodedArcs: MapPoint[][], arcIndex: number) {
  if (arcIndex >= 0) {
    return decodedArcs[arcIndex];
  }

  return [...decodedArcs[~arcIndex]].reverse();
}

function pointsForRing(decodedArcs: MapPoint[][], ring: number[]) {
  return ring.flatMap((arcIndex, index) => {
    const points = getArcPoints(decodedArcs, arcIndex);
    return index === 0 ? points : points.slice(1);
  });
}

function formatPoint([x, y]: MapPoint) {
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

function pathForRing(points: MapPoint[]) {
  if (points.length === 0) {
    return "";
  }

  return `M${formatPoint(points[0])}${points.slice(1).map((point) => `L${formatPoint(point)}`).join("")}Z`;
}

function ringArea(points: MapPoint[]) {
  return Math.abs(
    points.reduce((area, point, index) => {
      const nextPoint = points[(index + 1) % points.length];
      return area + point[0] * nextPoint[1] - nextPoint[0] * point[1];
    }, 0) / 2,
  );
}

function getBounds(points: MapPoint[]) {
  return points.reduce(
    (bounds, [x, y]) => ({
      minX: Math.min(bounds.minX, x),
      minY: Math.min(bounds.minY, y),
      maxX: Math.max(bounds.maxX, x),
      maxY: Math.max(bounds.maxY, y),
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
  );
}

function shapeForGeometry(
  decodedArcs: MapPoint[][],
  geometry: TopologyGeometry,
): StateShape | null {
  const code = stateCodeByMapShapeId[geometry.id];

  if (!code) {
    return null;
  }

  const polygons = geometry.type === "Polygon"
    ? [geometry.arcs as number[][]]
    : geometry.arcs as number[][][];

  const polygonRings = polygons.map((polygon) => {
    return polygon.map((ring) => pointsForRing(decodedArcs, ring));
  });

  const path = polygonRings
    .flatMap((polygon) => polygon.map((ring) => pathForRing(ring)))
    .join("");

  const largestRing = polygonRings
    .flat()
    .reduce<MapPoint[]>((largest, ring) => {
      return ringArea(ring) > ringArea(largest) ? ring : largest;
    }, []);

  const bounds = getBounds(largestRing);

  return {
    code,
    path,
    labelX: (bounds.minX + bounds.maxX) / 2,
    labelY: (bounds.minY + bounds.maxY) / 2,
    labelVisible: !labelOmitCodes.has(code) && bounds.maxX - bounds.minX > 18 && bounds.maxY - bounds.minY > 14,
  };
}

function buildStateShapes(topology: StatesTopology) {
  const decodedArcs = decodeArcs(topology);
  return topology.objects.states.geometries.flatMap((geometry) => {
    const shape = shapeForGeometry(decodedArcs, geometry);
    return shape ? [shape] : [];
  });
}

function getStyleForResult(result: StateScenarioResult) {
  const color = getStateColor(result.simulatedMargin);

  return {
    "--state-fill": color.background,
    "--state-stroke": color.border,
    "--state-fg": color.foreground,
    "--state-fill-dark": color.darkBackground,
    "--state-stroke-dark": color.darkBorder,
    "--state-fg-dark": color.darkForeground,
  } as CSSProperties;
}

export function ElectoralMap({
  results,
  selectedStateCode,
  onSelectState,
}: ElectoralMapProps) {
  const mapCanvasRef = useRef<HTMLDivElement>(null);
  const exportStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [topology, setTopology] = useState<StatesTopology | null>(null);
  const [hasMapError, setHasMapError] = useState(false);
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");

  useEffect(() => {
    let isMounted = true;

    fetch(stateMapShapeAssetPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Map asset failed with status ${response.status}`);
        }

        return response.json() as Promise<StatesTopology>;
      })
      .then((mapTopology) => {
        if (isMounted) {
          setTopology(mapTopology);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasMapError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (exportStatusTimeoutRef.current) {
        clearTimeout(exportStatusTimeoutRef.current);
      }
    };
  }, []);

  const resultByCode = useMemo(() => {
    return new Map(results.map((result) => [result.state.code, result]));
  }, [results]);

  const stateShapes = useMemo(() => {
    if (!topology) {
      return [];
    }

    return buildStateShapes(topology).filter((shape) => resultByCode.has(shape.code));
  }, [resultByCode, topology]);

  const hoveredResult = hoveredStateCode ? resultByCode.get(hoveredStateCode) : null;
  const tooltipResult = hoveredResult;
  const viewBox = topology
    ? `${topology.bbox[0] - 10} ${topology.bbox[1] - 10} ${topology.bbox[2] - topology.bbox[0] + 20} ${topology.bbox[3] - topology.bbox[1] + 20}`
    : "-68 3 1036 614";

  function moveTooltip(event: PointerEvent<Element>) {
    const bounds = mapCanvasRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    const rawX = event.clientX - bounds.left;
    const rawY = event.clientY - bounds.top;

    setTooltipPosition({
      x: Math.min(Math.max(rawX, 16), Math.max(16, bounds.width - 236)),
      y: Math.max(rawY, 52),
    });
  }

  function handlePointerActivity(event: PointerEvent<Element>, stateCode: string) {
    setHoveredStateCode(stateCode);
    moveTooltip(event);
  }

  function handleSelectState(stateCode: string) {
    onSelectState(stateCode);
  }

  function handleKeyDown(event: KeyboardEvent<SVGPathElement>, stateCode: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectState(stateCode);
    }
  }

  function queueExportStatusReset() {
    if (exportStatusTimeoutRef.current) {
      clearTimeout(exportStatusTimeoutRef.current);
    }

    exportStatusTimeoutRef.current = setTimeout(() => {
      setExportStatus("idle");
    }, 2800);
  }

  async function handleExportMapImage() {
    const sourceSvg = mapCanvasRef.current?.querySelector("svg");

    if (!sourceSvg) {
      setExportStatus("failed");
      queueExportStatusReset();
      return;
    }

    setExportStatus("exporting");

    try {
      const sourceElements = sourceSvg.querySelectorAll<SVGElement>("path,text");
      const svgClone = sourceSvg.cloneNode(true) as SVGSVGElement;
      const cloneElements = svgClone.querySelectorAll<SVGElement>("path,text");
      const viewBox = sourceSvg.viewBox.baseVal;
      const exportScale = 2;
      const exportWidth = Math.round(viewBox.width * exportScale);
      const exportHeight = Math.round(viewBox.height * exportScale);
      const isDarkTheme =
        mapCanvasRef.current?.closest("[data-theme='dark']") !== null;
      const backgroundFill = isDarkTheme ? "#0a0f15" : "#f8ffff";

      sourceElements.forEach((sourceElement, index) => {
        const cloneElement = cloneElements[index];

        if (!cloneElement) {
          return;
        }

        const computedStyle = getComputedStyle(sourceElement);

        cloneElement.removeAttribute("class");
        cloneElement.removeAttribute("style");
        cloneElement.setAttribute("fill", computedStyle.fill);
        cloneElement.setAttribute("stroke", computedStyle.stroke);
        cloneElement.setAttribute(
          "stroke-width",
          computedStyle.getPropertyValue("stroke-width"),
        );
        cloneElement.setAttribute(
          "stroke-linejoin",
          computedStyle.getPropertyValue("stroke-linejoin"),
        );
        cloneElement.setAttribute(
          "stroke-dasharray",
          computedStyle.getPropertyValue("stroke-dasharray"),
        );
        cloneElement.setAttribute("font-family", computedStyle.fontFamily);
        cloneElement.setAttribute("font-size", computedStyle.fontSize);
        cloneElement.setAttribute("font-weight", computedStyle.fontWeight);
        cloneElement.setAttribute(
          "paint-order",
          computedStyle.getPropertyValue("paint-order"),
        );
        cloneElement.setAttribute(
          "text-anchor",
          computedStyle.getPropertyValue("text-anchor"),
        );
      });

      const backgroundRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );

      backgroundRect.setAttribute("x", String(viewBox.x));
      backgroundRect.setAttribute("y", String(viewBox.y));
      backgroundRect.setAttribute("width", String(viewBox.width));
      backgroundRect.setAttribute("height", String(viewBox.height));
      backgroundRect.setAttribute("fill", backgroundFill);
      svgClone.insertBefore(backgroundRect, svgClone.firstChild);
      svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgClone.setAttribute("width", String(exportWidth));
      svgClone.setAttribute("height", String(exportHeight));

      const svgBlob = new Blob([new XMLSerializer().serializeToString(svgClone)], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Map export image failed to load"));
        image.src = svgUrl;
      });

      URL.revokeObjectURL(svgUrl);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas context unavailable");
      }

      canvas.width = exportWidth;
      canvas.height = exportHeight;
      context.fillStyle = backgroundFill;
      context.fillRect(0, 0, exportWidth, exportHeight);
      context.drawImage(image, 0, 0, exportWidth, exportHeight);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("PNG export failed"));
          }
        }, "image/png");
      });
      const pngUrl = URL.createObjectURL(pngBlob);
      const link = document.createElement("a");

      link.href = pngUrl;
      link.download = `election-map-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
      URL.revokeObjectURL(pngUrl);
      setExportStatus("saved");
    } catch {
      setExportStatus("failed");
    }

    queueExportStatusReset();
  }

  const exportButtonLabel = exportStatus === "saved"
    ? "Map image exported"
    : exportStatus === "failed"
      ? "Map export failed"
      : exportStatus === "exporting"
        ? "Exporting map image"
        : "Export map as image";

  return (
    <section className={styles.mapPanel} aria-label="State-level electoral map">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Electoral map</p>
          <h2>State scenario view</h2>
        </div>
        <div className={styles.mapHeaderTools}>
          <div className={styles.legend} aria-label="Margin legend">
            <span><b className={styles.legendTilt} />TILT</span>
            <span><b className={styles.legendLean} />LEAN</span>
            <span><b className={styles.legendLikely} />LIKELY</span>
            <span><b className={styles.legendSafe} />SAFE</span>
          </div>
          <button
            aria-label={exportButtonLabel}
            className={styles.iconButton}
            disabled={!topology || exportStatus === "exporting"}
            onClick={handleExportMapImage}
            title={exportButtonLabel}
            type="button"
          >
            {exportStatus === "saved" ? (
              <Check size={16} strokeWidth={2.3} />
            ) : (
              <Download size={16} strokeWidth={2.3} />
            )}
          </button>
        </div>
      </div>

      <div className={styles.mapViewport}>
        <div
          className={styles.mapCanvas}
          ref={mapCanvasRef}
          onPointerLeave={() => setHoveredStateCode(null)}
        >
          {hasMapError ? (
            <div className={styles.mapLoading}>Map data unavailable</div>
          ) : null}

          {!topology && !hasMapError ? (
            <div className={styles.mapLoading}>Loading map data</div>
          ) : null}

          {topology ? (
            <svg
              className={styles.usMap}
              viewBox={viewBox}
              role="img"
              aria-label="United States electoral map colored by simulated margin"
            >
              <g className={styles.stateLayer}>
                {stateShapes.map((shape) => {
                  const result = resultByCode.get(shape.code);

                  if (!result) {
                    return null;
                  }

                  const isSelected = selectedStateCode === shape.code;

                  return (
                    <path
                      key={shape.code}
                      className={styles.stateShape}
                      d={shape.path}
                      fillRule="evenodd"
                      role="button"
                      tabIndex={0}
                      data-selected={isSelected}
                      data-flipped={result.flipped}
                      style={getStyleForResult(result)}
                      aria-pressed={isSelected}
                      aria-label={`${result.state.name}, ${result.state.electoralVotes} electoral votes, current ${formatMargin(result.simulatedMargin)}, baseline ${formatMargin(result.state.baselineMargin)}`}
                      onClick={() => handleSelectState(shape.code)}
                      onKeyDown={(event) => handleKeyDown(event, shape.code)}
                      onPointerEnter={(event) => handlePointerActivity(event, shape.code)}
                      onPointerMove={moveTooltip}
                    >
                      <title>{`${result.state.name}: ${formatMargin(result.simulatedMargin)}`}</title>
                    </path>
                  );
                })}
              </g>
              <g className={styles.labelLayer} aria-hidden="true">
                {stateShapes.map((shape) => {
                  const result = resultByCode.get(shape.code);

                  if (!result || !shape.labelVisible) {
                    return null;
                  }

                  return (
                    <text
                      key={`${shape.code}-label`}
                      className={styles.stateLabel}
                      x={shape.labelX}
                      y={shape.labelY}
                      style={getStyleForResult(result)}
                    >
                      {shape.code}
                    </text>
                  );
                })}
              </g>
            </svg>
          ) : null}

          <div className={styles.smallStateDock} aria-label="Small-state selector">
            {smallStateCodes.map((stateCode) => {
              const result = resultByCode.get(stateCode);

              if (!result) {
                return null;
              }

              const isSelected = selectedStateCode === stateCode;

              return (
                <button
                  key={stateCode}
                  type="button"
                  className={styles.smallStateButton}
                  style={getStyleForResult(result)}
                  aria-pressed={isSelected}
                  data-selected={isSelected}
                  title={`${result.state.name}: ${formatMargin(result.simulatedMargin)}`}
                  aria-label={`${result.state.name}, ${result.state.electoralVotes} electoral votes, current ${formatMargin(result.simulatedMargin)}`}
                  onClick={() => handleSelectState(stateCode)}
                  onPointerEnter={(event) => handlePointerActivity(event, stateCode)}
                  onPointerMove={moveTooltip}
                >
                  <span>{stateCode}</span>
                  <small>{result.state.electoralVotes}</small>
                </button>
              );
            })}
          </div>

          {tooltipResult ? (
            <div
              className={styles.stateTooltip}
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
              }}
            >
              <strong>{tooltipResult.state.name}</strong>
              <div>
                <span>EV</span>
                <b>{tooltipResult.state.electoralVotes}</b>
                <span>Baseline</span>
                <b>{formatMargin(tooltipResult.state.baselineMargin)}</b>
                <span>Current</span>
                <b>{formatMargin(tooltipResult.simulatedMargin)}</b>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
