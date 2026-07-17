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

function getSeatNoun(scenario: LegislativeScenarioResult) {
  return scenario.chamber === "house" ? "districts" : "seats";
}

function getNetChangeLabel(demChange: number, repChange: number) {
  return `D ${formatSeatDelta(demChange)} / R ${formatSeatDelta(repChange)}`;
}

function getSenateCycleCounts(scenario: LegislativeScenarioResult) {
  if (scenario.chamber !== "senate") {
    return null;
  }

  const upThisCycle = scenario.seats.filter(
    (result) => "upNextCycle" in result.seat && result.seat.upNextCycle,
  ).length;

  return {
    upThisCycle,
    notUpThisCycle: scenario.totalSeats - upThisCycle,
    specialElections: scenario.seats.filter((result) => result.seat.specialElection)
      .length,
  };
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
  const simulatedVacantSeats = scenario.totals.vacant;
  const vacantSeats = scenario.currentRosterTotals.vacant;
  const seatNoun = getSeatNoun(scenario);
  const netChangeLabel = getNetChangeLabel(demChange, repChange);
  const senateCycleCounts = getSenateCycleCounts(scenario);
  const otherSeatLabel =
    independentSeats + simulatedVacantSeats === 0
      ? "None"
      : [
          `${formatLegislativePartyShort("independent")} ${independentSeats}`,
          simulatedVacantSeats > 0 ? `Other ${simulatedVacantSeats}` : null,
        ].filter(Boolean).join(" / ");
  const vacancyLabel =
    vacantSeats === 0
      ? "None"
      : `${formatLegislativePartyShort("vacant")} ${vacantSeats}`;
  const controlNote =
    scenario.chamber === "senate"
      ? "51 seats control outright; a 50-50 Senate depends on the vice-president tie-break"
      : "218-seat majority threshold";
  const tiedSeatNote =
    scenario.chamber === "senate"
      ? "Exact simulated ties are separate from a 50-50 chamber split"
      : "Displayed as Tie in district margins";

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
            {netChangeLabel} from baseline
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

      <div className={`${styles.counterMetaGrid} ${styles.chamberCounterMetaGrid}`}>
        <div>
          <span>Threshold</span>
          <strong>{scenario.majorityThreshold}</strong>
          <small>{controlNote}</small>
        </div>
        <div>
          <span>Net from baseline</span>
          <strong>{netChangeLabel}</strong>
          <small>Updates live with chamber assumptions</small>
        </div>
        <div>
          <span>Flipped {seatNoun}</span>
          <strong>{scenario.flippedSeats.length}</strong>
          <small>{scenario.lowDataSeats.length} low-data seats flagged</small>
        </div>
        {senateCycleCounts ? (
          <>
            <div>
              <span>Seats up this cycle</span>
              <strong>{senateCycleCounts.upThisCycle}</strong>
              <small>
                {senateCycleCounts.specialElections === 0
                  ? "No special Senate elections flagged"
                  : `${senateCycleCounts.specialElections} special election flags`}
              </small>
            </div>
            <div>
              <span>Seats not up</span>
              <strong>{senateCycleCounts.notUpThisCycle}</strong>
              <small>Held seats remain in control totals</small>
            </div>
          </>
        ) : null}
        <div>
          <span>Tied {seatNoun}</span>
          <strong>{scenario.tiedSeats.length}</strong>
          <small>
            {scenario.tiedSeats.length === 0
              ? "No exact toss-up ties"
              : tiedSeatNote}
          </small>
        </div>
        <div>
          <span>Independent / other</span>
          <strong>{otherSeatLabel}</strong>
          <small>
            {scenario.chamber === "senate" && independentSeats > 0
              ? "Independent seats remain separate; control uses caucus alignment"
              : independentSeats === 0
              ? "No independent-control seats"
              : "Independent winners caucus by control party"}
          </small>
        </div>
        <div>
          <span>Vacant seats</span>
          <strong>{vacancyLabel}</strong>
          <small>Current roster vacancies, separate from simulated control</small>
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
