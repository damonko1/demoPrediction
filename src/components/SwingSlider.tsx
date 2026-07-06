import { formatSwing } from "@/lib/format";
import { scenarioSwingBounds } from "@/lib/scenarioUrl";
import styles from "@/components/Playground.module.css";
import type { CSSProperties } from "react";

type SwingSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

const minSwing = scenarioSwingBounds.min;
const maxSwing = scenarioSwingBounds.max;

export function SwingSlider({ value, onChange }: SwingSliderProps) {
  const sliderPosition = ((value - minSwing) / (maxSwing - minSwing)) * 100;
  const isNeutral = Math.abs(value) < 0.05;
  const swingDirection = isNeutral
    ? "Neutral baseline"
    : value > 0
      ? "Toward Democrats"
      : "Toward Republicans";

  return (
    <div className={styles.sliderBlock}>
      <div className={styles.sliderValue}>
        <span>Current assumption</span>
        <strong>{formatSwing(value)}</strong>
      </div>

      <div className={styles.sliderFrame}>
        <span className={styles.sliderNeutralMarker} aria-hidden="true" />
        <input
          aria-label="National swing in percentage points"
          aria-valuetext={formatSwing(value)}
          className={styles.swingSlider}
          max={maxSwing}
          min={minSwing}
          onChange={(event) => onChange(Number(event.target.value))}
          onInput={(event) => onChange(Number(event.currentTarget.value))}
          step={0.5}
          style={{ "--slider-position": `${sliderPosition}%` } as CSSProperties}
          type="range"
          value={value}
        />
      </div>

      <div className={styles.sliderTicks} aria-hidden="true">
        <span>R +{Math.abs(minSwing)}</span>
        <span>0</span>
        <span>D +{maxSwing}</span>
      </div>

      <div className={styles.sliderReadout} aria-live="polite">
        <span>{swingDirection}</span>
        <strong>{isNeutral ? "Default" : `${Math.abs(value).toFixed(1)} pts`}</strong>
      </div>
    </div>
  );
}
