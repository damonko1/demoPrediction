import { Activity } from "lucide-react";
import { useMemo } from "react";
import { calculateMonteCarloSummary } from "@/lib/calculateMonteCarlo";
import type { ScenarioResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type MonteCarloPanelProps = {
  scenario: ScenarioResult;
};

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function MonteCarloPanel({ scenario }: MonteCarloPanelProps) {
  const summary = useMemo(
    () => calculateMonteCarloSummary(scenario),
    [scenario],
  );

  return (
    <section className={styles.panel} aria-label="Monte Carlo uncertainty mode">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Uncertainty</p>
          <h2>Monte Carlo</h2>
        </div>
        <span className={styles.summaryPill}>
          <Activity size={13} strokeWidth={2.2} />
          {summary.sampleCount} runs
        </span>
      </div>

      <div className={styles.summaryMetrics}>
        <div className={styles.evShift}>
          <span>D win share</span>
          <strong>{formatPercent(summary.democraticWinShare)}</strong>
        </div>
        <div className={styles.evShift}>
          <span>R win share</span>
          <strong>{formatPercent(summary.republicanWinShare)}</strong>
        </div>
      </div>

      <div className={styles.uncertaintyBand}>
        <span>Democratic EV middle range</span>
        <strong>
          {summary.democraticEvRange.low}-{summary.democraticEvRange.high}
        </strong>
        <small>Median {summary.medianDemocraticEv} EV</small>
      </div>

      <details className={styles.compactDisclosure}>
        <summary>Method note</summary>
        <p>
          Adds a fixed 3.5-point random error band to each simulated electoral
          vote unit. This is an uncertainty stress test, not a forecast model.
        </p>
      </details>
    </section>
  );
}
