import { Info } from "lucide-react";
import { legislativeDataSources } from "@/data/legislativeData.generated";
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

  return (
    <section className={styles.modelNote} aria-label="Legislative model assumptions">
      <details className={styles.modelDisclosure}>
        <summary>
          <Info size={14} strokeWidth={2.2} />
          <span>Model assumptions</span>
        </summary>
        <p>
          Simulated margin starts from the latest public result margin, then adds
          national chamber swing and any visible heuristic slider adjustments.
          Results use {source.sourceName}; current member rosters use{" "}
          {legislativeDataSources.congressionalRoster.sourceName}. Outputs are
          scenario simulations, not predictions.
        </p>
      </details>
    </section>
  );
}
