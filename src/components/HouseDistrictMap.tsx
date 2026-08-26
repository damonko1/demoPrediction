"use client";

import { Crosshair, Map as MapIcon, MapPinned } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { getStateColor } from "@/lib/getStateColor";
import { publicAssetPath } from "@/lib/publicAssetPath";
import {
  formatLegislativeParty,
  formatMargin,
} from "@/lib/format";
import type { LegislativeSeatResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type HouseDistrictMapProps = {
  results: LegislativeSeatResult[];
  selectedSeatId: string;
  customStateCodes?: ReadonlySet<string>;
  customSeatIds?: ReadonlySet<string>;
  onSelectSeat: (seatId: string) => void;
};

type HouseDistrictMapAsset = {
  source: {
    name: string;
    url: string;
    retrievalDate: string;
    vintage: string;
  };
  viewBox: [number, number, number, number];
  districts: HouseDistrictShape[];
  nonVotingDelegateDistricts: {
    id: string;
    stateCode: string;
    stateName: string;
    districtLabel: string;
    censusGeoid: string;
    censusName: string;
  }[];
};

type HouseDistrictShape = {
  id: string;
  stateCode: string;
  stateName: string;
  district: number;
  districtLabel: string;
  censusGeoid: string;
  censusName: string;
  path: string;
  labelX: number;
  labelY: number;
  bounds: [number, number, number, number];
};

type StateGroup = {
  stateCode: string;
  stateName: string;
  results: LegislativeSeatResult[];
  demSeats: number;
  repSeats: number;
  flaggedSeats: number;
};

const houseDistrictMapAssetPath = publicAssetPath("us-house-districts-119-20m.json");
const expectedVotingDistricts = 435;
const nationalStateCode = "national";
type HouseZoomMode = "national" | "state" | "district";

function getSeatStyle(result: LegislativeSeatResult) {
  const color = getStateColor(result.simulatedMargin);

  return {
    "--seat-fill": color.background,
    "--seat-stroke": color.border,
    "--seat-fg": color.foreground,
    "--seat-fill-dark": color.darkBackground,
    "--seat-stroke-dark": color.darkBorder,
    "--seat-fg-dark": color.darkForeground,
  } as CSSProperties;
}

function getDistrictButtonLabel(result: LegislativeSeatResult) {
  if ("district" in result.seat && result.seat.district === 0) {
    return "AL";
  }

  return "district" in result.seat ? String(result.seat.district) : result.seat.id;
}

function getDistrictSelectLabel(result: LegislativeSeatResult) {
  const flags = getSeatFlags(result);
  const flagLabel = flags.length ? ` / ${flags.join(", ")}` : "";

  return `${result.seat.districtLabel}: ${formatMargin(result.simulatedMargin)}${flagLabel}`;
}

function getSeatFlags(result: LegislativeSeatResult) {
  const flags: string[] = [];

  if (result.seat.uncontested) {
    flags.push("uncontested");
  }

  if (result.seat.lowData) {
    flags.push("low data");
  }

  if (result.seat.missingVoteTotal) {
    flags.push("missing totals");
  }

  if (result.seat.cancelledElection) {
    flags.push("cancelled");
  }

  return flags;
}

function getDistrictAriaLabel(result: LegislativeSeatResult) {
  const flags = getSeatFlags(result);
  const flagText = flags.length ? `, ${flags.join(", ")}` : "";

  return `${result.seat.districtLabel}, simulated ${formatLegislativeParty(result.simulatedWinner)} ${formatMargin(result.simulatedMargin)}${flagText}`;
}

function groupResultsByState(results: LegislativeSeatResult[]): StateGroup[] {
  const groups = new Map<string, LegislativeSeatResult[]>();

  results.forEach((result) => {
    const stateResults = groups.get(result.seat.stateCode) ?? [];
    stateResults.push(result);
    groups.set(result.seat.stateCode, stateResults);
  });

  return [...groups.entries()]
    .map(([stateCode, stateResults]) => {
      const demSeats = stateResults.filter(
        (result) => result.simulatedControlParty === "democratic",
      ).length;
      const repSeats = stateResults.length - demSeats;
      const flaggedSeats = stateResults.filter(
        (result) => result.seat.lowData || result.seat.uncontested,
      ).length;

      return {
        stateCode,
        stateName: stateResults[0].seat.stateName,
        results: [...stateResults].sort(
          (left, right) => left.seat.sortIndex - right.seat.sortIndex,
        ),
        demSeats,
        repSeats,
        flaggedSeats,
      };
    })
    .sort((left, right) => left.stateCode.localeCompare(right.stateCode));
}

function formatViewBox(viewBox: [number, number, number, number]) {
  return viewBox.join(" ");
}

function getStateBounds(
  districts: HouseDistrictShape[],
  focusedStateCode: string | null,
) {
  const stateDistricts = focusedStateCode
    ? districts.filter((district) => district.stateCode === focusedStateCode)
    : [];

  if (!stateDistricts.length) {
    return null;
  }

  return stateDistricts.reduce<[number, number, number, number]>(
    (bounds, district) => [
      Math.min(bounds[0], district.bounds[0]),
      Math.min(bounds[1], district.bounds[1]),
      Math.max(bounds[2], district.bounds[2]),
      Math.max(bounds[3], district.bounds[3]),
    ],
    [
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ],
  );
}

function getPaddedViewBox(
  bounds: [number, number, number, number],
  paddingScale = 0.08,
  minimumPadding = 12,
) {
  const width = bounds[2] - bounds[0];
  const height = bounds[3] - bounds[1];
  const padding = Math.max(width, height) * paddingScale + minimumPadding;

  return [
    Number((bounds[0] - padding).toFixed(1)),
    Number((bounds[1] - padding).toFixed(1)),
    Number((width + padding * 2).toFixed(1)),
    Number((height + padding * 2).toFixed(1)),
  ] as [number, number, number, number];
}

function shouldShowDistrictLabel({
  district,
  focusedStateCode,
  hoveredSeatId,
  selectedSeatId,
}: {
  district: HouseDistrictShape;
  focusedStateCode: string | null;
  hoveredSeatId: string | null;
  selectedSeatId: string;
}) {
  if (district.id === selectedSeatId || district.id === hoveredSeatId) {
    return true;
  }

  if (district.stateCode !== focusedStateCode) {
    return false;
  }

  const width = district.bounds[2] - district.bounds[0];
  const height = district.bounds[3] - district.bounds[1];

  return width >= 16 && height >= 13;
}

export function HouseDistrictMap({
  results,
  selectedSeatId,
  customStateCodes = new Set<string>(),
  customSeatIds = new Set<string>(),
  onSelectSeat,
}: HouseDistrictMapProps) {
  const districtPathRefs = useRef(new Map<string, SVGPathElement>());
  const [mapAsset, setMapAsset] = useState<HouseDistrictMapAsset | null>(null);
  const [hasMapError, setHasMapError] = useState(false);
  const [focusedStateCode, setFocusedStateCode] = useState<string | null>(null);
  const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null);
  const [zoomMode, setZoomMode] = useState<HouseZoomMode>("national");

  useEffect(() => {
    let isMounted = true;

    fetch(houseDistrictMapAssetPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`House map asset failed with status ${response.status}`);
        }

        return response.json() as Promise<HouseDistrictMapAsset>;
      })
      .then((asset) => {
        if (isMounted) {
          setMapAsset(asset);
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

  const resultById = useMemo(() => {
    return new Map(results.map((result) => [result.seat.id, result]));
  }, [results]);
  const groups = useMemo(() => groupResultsByState(results), [results]);
  const selectedResult =
    resultById.get(selectedSeatId) ?? results[0] ?? null;
  const selectorStateCode =
    focusedStateCode ?? selectedResult?.seat.stateCode ?? groups[0]?.stateCode ?? null;
  const selectorGroup =
    groups.find((group) => group.stateCode === selectorStateCode) ?? groups[0];
  const districtSelectorValue =
    selectedResult &&
    selectorGroup?.results.some((result) => result.seat.id === selectedResult.seat.id)
      ? selectedResult.seat.id
      : selectorGroup?.results[0]?.seat.id ?? "";
  const hoveredResult = hoveredSeatId ? resultById.get(hoveredSeatId) : null;
  const readoutResult = hoveredResult ?? selectedResult;
  const selectedDistrictShape = mapAsset
    ? mapAsset.districts.find((district) => district.id === selectedSeatId) ?? null
    : null;
  const renderedDistrictCount =
    mapAsset?.districts.filter((district) => resultById.has(district.id)).length ?? 0;
  const interactiveDistrictIds = useMemo(
    () =>
      mapAsset?.districts
        .filter((district) => resultById.has(district.id))
        .map((district) => district.id) ?? [],
    [mapAsset, resultById],
  );
  const flaggedDistrictCount = results.filter(
    (result) => result.seat.lowData || result.seat.uncontested,
  ).length;
  const activeStateCode =
    focusedStateCode ?? selectedResult?.seat.stateCode ?? selectorStateCode;
  const stateBounds = mapAsset
    ? getStateBounds(mapAsset.districts, activeStateCode)
    : null;
  const viewBox = mapAsset
    ? zoomMode === "district" && selectedDistrictShape
      ? getPaddedViewBox(selectedDistrictShape.bounds, 0.78, 20)
      : zoomMode === "state" && stateBounds
        ? getPaddedViewBox(stateBounds, 0.1, 14)
      : mapAsset.viewBox
    : [0, 0, 1040, 640] as [number, number, number, number];
  const delegateSummary = mapAsset
    ? mapAsset.nonVotingDelegateDistricts.map((district) => district.id).join(", ")
    : "DC-AL, PR-AL";

  function selectDistrict(result: LegislativeSeatResult, shouldZoomToDistrict = true) {
    onSelectSeat(result.seat.id);
    setFocusedStateCode(result.seat.stateCode);

    if (shouldZoomToDistrict) {
      setZoomMode("district");
    }
  }

  function handleStateZoomChange(stateCode: string) {
    if (stateCode === nationalStateCode) {
      setFocusedStateCode(null);
      setZoomMode("national");
      return;
    }

    const stateGroup = groups.find((group) => group.stateCode === stateCode);
    setFocusedStateCode(stateCode);
    setZoomMode("state");

    if (stateGroup?.results[0]) {
      onSelectSeat(stateGroup.results[0].seat.id);
    }
  }

  function handleDistrictKeyDown(
    event: KeyboardEvent<SVGPathElement>,
    result: LegislativeSeatResult,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectDistrict(result);
      return;
    }

    const currentIndex = interactiveDistrictIds.indexOf(result.seat.id);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % interactiveDistrictIds.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + interactiveDistrictIds.length) %
        interactiveDistrictIds.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = interactiveDistrictIds.length - 1;
    }

    if (nextIndex === null || interactiveDistrictIds.length === 0) {
      return;
    }

    event.preventDefault();
    const nextSeatId = interactiveDistrictIds[nextIndex];
    const nextResult = resultById.get(nextSeatId);

    if (!nextResult) {
      return;
    }

    onSelectSeat(nextSeatId);
    setHoveredSeatId(nextSeatId);

    if (zoomMode !== "national") {
      setFocusedStateCode(nextResult.seat.stateCode);
    }

    window.requestAnimationFrame(() => {
      districtPathRefs.current.get(nextSeatId)?.focus();
    });
  }

  return (
    <section className={styles.mapPanel} aria-label="House district map">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>House map</p>
          <h2>119th districts</h2>
        </div>
        <div className={styles.legend} aria-label="House district legend">
          <span><b className={styles.legendTilt} />Tilt</span>
          <span><b className={styles.legendLean} />Lean</span>
          <span><b className={styles.legendLikely} />Likely</span>
          <span><b className={styles.legendSafe} />Safe</span>
          <span><b className={styles.legendFlagged} />Flagged</span>
          <span><b className={styles.legendCustom} />Custom</span>
        </div>
      </div>

      <div className={styles.houseMapControls}>
        <label className={styles.mapSelectControl}>
          <span>State zoom</span>
          <select
            aria-label="House state zoom"
            onChange={(event) => {
              handleStateZoomChange(event.target.value);
            }}
            value={zoomMode === "national" ? nationalStateCode : activeStateCode ?? nationalStateCode}
          >
            <option value={nationalStateCode}>National</option>
            {groups.map((group) => (
              <option key={group.stateCode} value={group.stateCode}>
                {group.stateName} ({group.results.length}){customStateCodes.has(group.stateCode) ? " · Custom" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.mapSelectControl}>
          <span>District selector</span>
          <select
            aria-label="House district selector"
            onChange={(event) => {
              const result = resultById.get(event.target.value);

              if (result) {
                selectDistrict(result);
              }
            }}
            value={districtSelectorValue}
          >
            {selectorGroup?.results.map((result) => (
              <option key={result.seat.id} value={result.seat.id}>
                {getDistrictSelectLabel(result)}{customSeatIds.has(result.seat.id) ? " / custom" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className={styles.houseZoomToolbar}
        aria-label="House map zoom controls"
        role="group"
      >
        <button
          aria-pressed={zoomMode === "national"}
          className={zoomMode === "national" ? styles.activeZoomButton : ""}
          onClick={() => {
            setFocusedStateCode(null);
            setZoomMode("national");
          }}
          type="button"
        >
          <MapIcon size={14} strokeWidth={2.2} />
          <span>National</span>
        </button>
        <button
          aria-pressed={zoomMode === "state"}
          className={zoomMode === "state" ? styles.activeZoomButton : ""}
          disabled={!activeStateCode}
          onClick={() => {
            if (activeStateCode) {
              setFocusedStateCode(activeStateCode);
              setZoomMode("state");
            }
          }}
          type="button"
        >
          <MapPinned size={14} strokeWidth={2.2} />
          <span>{activeStateCode ? `${activeStateCode} state` : "State"}</span>
        </button>
        <button
          aria-pressed={zoomMode === "district"}
          className={zoomMode === "district" ? styles.activeZoomButton : ""}
          disabled={!selectedDistrictShape}
          onClick={() => {
            if (selectedResult) {
              setFocusedStateCode(selectedResult.seat.stateCode);
              setZoomMode("district");
            }
          }}
          type="button"
        >
          <Crosshair size={14} strokeWidth={2.2} />
          <span>{selectedResult ? selectedResult.seat.districtLabel : "District"}</span>
        </button>
      </div>

      <details className={styles.mapDataDisclosure}>
        <summary>Map coverage and data flags</summary>
        <div
          className={styles.houseMapStatus}
          aria-label="House map data status"
          aria-live="polite"
        >
          <div>
          <span>Rendered</span>
          <strong>
            {renderedDistrictCount || results.length}/{expectedVotingDistricts}
          </strong>
          <small>Voting districts</small>
        </div>
          <div>
          <span>Delegates</span>
          <strong>Separate</strong>
          <small>{delegateSummary}</small>
        </div>
          <div>
          <span>Flags</span>
          <strong>{flaggedDistrictCount}</strong>
          <small>Uncontested / low data</small>
        </div>
          <div>
          <span>Source</span>
          <strong>US Census</strong>
          <small>{mapAsset?.source.vintage ?? "119th district boundaries"}</small>
          </div>
        </div>
      </details>

      <div className={styles.houseBoundaryViewport}>
        <p className={styles.srOnly} id="house-map-keyboard-help">
          Use the arrow keys to move between districts, Home or End to jump to
          the first or last district, and Enter or Space to zoom into a district.
        </p>
        <div
          className={styles.houseBoundaryCanvas}
          onPointerLeave={() => setHoveredSeatId(null)}
        >
          {hasMapError ? (
            <div className={styles.mapLoading} role="alert">
              House district map unavailable
            </div>
          ) : null}
          {!mapAsset && !hasMapError ? (
            <div className={styles.mapLoading} role="status">
              Loading House districts
            </div>
          ) : null}
          {mapAsset ? (
            <svg
              aria-describedby="house-map-keyboard-help"
              aria-label="House districts colored by simulated winner and margin"
              className={styles.houseDistrictMap}
              data-zoom-mode={zoomMode}
              role="group"
              viewBox={formatViewBox(viewBox)}
            >
              <g className={styles.houseDistrictLayer}>
                {mapAsset.districts.map((district) => {
                  const result = resultById.get(district.id);

                  if (!result) {
                    return null;
                  }

                  const flags = getSeatFlags(result);

                  return (
                    <path
                      aria-label={`${getDistrictAriaLabel(result)}${
                        customSeatIds.has(result.seat.id) ||
                        customStateCodes.has(result.seat.stateCode)
                          ? ", custom assumptions"
                          : ""
                      }`}
                      aria-pressed={result.seat.id === selectedSeatId}
                      className={styles.houseDistrictShape}
                      d={district.path}
                      data-flipped={result.flipped}
                      data-hovered={result.seat.id === hoveredSeatId}
                      data-low-data={result.seat.lowData}
                      data-selected={result.seat.id === selectedSeatId}
                      data-uncontested={result.seat.uncontested}
                      data-flagged={flags.length > 0}
                      data-custom={
                        customSeatIds.has(result.seat.id) ||
                        customStateCodes.has(result.seat.stateCode)
                      }
                      fillRule="evenodd"
                      key={district.id}
                      onClick={() => selectDistrict(result)}
                      onKeyDown={(event) => handleDistrictKeyDown(event, result)}
                      onPointerEnter={() => setHoveredSeatId(result.seat.id)}
                      ref={(element) => {
                        if (element) {
                          districtPathRefs.current.set(result.seat.id, element);
                        } else {
                          districtPathRefs.current.delete(result.seat.id);
                        }
                      }}
                      role="button"
                      style={getSeatStyle(result)}
                      tabIndex={result.seat.id === selectedSeatId ? 0 : -1}
                    >
                      <title>{getDistrictSelectLabel(result)}</title>
                    </path>
                  );
                })}
              </g>
              {selectedDistrictShape && selectedResult ? (
                <g className={styles.mapSelectionLayer} aria-hidden="true">
                  <path
                    className={styles.houseDistrictSelectedOutline}
                    d={selectedDistrictShape.path}
                    fillRule="evenodd"
                    style={getSeatStyle(selectedResult)}
                  />
                </g>
              ) : null}
              <g aria-hidden="true">
                {mapAsset.districts
                  .filter((district) =>
                    shouldShowDistrictLabel({
                      district,
                      focusedStateCode,
                      hoveredSeatId,
                      selectedSeatId,
                    }),
                  )
                  .map((district) => (
                    <text
                      className={styles.houseDistrictLabel}
                      key={`${district.id}-label`}
                      x={district.labelX}
                      y={district.labelY}
                    >
                      {district.district === 0 ? "AL" : district.district}
                    </text>
                  ))}
              </g>
            </svg>
          ) : null}
        </div>
      </div>

      {readoutResult ? (
        <div className={styles.houseMapReadout} aria-live="polite">
          <div>
            <span>{hoveredResult ? "Hover" : "Selected"}</span>
            <strong>{readoutResult.seat.districtLabel}</strong>
            <small>{readoutResult.seat.stateName}</small>
          </div>
          <div>
            <span>Simulated winner</span>
            <strong>
              {formatLegislativeParty(readoutResult.simulatedWinner)} /{" "}
              {formatMargin(readoutResult.simulatedMargin)}
            </strong>
            <small>{readoutResult.flipped ? "Flipped" : "No flip"}</small>
          </div>
          <div>
            <span>Data flags</span>
            <strong>
              {getSeatFlags(readoutResult).length
                ? getSeatFlags(readoutResult).join(", ")
                : "Clear"}
            </strong>
            <small>
              {readoutResult.seat.totalVotes.toLocaleString()} recorded votes
            </small>
          </div>
        </div>
      ) : null}

      {selectorGroup ? (
        <div className={styles.houseStateFocus}>
          <div className={styles.houseFocusHeader}>
            <div>
              <span>State focus</span>
              <strong>{selectorGroup.stateName}</strong>
            </div>
            <small>
              D{selectorGroup.demSeats} / R{selectorGroup.repSeats}
              {selectorGroup.flaggedSeats ? ` / ${selectorGroup.flaggedSeats} flagged` : ""}
            </small>
          </div>
          <div
            className={styles.houseFocusGrid}
            aria-label={`${selectorGroup.stateName} districts`}
            role="group"
          >
            {selectorGroup.results.map((result) => (
              <button
                aria-label={getDistrictAriaLabel(result)}
                className={styles.houseFocusButton}
                data-flipped={result.flipped}
                data-low-data={result.seat.lowData}
                data-selected={result.seat.id === selectedSeatId}
                data-uncontested={result.seat.uncontested}
                data-custom={
                  customSeatIds.has(result.seat.id) ||
                  customStateCodes.has(result.seat.stateCode)
                }
                key={result.seat.id}
                onClick={() => selectDistrict(result)}
                onPointerEnter={() => setHoveredSeatId(result.seat.id)}
                style={getSeatStyle(result)}
                title={getDistrictSelectLabel(result)}
                type="button"
              >
                <span>{getDistrictButtonLabel(result)}</span>
                <small>
                  {formatMargin(result.simulatedMargin)}
                </small>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
