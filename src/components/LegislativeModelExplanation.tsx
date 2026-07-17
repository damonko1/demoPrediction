import { ExternalLink, Info } from "lucide-react";
import {
  houseBaselineYear,
  houseDistrictBaselines,
  legislativeDataSources,
  nextSenateCycleYear,
  senateSeatBaselines,
} from "@/data/legislativeData.generated";
import type { LegislativeChamber } from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeModelExplanationProps = {
  chamber: LegislativeChamber;
};

export function LegislativeModelExplanation({
  chamber,
}: LegislativeModelExplanationProps) {
  const source =
    chamber === "house"
      ? legislativeDataSources.houseResults
      : legislativeDataSources.senateResults;
  const isHouse = chamber === "house";
  const activeSenateSeats = senateSeatBaselines.filter(
    (seat) => seat.upNextCycle,
  ).length;
  const coverage = isHouse
    ? `${houseDistrictBaselines.length}/435 districts · ${houseBaselineYear} returns`
    : `${senateSeatBaselines.length}/100 seats · ${activeSenateSeats} active in ${nextSenateCycleYear}`;
  const geometryUrl = isHouse
    ? "https://www.census.gov/programs-surveys/decennial-census/about/rdo/congressional-districts.html"
    : "https://github.com/topojson/us-atlas";

  return (
    <section
      className={styles.modelNote}
      aria-label={`${isHouse ? "House" : "Senate"} method and data resources`}
    >
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
            <code>latest race margin + chamber swing + visible heuristics + state/local override</code>
          </div>
          <div className={styles.modelResourceGrid}>
            <article className={styles.modelResourceCard}>
              <span>Election returns</span>
              <strong>{source.sourcePublisher}</strong>
              <small>{source.dataVintage} · retrieved {source.retrievedAt}</small>
              <a href={source.sourceUrl} rel="noreferrer" target="_blank">
                Open dataset <ExternalLink size={11} />
              </a>
            </article>
            <article className={styles.modelResourceCard}>
              <span>Coverage</span>
              <strong>{coverage}</strong>
              <small>{source.validationSummary}</small>
            </article>
            <article className={styles.modelResourceCard}>
              <span>Current members</span>
              <strong>Congress Legislators roster</strong>
              <small>{legislativeDataSources.congressionalRoster.dataVintage}</small>
              <a
                href={legislativeDataSources.congressionalRoster.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open roster <ExternalLink size={11} />
              </a>
            </article>
            <article className={styles.modelResourceCard}>
              <span>Interpretation</span>
              <strong>Sourced baseline, heuristic stress test</strong>
              <small>
                Returns and rosters are sourced. Presets, candidate-quality effects, and user overrides are exploratory inputs.
              </small>
            </article>
          </div>
          <div className={styles.modelResourceLinks}>
            <a href={geometryUrl} rel="noreferrer" target="_blank">
              {isHouse ? "District boundary resources" : "State map geometry"} <ExternalLink size={10} />
            </a>
            <span>
              {isHouse
                ? "District presidential/PVI baselines and future filing status are not yet ingested."
                : "Seats not up this cycle stay frozen; future filing status is not yet ingested."}
            </span>
          </div>
        </div>
      </details>
    </section>
  );
}
