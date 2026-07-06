"use client";

import { Check, Info, Link2, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ResetButton } from "@/components/ResetButton";
import { SwingSlider } from "@/components/SwingSlider";
import { formatSwing } from "@/lib/format";
import type { LegislativeChamber } from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeControlsProps = {
  chamber: LegislativeChamber;
  nationalSwing: number;
  onNationalSwingChange: (value: number) => void;
  onCopyLink: () => Promise<void>;
  onReset: () => void;
};

type CopyStatus = "idle" | "copied" | "failed";

const chamberPresets = [
  {
    label: "Blue wave",
    summary: "D +5 uniform chamber swing",
    value: 5,
  },
  {
    label: "Red wave",
    summary: "R +5 uniform chamber swing",
    value: -5,
  },
  {
    label: "Large D stress",
    summary: "D +10 upper-bound test",
    value: 10,
  },
  {
    label: "Large R stress",
    summary: "R +10 upper-bound test",
    value: -10,
  },
] as const;

function getChamberTitle(chamber: LegislativeChamber) {
  return chamber === "house" ? "House" : "Senate";
}

export function LegislativeControls({
  chamber,
  nationalSwing,
  onNationalSwingChange,
  onCopyLink,
  onReset,
}: LegislativeControlsProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAtDefault = Math.abs(nationalSwing) < 0.05;
  const chamberTitle = getChamberTitle(chamber);

  useEffect(() => {
    return () => {
      if (copyStatusTimeoutRef.current) {
        clearTimeout(copyStatusTimeoutRef.current);
      }
    };
  }, []);

  function queueCopyStatusReset() {
    if (copyStatusTimeoutRef.current) {
      clearTimeout(copyStatusTimeoutRef.current);
    }

    copyStatusTimeoutRef.current = setTimeout(() => {
      setCopyStatus("idle");
    }, 2800);
  }

  async function handleCopyLink() {
    try {
      await onCopyLink();
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }

    queueCopyStatusReset();
  }

  const copyLabel = copyStatus === "copied"
    ? "Copied"
    : copyStatus === "failed"
      ? "Copy failed"
      : "Copy link";

  return (
    <section className={styles.panel} aria-label={`${chamberTitle} controls`}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>{chamberTitle} scenario</p>
          <h2>Assumptions</h2>
        </div>
        <div className={styles.panelActions}>
          <button
            className={styles.shareButton}
            type="button"
            onClick={handleCopyLink}
            title={`Copy ${chamberTitle.toLowerCase()} scenario link`}
            aria-label={
              copyStatus === "copied"
                ? `${chamberTitle} scenario link copied`
                : `Copy ${chamberTitle.toLowerCase()} scenario link`
            }
          >
            {copyStatus === "copied" ? (
              <Check size={16} strokeWidth={2.3} />
            ) : (
              <Link2 size={16} strokeWidth={2.3} />
            )}
            <span aria-live="polite">{copyLabel}</span>
          </button>
          <ResetButton disabled={isAtDefault} onReset={onReset} />
        </div>
      </div>

      <SwingSlider value={nationalSwing} onChange={onNationalSwingChange} />

      <div className={styles.presetControls}>
        <div className={styles.presetControlsHeader}>
          <div>
            <p className={styles.sectionKicker}>Scenario presets</p>
            <h3>Chamber stress tests</h3>
          </div>
          <span>{formatSwing(nationalSwing)}</span>
        </div>

        <div className={styles.presetGrid}>
          {chamberPresets.map((preset) => (
            <button
              aria-label={`Apply ${preset.label} preset`}
              className={styles.presetButton}
              key={preset.label}
              onClick={() => onNationalSwingChange(preset.value)}
              type="button"
            >
              <Zap size={15} strokeWidth={2.2} />
              <span>
                <b>{preset.label}</b>
                <small>{preset.summary}</small>
              </span>
            </button>
          ))}
          <button
            aria-label={`Reset ${chamberTitle} chamber swing`}
            className={styles.presetButton}
            onClick={() => onNationalSwingChange(0)}
            type="button"
          >
            <RotateCcw size={15} strokeWidth={2.2} />
            <span>
              <b>Baseline</b>
              <small>Return to sourced margins</small>
            </span>
          </button>
        </div>

        <div className={styles.simulationDisclaimer}>
          <Info size={14} strokeWidth={2.2} />
          <p>
            This chamber slider applies a uniform national swing to public
            election-return baselines. Candidate quality, local issues, and
            redistricting effects are not forecasted.
          </p>
        </div>
      </div>
    </section>
  );
}
