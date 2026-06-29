import {
  formatMargin,
  formatParty,
  formatPartyShort,
} from "@/lib/format";
import type { StateScenarioResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type StateDetailPanelProps = {
  result: StateScenarioResult;
};

export function StateDetailPanel({ result }: StateDetailPanelProps) {
  const flippedLabel = result.flipped
    ? `Flipped to ${formatParty(result.simulatedWinner)}`
    : "No flip";

  return (
    <section className={styles.panel} aria-label="Selected state details">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Selected state</p>
          <h2>{result.state.name}</h2>
        </div>
        <span className={result.flipped ? styles.flipBadge : styles.steadyBadge}>
          {flippedLabel}
        </span>
      </div>

      <div className={styles.detailGrid}>
        <div>
          <span>Electoral votes</span>
          <strong>{result.state.electoralVotes}</strong>
        </div>
        <div>
          <span>Baseline</span>
          <strong>{formatMargin(result.state.baselineMargin)}</strong>
        </div>
        <div>
          <span>Simulated</span>
          <strong>{formatMargin(result.simulatedMargin)}</strong>
        </div>
        <div>
          <span>Winner</span>
          <strong>{formatPartyShort(result.simulatedWinner)}</strong>
        </div>
      </div>

      <div className={styles.flipDistance}>
        <span>Distance from flipping</span>
        <strong>{result.marginToFlip.toFixed(1)} pts</strong>
      </div>
    </section>
  );
}
