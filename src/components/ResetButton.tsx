import { RotateCcw } from "lucide-react";
import styles from "@/components/Playground.module.css";

type ResetButtonProps = {
  disabled: boolean;
  onReset: () => void;
};

export function ResetButton({ disabled, onReset }: ResetButtonProps) {
  return (
    <button
      className={styles.iconButton}
      type="button"
      onClick={onReset}
      disabled={disabled}
      title="Reset scenario"
      aria-label={disabled ? "Scenario already at default" : "Reset scenario"}
    >
      <RotateCcw size={18} strokeWidth={2.2} />
    </button>
  );
}
