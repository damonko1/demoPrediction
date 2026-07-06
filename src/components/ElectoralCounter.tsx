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
  const remainingVotes = Math.max(
    0,
    totalElectoralVotes - totals.democratic - totals.republican,
  );
  const remainingWidth = (remainingVotes / totalElectoralVotes) * 100;
  const thresholdPosition = (winningThreshold / totalElectoralVotes) * 100;
  const demChange = totals.democratic - baselineTotals.democratic;
  const allocatedVotes = totalElectoralVotes - remainingVotes;
  const demDistance = Math.max(0, winningThreshold - totals.democratic);
  const repDistance = Math.max(0, winningThreshold - totals.republican);
  const leader =
    totals.democratic === totals.republican
      ? "Electoral tie"
      : totals.democratic > totals.republican
        ? "Democratic lead"
        : "Republican lead";
  const tossUpLabel =
    remainingVotes === 0
      ? "No toss-up EV in this scenario"
      : `${remainingVotes} toss-up EV unallocated`;

  return (
    <section
      className={styles.counter}
      aria-label="Electoral vote counter"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className={styles.counterTopline}>
        <div className={styles.partyTotal}>
          <span>Democratic EV</span>
          <strong>{totals.democratic}</strong>
          <small>
            {demDistance === 0 ? "At 270+" : `${demDistance} short of 270`}
          </small>
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
          <span>Republican EV</span>
          <strong>{totals.republican}</strong>
          <small>
            {repDistance === 0 ? "At 270+" : `${repDistance} short of 270`}
          </small>
        </div>
      </div>

      <div className={styles.counterMetaGrid}>
        <div>
          <span>Threshold</span>
          <strong>{winningThreshold}</strong>
        </div>
        <div>
          <span>Toss-up EV</span>
          <strong>{remainingVotes}</strong>
          <small>{tossUpLabel}</small>
        </div>
        <div>
          <span>Scenario total</span>
          <strong>{allocatedVotes}/{totalElectoralVotes}</strong>
        </div>
      </div>

      <div className={styles.counterBar} aria-hidden="true">
        <div className={styles.demBar} style={{ width: `${demWidth}%` }} />
        {remainingVotes > 0 ? (
          <div
            className={styles.remainingBar}
            style={{ left: `${demWidth}%`, width: `${remainingWidth}%` }}
          />
        ) : null}
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
