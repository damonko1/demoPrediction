import type { ElectoralTotals } from "@/types/election";
import styles from "@/components/Playground.module.css";

const totalElectoralVotes = 538;
const winningThreshold = 270;

type ElectoralCounterProps = {
  totals: ElectoralTotals;
  baselineTotals: ElectoralTotals;
};

export function ElectoralCounter({ totals, baselineTotals }: ElectoralCounterProps) {
  const demWidth = (totals.democratic / totalElectoralVotes) * 100;
  const repWidth = (totals.republican / totalElectoralVotes) * 100;
  const thresholdPosition = (winningThreshold / totalElectoralVotes) * 100;
  const demChange = totals.democratic - baselineTotals.democratic;
  const leader =
    totals.democratic === totals.republican
      ? "Electoral tie"
      : totals.democratic > totals.republican
        ? "Democratic lead"
        : "Republican lead";

  return (
    <section className={styles.counter} aria-label="Electoral vote counter">
      <div className={styles.counterTopline}>
        <div className={styles.partyTotal}>
          <span>Democratic</span>
          <strong>{totals.democratic}</strong>
        </div>
        <div className={styles.counterStatus}>
          <span>{leader}</span>
          <strong>270 to win</strong>
          <small>
            {demChange === 0
              ? "No EV change from baseline"
              : `${demChange > 0 ? "+" : ""}${demChange} Democratic EV from baseline`}
          </small>
        </div>
        <div className={`${styles.partyTotal} ${styles.partyTotalRight}`}>
          <span>Republican</span>
          <strong>{totals.republican}</strong>
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
        <span>270 WIN</span>
        <span>538R</span>
      </div>
    </section>
  );
}
