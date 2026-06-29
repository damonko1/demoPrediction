import { formatSwing } from "@/lib/format";
import styles from "@/components/Playground.module.css";

type SwingSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

const minSwing = -12;
const maxSwing = 12;

export function SwingSlider({ value, onChange }: SwingSliderProps) {
  const sliderPosition = ((value - minSwing) / (maxSwing - minSwing)) * 100;

  return (
    <div className={styles.sliderBlock}>
      <div className={styles.sliderValue}>
        <span>Current assumption</span>
        <strong>{formatSwing(value)}</strong>
      </div>

      <input
        aria-label="National swing in percentage points"
        className={styles.swingSlider}
        max={maxSwing}
        min={minSwing}
        onChange={(event) => onChange(Number(event.target.value))}
        step={0.5}
        style={{ "--slider-position": `${sliderPosition}%` } as React.CSSProperties}
        type="range"
        value={value}
      />

      <div className={styles.sliderTicks} aria-hidden="true">
        <span>R +12</span>
        <span>0</span>
        <span>D +12</span>
      </div>
    </div>
  );
}
