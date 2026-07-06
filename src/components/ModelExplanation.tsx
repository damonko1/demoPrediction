import { Info } from "lucide-react";
import styles from "@/components/Playground.module.css";

export function ModelExplanation() {
  return (
    <section className={styles.modelNote} aria-label="Model assumptions">
      <details className={styles.modelDisclosure}>
        <summary>
          <Info size={14} strokeWidth={2.2} />
          <span>Sources and assumptions</span>
        </summary>
        <p>
          State baselines use MIT Election Data and Science Lab presidential
          returns for 2000-2024. Simulated margin starts from the selected
          historical baseline, then adds national swing and illustrative
          state-weighted slider effects. County and demographic datasets stay
          disabled until their validation gates pass.
        </p>
      </details>
    </section>
  );
}
