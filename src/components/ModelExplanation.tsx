import styles from "@/components/Playground.module.css";

export function ModelExplanation() {
  return (
    <section className={styles.modelNote} aria-label="Model note">
      <strong>Model kernel</strong>
      <p>
        SIM_MARGIN = BASELINE_MARGIN + NATIONAL_SWING. Starter data is rounded
        and illustrative; Maine and Nebraska are winner-take-all in this build.
      </p>
    </section>
  );
}
