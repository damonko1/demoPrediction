import {
  formatMargin,
  formatPartyShort,
  formatSwing,
} from "@/lib/format";
import type { ScenarioResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type ScenarioSummaryProps = {
  scenario: ScenarioResult;
};

function formatEvDelta(value: number) {
  if (value === 0) {
    return "0";
  }

  return value > 0 ? `+${value}` : `${value}`;
}

export function ScenarioSummary({ scenario }: ScenarioSummaryProps) {
  const demEvShift =
    scenario.totals.democratic - scenario.baselineTotals.democratic;
  const repEvShift =
    scenario.totals.republican - scenario.baselineTotals.republican;

  return (
    <section className={styles.panel} aria-label="Scenario summary" aria-live="polite">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Summary</p>
          <h2>What changed</h2>
        </div>
        <span className={styles.summaryPill}>
          {formatSwing(scenario.assumptions.nationalSwing)}
        </span>
      </div>

      <div className={styles.summaryMetrics}>
        <div className={styles.evShift}>
          <span>EV change from baseline</span>
          <div className={styles.evDeltaStack}>
            <strong>D {formatEvDelta(demEvShift)}</strong>
            <small>R {formatEvDelta(repEvShift)}</small>
          </div>
        </div>
        <div className={styles.evShift}>
          <span>Flipped states</span>
          <strong>{scenario.flippedStates.length}</strong>
        </div>
      </div>

      {scenario.flippedStates.length === 0 ? (
        <p className={styles.emptyState}>No states flipped at this swing.</p>
      ) : (
        <ul className={styles.flipList}>
          {scenario.flippedStates.map((result) => (
            <li key={result.state.code}>
              <span className={styles.flipStateName}>
                <b>{result.state.code}</b>
                <small>{result.state.name}</small>
              </span>
              <strong className={styles.flipOutcome}>
                {formatPartyShort(result.baselineWinner)} to{" "}
                {formatPartyShort(result.simulatedWinner)}
                <small>{formatMargin(result.simulatedMargin)}</small>
              </strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
