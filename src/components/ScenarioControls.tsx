import { RotateCcw } from "lucide-react";
import { SwingSlider } from "@/components/SwingSlider";
import styles from "@/components/Playground.module.css";

type ScenarioControlsProps = {
  nationalSwing: number;
  onNationalSwingChange: (value: number) => void;
  onReset: () => void;
};

export function ScenarioControls({
  nationalSwing,
  onNationalSwingChange,
  onReset,
}: ScenarioControlsProps) {
  return (
    <section className={styles.panel} aria-label="Scenario controls">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Scenario</p>
          <h2>National swing</h2>
        </div>
        <button
          className={styles.iconButton}
          type="button"
          onClick={onReset}
          title="Reset scenario"
          aria-label="Reset scenario"
        >
          <RotateCcw size={18} strokeWidth={2.2} />
        </button>
      </div>

      <SwingSlider value={nationalSwing} onChange={onNationalSwingChange} />
    </section>
  );
}
