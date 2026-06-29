"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
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
  id: keyof typeof fipsToStateCode;
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

const fipsToStateCode = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "11": "DC",
  "12": "FL",
  "13": "GA",
  "15": "HI",
  "16": "ID",
  "17": "IL",
  "18": "IN",
  "19": "IA",
  "20": "KS",
  "21": "KY",
  "22": "LA",
  "23": "ME",
  "24": "MD",
  "25": "MA",
  "26": "MI",
  "27": "MN",
  "28": "MS",
  "29": "MO",
  "30": "MT",
  "31": "NE",
  "32": "NV",
  "33": "NH",
  "34": "NJ",
  "35": "NM",
  "36": "NY",
  "37": "NC",
  "38": "ND",
  "39": "OH",
  "40": "OK",
  "41": "OR",
  "42": "PA",
  "44": "RI",
  "45": "SC",
  "46": "SD",
  "47": "TN",
  "48": "TX",
  "49": "UT",
  "50": "VT",
  "51": "VA",
  "53": "WA",
  "54": "WV",
  "55": "WI",
  "56": "WY",
} as const;

const smallStateCodes = ["VT", "NH", "MA", "RI", "CT", "NJ", "DE", "MD", "DC"];
const labelOmitCodes = new Set([...smallStateCodes, "HI"]);
const mapAssetPath = "/us-states-albers-10m.json";

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

function shapeForGeometry(decodedArcs: MapPoint[][], geometry: TopologyGeometry): StateShape {
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
  const code = fipsToStateCode[geometry.id];

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
  return topology.objects.states.geometries.map((geometry) => {
    return shapeForGeometry(decodedArcs, geometry);
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
  const [topology, setTopology] = useState<StatesTopology | null>(null);
  const [hasMapError, setHasMapError] = useState(false);
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let isMounted = true;

    fetch(mapAssetPath)
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

  return (
    <section className={styles.mapPanel} aria-label="State-level electoral map">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Electoral map</p>
          <h2>State scenario view</h2>
        </div>
        <div className={styles.legend} aria-label="Margin legend">
          <span><b className={styles.legendTilt} />TILT</span>
          <span><b className={styles.legendLean} />LEAN</span>
          <span><b className={styles.legendLikely} />LIKELY</span>
          <span><b className={styles.legendSafe} />SAFE</span>
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
