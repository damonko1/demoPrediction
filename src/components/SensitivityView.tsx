import {
  calculateSensitivityView,
  type DriverSensitivity,
  type TippingPointState,
} from "@/lib/calculateSensitivity";
import {
  formatMargin,
  formatParty,
  formatPartyShort,
} from "@/lib/format";
import type {
  Party,
  ScenarioResult,
  StateScenarioResult,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type SensitivityViewProps = {
  scenario: ScenarioResult;
};

function formatDriverDelta(delta: number) {
  if (Math.abs(delta) < 0.05) {
    return "0.0 pts";
  }

  return `${delta > 0 ? "D" : "R"} +${Math.abs(delta).toFixed(1)}`;
}

function formatPathSummary(party: Party, votesNeeded: number) {
  if (votesNeeded === 0) {
    return `${formatParty(party)} at 270+`;
  }

  return `${formatPartyShort(party)} needs ${votesNeeded} EV`;
}

function StateRankList({
  emptyText,
  items,
  renderDetail,
}: {
  emptyText: string;
  items: StateScenarioResult[];
  renderDetail: (result: StateScenarioResult) => string;
}) {
  if (items.length === 0) {
    return <p className={styles.emptyState}>{emptyText}</p>;
  }

  return (
    <ol className={styles.sensitivityList}>
      {items.map((result) => (
        <li key={result.state.code}>
          <span>
            <b>{result.state.code}</b>
            <small>{result.state.name}</small>
          </span>
          <strong>{renderDetail(result)}</strong>
        </li>
      ))}
    </ol>
  );
}

function DriverList({ drivers }: { drivers: DriverSensitivity[] }) {
  if (drivers.length === 0) {
    return (
      <p className={styles.emptyState}>
        Move a slider to see which assumption is doing the most work.
      </p>
    );
  }

  return (
    <ol className={styles.sensitivityList}>
      {drivers.map((driver) => (
        <li key={driver.id}>
          <span>
            <b>{driver.label}</b>
            <small>largest state effect: {driver.maxStateCode}</small>
          </span>
          <strong>{formatDriverDelta(driver.maxStateDelta)}</strong>
        </li>
      ))}
    </ol>
  );
}

function TippingPointList({ states }: { states: TippingPointState[] }) {
  return (
    <ol className={styles.sensitivityList}>
      {states.map(({ result, score }) => (
        <li key={result.state.code}>
          <span>
            <b>{result.state.code}</b>
            <small>{result.state.electoralVotes} EV / {formatMargin(result.simulatedMargin)}</small>
          </span>
          <strong>{score.toFixed(1)}</strong>
        </li>
      ))}
    </ol>
  );
}

export function SensitivityView({ scenario }: SensitivityViewProps) {
  const sensitivity = calculateSensitivityView(scenario);
  const pathSummary = formatPathSummary(
    sensitivity.pathTo270.party,
    sensitivity.pathTo270.votesNeeded,
  );

  return (
    <section className={styles.panel} aria-label="Sensitivity view">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Sensitivity</p>
          <h2>Pressure points</h2>
        </div>
        <span className={styles.summaryPill}>{pathSummary}</span>
      </div>

      <div className={styles.sensitivityGrid}>
        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Closest states</span>
            <strong>Margin</strong>
          </div>
          <StateRankList
            emptyText="No state margins available."
            items={sensitivity.closestStates}
            renderDetail={(result) => formatMargin(result.simulatedMargin)}
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Flipped first</span>
            <strong>Current</strong>
          </div>
          <StateRankList
            emptyText="No states have flipped in this scenario."
            items={sensitivity.flippedFirst}
            renderDetail={(result) => `${formatPartyShort(result.baselineWinner)} to ${formatPartyShort(result.simulatedWinner)}`}
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Biggest slider effect</span>
            <strong>Peak</strong>
          </div>
          <DriverList drivers={sensitivity.biggestDrivers} />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Path to 270</span>
            <strong>{sensitivity.pathTo270.electoralVotes} EV</strong>
          </div>
          <StateRankList
            emptyText={`${formatParty(sensitivity.pathTo270.party)} already has a path above 270.`}
            items={sensitivity.pathTo270.states}
            renderDetail={(result) => `${result.state.electoralVotes} EV`}
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Tipping-point rank</span>
            <strong>Score</strong>
          </div>
          <TippingPointList states={sensitivity.tippingPointStates} />
        </div>
      </div>
    </section>
  );
}
