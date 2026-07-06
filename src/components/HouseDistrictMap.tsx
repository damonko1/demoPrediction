"use client";

import type { CSSProperties } from "react";
import { getStateColor } from "@/lib/getStateColor";
import {
  formatLegislativePartyShort,
  formatMargin,
} from "@/lib/format";
import type { LegislativeSeatResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type HouseDistrictMapProps = {
  results: LegislativeSeatResult[];
  selectedSeatId: string;
  onSelectSeat: (seatId: string) => void;
};

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

function groupResultsByState(results: LegislativeSeatResult[]) {
  const groups = new Map<string, LegislativeSeatResult[]>();

  results.forEach((result) => {
    const stateResults = groups.get(result.seat.stateCode) ?? [];
    stateResults.push(result);
    groups.set(result.seat.stateCode, stateResults);
  });

  return [...groups.entries()].map(([stateCode, stateResults]) => ({
    stateCode,
    stateName: stateResults[0].seat.stateName,
    results: stateResults,
  }));
}

export function HouseDistrictMap({
  results,
  selectedSeatId,
  onSelectSeat,
}: HouseDistrictMapProps) {
  const groupedResults = groupResultsByState(results);

  return (
    <section className={styles.mapPanel} aria-label="House district matrix">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>House map</p>
          <h2>All 435 districts</h2>
        </div>
        <div className={styles.legend}>
          <span>
            <b className={styles.legendTilt} />
            Lean / tilt
          </span>
          <span>
            <b className={styles.legendLikely} />
            Strong D
          </span>
          <span>
            <b className={styles.legendSafe} />
            Strong R
          </span>
        </div>
      </div>

      <div className={styles.houseMapViewport}>
        <div className={styles.houseMatrix}>
          {groupedResults.map((group) => {
            const demSeats = group.results.filter(
              (result) => result.simulatedControlParty === "democratic",
            ).length;
            const repSeats = group.results.length - demSeats;

            return (
              <section className={styles.houseStateBlock} key={group.stateCode}>
                <div className={styles.houseStateHeader}>
                  <span>
                    <b>{group.stateCode}</b>
                    <small>{group.results.length}</small>
                  </span>
                  <strong>
                    D{demSeats} / R{repSeats}
                  </strong>
                </div>
                <div
                  className={styles.districtSeatGrid}
                  style={{ "--district-count": group.results.length } as CSSProperties}
                >
                  {group.results.map((result) => (
                    <button
                      aria-label={`${result.seat.districtLabel}, simulated ${formatLegislativePartyShort(result.simulatedWinner)} ${formatMargin(result.simulatedMargin)}`}
                      className={styles.districtSeatButton}
                      data-flipped={result.flipped}
                      data-low-data={result.seat.lowData}
                      data-selected={result.seat.id === selectedSeatId}
                      key={result.seat.id}
                      onClick={() => onSelectSeat(result.seat.id)}
                      style={getSeatStyle(result)}
                      title={`${result.seat.districtLabel}: ${formatMargin(result.simulatedMargin)}`}
                      type="button"
                    >
                      <span>{getDistrictButtonLabel(result)}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
