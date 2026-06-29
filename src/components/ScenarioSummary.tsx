import { formatMargin, formatSwing } from "@/lib/format";
import type { ScenarioResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type ScenarioSummaryProps = {
  scenario: ScenarioResult;
};

export function ScenarioSummary({ scenario }: ScenarioSummaryProps) {
  const demEvShift =
    scenario.totals.democratic - scenario.baselineTotals.democratic;

  return (
    <section className={styles.panel} aria-label="Scenario summary">
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
          <span>Democratic EV shift</span>
          <strong>{demEvShift > 0 ? `+${demEvShift}` : demEvShift}</strong>
        </div>
        <div className={styles.evShift}>
          <span>Flipped state count</span>
          <strong>{scenario.flippedStates.length}</strong>
        </div>
      </div>

      {scenario.flippedStates.length === 0 ? (
        <p className={styles.emptyState}>No states flipped at this swing.</p>
      ) : (
        <ul className={styles.flipList}>
          {scenario.flippedStates.map((result) => (
            <li key={result.state.code}>
              <span>{result.state.code}</span>
              <strong>{formatMargin(result.simulatedMargin)}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
