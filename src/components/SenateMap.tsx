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
import {
  stateCodeByMapShapeId,
  stateMapShapeAssetPath,
} from "@/data/states";
import { getStateColor } from "@/lib/getStateColor";
import {
  formatLegislativePartyShort,
  formatMargin,
} from "@/lib/format";
import type { LegislativeSeatResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type SenateMapProps = {
  results: LegislativeSeatResult[];
  selectedSeatId: string;
  onSelectSeat: (seatId: string) => void;
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

const smallStateCodes = ["VT", "NH", "MA", "RI", "CT", "NJ", "DE", "MD"];
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
    labelVisible:
      !labelOmitCodes.has(code) &&
      bounds.maxX - bounds.minX > 18 &&
      bounds.maxY - bounds.minY > 14,
  };
}

function buildStateShapes(topology: StatesTopology) {
  const decodedArcs = decodeArcs(topology);
  return topology.objects.states.geometries.flatMap((geometry) => {
    const shape = shapeForGeometry(decodedArcs, geometry);
    return shape ? [shape] : [];
  });
}

function pickSeatForState(results: LegislativeSeatResult[]) {
  return [...results].sort((left, right) => {
    const leftUpNext = "upNextCycle" in left.seat && left.seat.upNextCycle;
    const rightUpNext = "upNextCycle" in right.seat && right.seat.upNextCycle;

    if (leftUpNext !== rightUpNext) {
      return leftUpNext ? -1 : 1;
    }

    return left.marginToFlip - right.marginToFlip;
  })[0];
}

function hasActiveCycleRace(results: readonly LegislativeSeatResult[]) {
  return results.some((result) => "upNextCycle" in result.seat && result.seat.upNextCycle);
}

function hasSpecialElection(results: readonly LegislativeSeatResult[]) {
  return results.some((result) => result.seat.specialElection);
}

function hasFlippedSeat(results: readonly LegislativeSeatResult[]) {
  return results.some((result) => result.flipped);
}

function getCycleLabel(result: LegislativeSeatResult) {
  if (!("upNextCycle" in result.seat)) {
    return "";
  }

  return result.seat.upNextCycle ? "Up this cycle" : "Not up this cycle";
}

function getStateStyle(results: LegislativeSeatResult[]) {
  const demSeats = results.filter(
    (result) => result.simulatedControlParty === "democratic",
  ).length;
  const repSeats = results.length - demSeats;

  if (demSeats === repSeats) {
    return {
      "--state-fill": "rgba(216, 148, 33, 0.3)",
      "--state-stroke": "rgba(166, 107, 24, 0.78)",
      "--state-fg": "#4f3b18",
      "--state-fill-dark": "rgba(216, 180, 90, 0.28)",
      "--state-stroke-dark": "rgba(216, 180, 90, 0.72)",
      "--state-fg-dark": "#f4df9c",
    } as CSSProperties;
  }

  const closestSeat = pickSeatForState(results);
  const signedMargin =
    demSeats > repSeats
      ? Math.abs(closestSeat.simulatedMargin)
      : -Math.abs(closestSeat.simulatedMargin);
  const color = getStateColor(signedMargin);

  return {
    "--state-fill": color.background,
    "--state-stroke": color.border,
    "--state-fg": color.foreground,
    "--state-fill-dark": color.darkBackground,
    "--state-stroke-dark": color.darkBorder,
    "--state-fg-dark": color.darkForeground,
  } as CSSProperties;
}

function groupResultsByState(results: LegislativeSeatResult[]) {
  const groups = new Map<string, LegislativeSeatResult[]>();

  results.forEach((result) => {
    const stateResults = groups.get(result.seat.stateCode) ?? [];
    stateResults.push(result);
    groups.set(result.seat.stateCode, stateResults);
  });

  return groups;
}

