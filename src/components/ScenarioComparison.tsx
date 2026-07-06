import { GitCompareArrows } from "lucide-react";
import {
  formatMargin,
  formatParty,
  formatPartyShort,
  formatSwing,
} from "@/lib/format";
import type { HistoricalElectionYear, ScenarioResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type ScenarioComparisonProps = {
  baselineYear: HistoricalElectionYear;
  scenario: ScenarioResult;
};

function formatLeader(totals: ScenarioResult["totals"]) {
  if (totals.democratic === totals.republican) {
    return "Tie";
  }

  return totals.democratic > totals.republican
    ? formatParty("democratic")
    : formatParty("republican");
}

function formatEvPair(totals: ScenarioResult["totals"]) {
  return `D ${totals.democratic} / R ${totals.republican}`;
}

export function ScenarioComparison({
  baselineYear,
  scenario,
}: ScenarioComparisonProps) {
  const mostChangedStates = [...scenario.states]
    .filter((result) => Math.abs(result.totalAdjustment) >= 0.05 || result.flipped)
    .sort((a, b) => Math.abs(b.totalAdjustment) - Math.abs(a.totalAdjustment))
    .slice(0, 4);

  return (
    <section className={styles.panel} aria-label="Scenario comparison mode">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Comparison</p>
          <h2>Current vs baseline</h2>
        </div>
        <span className={styles.summaryPill}>
          <GitCompareArrows size={13} strokeWidth={2.2} />
          {baselineYear}
        </span>
      </div>

      <div className={styles.comparisonGrid}>
        <div>
          <span>Historical baseline</span>
          <strong>{formatEvPair(scenario.baselineTotals)}</strong>
          <small>{formatLeader(scenario.baselineTotals)} edge</small>
        </div>
        <div>
          <span>Current scenario</span>
          <strong>{formatEvPair(scenario.totals)}</strong>
          <small>{formatSwing(scenario.assumptions.nationalSwing)}</small>
        </div>
      </div>

      {mostChangedStates.length === 0 ? (
        <p className={styles.emptyState}>
          Move a slider to compare changed states against the baseline.
        </p>
      ) : (
        <ol className={styles.sensitivityList}>
          {mostChangedStates.map((result) => (
            <li key={result.state.code}>
              <span>
                <b>{result.state.code}</b>
                <small>
                  {formatPartyShort(result.baselineWinner)} to{" "}
                  {formatPartyShort(result.simulatedWinner)}
                </small>
              </span>
              <strong>{formatMargin(result.simulatedMargin)}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
