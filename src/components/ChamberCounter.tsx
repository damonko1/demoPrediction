import { formatLegislativePartyShort } from "@/lib/format";
import type { LegislativeScenarioResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type ChamberCounterProps = {
  scenario: LegislativeScenarioResult;
};

function formatSeatDelta(value: number) {
  if (value === 0) {
    return "0";
  }

  return value > 0 ? `+${value}` : `${value}`;
}

function getChamberLabel(scenario: LegislativeScenarioResult) {
  return scenario.chamber === "house" ? "House" : "Senate";
}

export function ChamberCounter({ scenario }: ChamberCounterProps) {
  const demWidth = (scenario.controlTotals.democratic / scenario.totalSeats) * 100;
  const repWidth = (scenario.controlTotals.republican / scenario.totalSeats) * 100;
  const thresholdPosition =
    (scenario.majorityThreshold / scenario.totalSeats) * 100;
  const demChange =
    scenario.controlTotals.democratic - scenario.baselineControlTotals.democratic;
  const repChange =
    scenario.controlTotals.republican - scenario.baselineControlTotals.republican;
  const chamberLabel = getChamberLabel(scenario);
  const leader =
    scenario.controlTotals.democratic === scenario.controlTotals.republican
      ? `${chamberLabel} tie`
      : scenario.controlTotals.democratic > scenario.controlTotals.republican
        ? "Democratic control"
        : "Republican control";
  const demDistance = Math.max(
    0,
    scenario.majorityThreshold - scenario.controlTotals.democratic,
  );
  const repDistance = Math.max(
    0,
    scenario.majorityThreshold - scenario.controlTotals.republican,
  );
  const independentSeats = scenario.totals.independent;
  const vacantSeats = scenario.currentRosterTotals.vacant;
  const controlNote =
    scenario.chamber === "senate"
      ? "51-seat control threshold; vice-president tie context is not modeled"
      : "218-seat majority threshold";

  return (
    <section
      className={styles.counter}
      aria-label={`${chamberLabel} seat counter`}
      aria-live="polite"
      aria-atomic="false"
    >
      <div className={styles.counterTopline}>
        <div className={styles.partyTotal}>
          <span>Democratic seats</span>
          <strong>{scenario.controlTotals.democratic}</strong>
          <small>
            {demDistance === 0
              ? "At control threshold"
              : `${demDistance} short of control`}
          </small>
        </div>
        <div className={styles.counterStatus}>
          <span>{leader}</span>
          <strong>{scenario.majorityThreshold} to control</strong>
          <small>
            D {formatSeatDelta(demChange)} / R {formatSeatDelta(repChange)} from
            baseline
          </small>
        </div>
        <div className={`${styles.partyTotal} ${styles.partyTotalRight}`}>
          <span>Republican seats</span>
          <strong>{scenario.controlTotals.republican}</strong>
          <small>
            {repDistance === 0
              ? "At control threshold"
              : `${repDistance} short of control`}
          </small>
        </div>
      </div>

      <div className={styles.counterMetaGrid}>
        <div>
          <span>Threshold</span>
          <strong>{scenario.majorityThreshold}</strong>
          <small>{controlNote}</small>
        </div>
        <div>
          <span>Flipped seats</span>
          <strong>{scenario.flippedSeats.length}</strong>
          <small>{scenario.lowDataSeats.length} low-data seats flagged</small>
        </div>
        <div>
          <span>Other / vacant</span>
          <strong>
            {formatLegislativePartyShort("independent")} {independentSeats} /{" "}
            {formatLegislativePartyShort("vacant")} {vacantSeats}
          </strong>
          <small>Current roster vacancy count shown separately</small>
        </div>
      </div>

      <div className={styles.counterBar} aria-hidden="true">
        <div className={styles.demBar} style={{ width: `${demWidth}%` }} />
        <div className={styles.repBar} style={{ width: `${repWidth}%` }} />
        <span
          className={styles.thresholdMarker}
          style={{ left: `${thresholdPosition}%` }}
        />
      </div>

      <div className={styles.scaleTicks} aria-hidden="true">
        <span>0D</span>
        <span>{scenario.majorityThreshold} CONTROL</span>
        <span>{scenario.totalSeats}R</span>
      </div>
    </section>
  );
}