export function SenateMap({
  results,
  selectedSeatId,
  onSelectSeat,
}: SenateMapProps) {
  const mapCanvasRef = useRef<HTMLDivElement>(null);
  const [topology, setTopology] = useState<StatesTopology | null>(null);
  const [hasMapError, setHasMapError] = useState(false);
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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

  const resultsByState = useMemo(() => groupResultsByState(results), [results]);
  const selectedResult = results.find((result) => result.seat.id === selectedSeatId);
  const selectedStateCode = selectedResult?.seat.stateCode;
  const stateShapes = useMemo(() => {
    if (!topology) {
      return [];
    }

    return buildStateShapes(topology).filter((shape) => resultsByState.has(shape.code));
  }, [resultsByState, topology]);
  const hoveredResults = hoveredStateCode
    ? resultsByState.get(hoveredStateCode) ?? []
    : [];
  const selectedShape =
    stateShapes.find((shape) => shape.code === selectedStateCode) ?? null;
  const selectedShapeResults = selectedShape
    ? resultsByState.get(selectedShape.code) ?? []
    : [];
  const selectedStateName = selectedShapeResults[0]?.seat.stateName ?? null;
  const selectedStateSortedSeats = [...selectedShapeResults].sort((left, right) => {
    const leftUpNext = "upNextCycle" in left.seat && left.seat.upNextCycle;
    const rightUpNext = "upNextCycle" in right.seat && right.seat.upNextCycle;

    if (leftUpNext !== rightUpNext) {
      return leftUpNext ? -1 : 1;
    }

    return left.seat.sortIndex - right.seat.sortIndex;
  });
  const viewBox = topology
    ? `${topology.bbox[0] - 10} ${topology.bbox[1] - 10} ${topology.bbox[2] - topology.bbox[0] + 20} ${topology.bbox[3] - topology.bbox[1] + 20}`
    : "-68 3 1036 614";

  function selectState(stateCode: string) {
    const stateResults = resultsByState.get(stateCode);
    const seat = stateResults ? pickSeatForState(stateResults) : null;

    if (seat) {
      onSelectSeat(seat.seat.id);
    }
  }

  function moveTooltip(event: PointerEvent<Element>) {
    const bounds = mapCanvasRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    setTooltipPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }

  function handleStateKeyDown(
    event: KeyboardEvent<SVGPathElement>,
    stateCode: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectState(stateCode);
    }
  }

  return (
    <section className={styles.mapPanel} aria-label="Senate state map">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Senate map</p>
          <h2>Two seats per state</h2>
        </div>
        <div className={styles.legend}>
          <span>
            <b className={styles.legendTilt} />
            Split
          </span>
          <span>
            <b className={styles.legendLikely} />
            D control
          </span>
          <span>
            <b className={styles.legendSafe} />
            R control
          </span>
          <span>
            <b className={styles.legendLean} />
            Up this cycle
          </span>
          <span>
            <b className={styles.legendFlagged} />
            No active race / special flag
          </span>
        </div>
      </div>

      <div className={styles.mapViewport}>
        <div
          className={styles.mapCanvas}
          onPointerLeave={() => setHoveredStateCode(null)}
          ref={mapCanvasRef}
        >
          {hasMapError ? (
            <div className={styles.mapLoading}>Map asset unavailable</div>
          ) : null}
          {!topology && !hasMapError ? (
            <div className={styles.mapLoading}>Loading Senate map</div>
          ) : null}
          {topology ? (
            <svg
              aria-label="United States Senate state map"
              className={styles.usMap}
              role="img"
              viewBox={viewBox}
            >
              <g className={styles.stateLayer}>
                {stateShapes.map((shape) => {
                  const stateResults = resultsByState.get(shape.code) ?? [];

                  return (
                    <path
                      aria-label={`${shape.code} Senate seats`}
                      className={styles.stateShape}
                      d={shape.path}
                      data-flipped={hasFlippedSeat(stateResults)}
                      data-no-active-race={!hasActiveCycleRace(stateResults)}
                      data-selected={shape.code === selectedStateCode}
                      data-special-election={hasSpecialElection(stateResults)}
                      key={shape.code}
                      onClick={() => selectState(shape.code)}
                      onKeyDown={(event) => handleStateKeyDown(event, shape.code)}
                      onPointerEnter={(event) => {
                        setHoveredStateCode(shape.code);
                        moveTooltip(event);
                      }}
                      onPointerMove={moveTooltip}
                      role="button"
                      style={getStateStyle(stateResults)}
                      tabIndex={0}
                    />
                  );
                })}
              </g>
              <g aria-hidden="true">
                {stateShapes
                  .filter((shape) => shape.labelVisible)
                  .map((shape) => (
                    <text
                      className={styles.stateLabel}
                      key={`${shape.code}-label`}
                      x={shape.labelX}
                      y={shape.labelY}
                    >
                      {shape.code}
                    </text>
                  ))}
              </g>
              {selectedShape && selectedShapeResults.length ? (
                <g className={styles.mapSelectionLayer} aria-hidden="true">
                  <path
                    className={styles.stateSelectedOutline}
                    d={selectedShape.path}
                    fillRule="evenodd"
                    style={getStateStyle(selectedShapeResults)}
                  />
                </g>
              ) : null}
            </svg>
          ) : null}

          <div className={styles.smallStateDock} aria-label="Small state selector">
            {smallStateCodes.map((stateCode) => {
              const stateResults = resultsByState.get(stateCode) ?? [];
              const pickedSeat = stateResults.length ? pickSeatForState(stateResults) : null;

              return (
                <button
                  aria-label={`Select ${stateCode} Senate seats`}
                  className={styles.smallStateButton}
                  data-selected={stateCode === selectedStateCode}
                  key={stateCode}
                  onClick={() => selectState(stateCode)}
                  style={stateResults.length ? getStateStyle(stateResults) : undefined}
                  type="button"
                >
                  <span>{stateCode}</span>
                  <small>
                    {pickedSeat
                      ? `${formatLegislativePartyShort(pickedSeat.simulatedWinner)} ${
                          getCycleLabel(pickedSeat) === "Up this cycle" ? "up" : ""
                        }`.trim()
                      : "--"}
                  </small>
                </button>
              );
            })}
          </div>

          {hoveredResults.length > 0 ? (
            <div
              className={styles.stateTooltip}
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
              }}
            >
              <strong>{hoveredResults[0].seat.stateName}</strong>
              <div>
                {hoveredResults.map((result) => (
                  <div className={styles.tooltipSeatRow} key={result.seat.id}>
                    <span>
                      {"senateClass" in result.seat
                        ? `Class ${result.seat.senateClass}`
                        : result.seat.id}
                      {" "}
                      {getCycleLabel(result)}
                      {result.seat.specialElection ? " / Special" : ""}
                    </span>
                    <b>{formatMargin(result.simulatedMargin)}</b>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {selectedStateSortedSeats.length > 0 ? (
        <div
          className={styles.senateSeatSelector}
          aria-label={`${selectedStateName ?? "Selected state"} Senate seats`}
        >
          <div className={styles.senateSeatSelectorHeader}>
            <span>{selectedStateName}</span>
            <strong>{hasActiveCycleRace(selectedStateSortedSeats) ? "Active race" : "No active race"}</strong>
          </div>
          <div className={styles.senateSeatGrid}>
            {selectedStateSortedSeats.map((result) => (
              <button
                aria-label={`Select ${result.seat.districtLabel}`}
                className={styles.senateSeatButton}
                data-selected={result.seat.id === selectedSeatId}
                data-special-election={result.seat.specialElection}
                data-up-next={"upNextCycle" in result.seat && result.seat.upNextCycle}
                key={result.seat.id}
                onClick={() => onSelectSeat(result.seat.id)}
                type="button"
              >
                <span>
                  {"senateClass" in result.seat
                    ? `Class ${result.seat.senateClass}`
                    : result.seat.id}
                </span>
                <strong>{formatMargin(result.simulatedMargin)}</strong>
                <small>
                  {getCycleLabel(result)}
                  {result.seat.specialElection ? " / special election" : ""}
                </small>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
