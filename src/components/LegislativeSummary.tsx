import {
  formatLegislativePartyShort,
  formatMargin,
  formatParty,
  formatPartyShort,
  formatSwing,
} from "@/lib/format";
import type {
  LegislativeScenarioResult,
  LegislativeSeatResult,
  Party,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeSummaryProps = {
  scenario: LegislativeScenarioResult;
};

function getChamberLabel(scenario: LegislativeScenarioResult) {
  return scenario.chamber === "house" ? "House" : "Senate";
}

function formatSeatDelta(value: number) {
  if (value === 0) {
    return "0";
  }

  return value > 0 ? `+${value}` : `${value}`;
}

function getSeatName(result: LegislativeSeatResult) {
  return result.seat.chamber === "house"
    ? result.seat.districtLabel
    : `${result.seat.stateCode} S${result.seat.senateClass}`;
}

function getPathParty(scenario: LegislativeScenarioResult): Party {
  if (scenario.controlTotals.democratic === scenario.controlTotals.republican) {
    return "democratic";
  }

  return scenario.controlTotals.democratic > scenario.controlTotals.republican
    ? "republican"
    : "democratic";
}

function getPathSeats(scenario: LegislativeScenarioResult) {
  const party = getPathParty(scenario);
  const seatsNeeded = Math.max(
    0,
    scenario.majorityThreshold - scenario.controlTotals[party],
  );
  const candidateSeats = scenario.seats
    .filter((result) => result.simulatedControlParty !== party)
    .sort((left, right) => left.marginToFlip - right.marginToFlip)
    .slice(0, Math.max(5, seatsNeeded));

  return {
    party,
    seatsNeeded,
    seats: candidateSeats,
  };
}

function RankedSeatList({
  emptyText,
  items,
  renderDetail,
}: {
  emptyText: string;
  items: LegislativeSeatResult[];
  renderDetail: (result: LegislativeSeatResult) => string;
}) {
  if (items.length === 0) {
    return <p className={styles.emptyState}>{emptyText}</p>;
  }

  return (
    <ol className={styles.sensitivityList}>
      {items.map((result) => (
        <li key={result.seat.id}>
          <span>
            <b>{getSeatName(result)}</b>
            <small>{result.seat.stateName}</small>
          </span>
          <strong>{renderDetail(result)}</strong>
        </li>
      ))}
    </ol>
  );
}

export function LegislativeSummary({ scenario }: LegislativeSummaryProps) {
  const chamberLabel = getChamberLabel(scenario);
  const demShift =
    scenario.controlTotals.democratic - scenario.baselineControlTotals.democratic;
  const repShift =
    scenario.controlTotals.republican - scenario.baselineControlTotals.republican;
  const closestSeats = [...scenario.seats]
    .sort((left, right) => left.marginToFlip - right.marginToFlip)
    .slice(0, 8);
  const lowDataSeats = scenario.lowDataSeats.slice(0, 8);
  const path = getPathSeats(scenario);
  const flippedSeats = scenario.flippedSeats.slice(0, 10);

  return (
    <section className={styles.panel} aria-label={`${chamberLabel} summary`}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>{chamberLabel} summary</p>
          <h2>What changed</h2>
        </div>
        <span className={styles.summaryPill}>
          {formatSwing(scenario.assumptions.nationalSwing)}
        </span>
      </div>

      <div className={styles.summaryMetrics}>
        <div className={styles.evShift}>
          <span>Seat change from baseline</span>
          <div className={styles.evDeltaStack}>
            <strong>D {formatSeatDelta(demShift)}</strong>
            <small>R {formatSeatDelta(repShift)}</small>
          </div>
        </div>
        <div className={styles.evShift}>
          <span>Flipped seats</span>
          <strong>{scenario.flippedSeats.length}</strong>
        </div>
      </div>

      <div className={styles.sensitivityGrid}>
        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Closest seats</span>
            <strong>Margin</strong>
          </div>
          <RankedSeatList
            emptyText="No seat margins available."
            items={closestSeats}
            renderDetail={(result) => formatMargin(result.simulatedMargin)}
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Flipped first</span>
            <strong>Current</strong>
          </div>
          <RankedSeatList
            emptyText="No seats flip in this scenario."
            items={flippedSeats}
            renderDetail={(result) =>
              `${formatPartyShort(result.seat.baselineControlParty)} to ${formatPartyShort(result.simulatedControlParty)}`
            }
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Path to control</span>
            <strong>
              {path.seatsNeeded === 0
                ? `${formatParty(path.party)} at control`
                : `${formatPartyShort(path.party)} needs ${path.seatsNeeded}`}
            </strong>
          </div>
          <RankedSeatList
            emptyText={`${formatParty(path.party)} already controls the chamber.`}
            items={path.seats}
            renderDetail={(result) => `${result.marginToFlip.toFixed(1)} pts`}
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Data flags</span>
            <strong>{scenario.lowDataSeats.length}</strong>
          </div>
          <RankedSeatList
            emptyText="No low-data seats flagged."
            items={lowDataSeats}
            renderDetail={(result) =>
              `${formatLegislativePartyShort(result.simulatedWinner)} ${formatMargin(result.simulatedMargin)}`
            }
          />
        </div>
      </div>
    </section>
  );
}
