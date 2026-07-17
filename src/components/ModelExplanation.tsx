import { ExternalLink, Info } from "lucide-react";
import { historicalStateDataSource } from "@/data/historicalElectionData.generated";
import styles from "@/components/Playground.module.css";

export function ModelExplanation() {
  return (
    <section className={styles.modelNote} aria-label="Presidential method and data resources">
      <details className={styles.modelDisclosure}>
        <summary>
          <Info size={14} strokeWidth={2.2} />
          <span className={styles.modelSummaryText}>
            <b>Method &amp; data</b>
            <small>Formula · sources · validation</small>
          </span>
        </summary>
        <div className={styles.modelResourceBody}>
          <div className={styles.modelFormula}>
            <span>Simulation formula</span>
            <code>historical margin + national swing + weighted inputs + state override</code>
          </div>
          <div className={styles.modelResourceGrid}>
            <article className={styles.modelResourceCard}>
              <span>Election returns</span>
              <strong>MIT President 1976-2024</strong>
              <small>
                {historicalStateDataSource.version} · retrieved {historicalStateDataSource.retrievedAt}
              </small>
              <a href={historicalStateDataSource.sourceUrl} rel="noreferrer" target="_blank">
                Open dataset <ExternalLink size={11} />
              </a>
            </article>
            <article className={styles.modelResourceCard}>
              <span>Validation status</span>
              <strong>Calculation-ready baselines</strong>
              <small>51 state/DC records and 538 electoral votes validated for every supported year, 2000-2024.</small>
            </article>
            <article className={styles.modelResourceCard}>
              <span>Sourced</span>
              <strong>Historical margins and EVs</strong>
              <small>Election returns and split electoral-vote units provide the starting point.</small>
            </article>
            <article className={styles.modelResourceCard}>
              <span>Illustrative</span>
              <strong>Sliders and presets</strong>
              <small>Group weights are transparent stress-test assumptions, not measured voter forecasts.</small>
            </article>
          </div>
          <div className={styles.modelResourceLinks}>
            <a href="https://github.com/topojson/us-atlas" rel="noreferrer" target="_blank">
              State map geometry <ExternalLink size={10} />
            </a>
            <span>County and sourced demographic modes remain disabled until validation passes.</span>
          </div>
        </div>
      </details>
    </section>
  );
}
