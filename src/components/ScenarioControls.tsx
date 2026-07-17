"use client";

import { CalendarClock, Check, Info, Link2, RotateCcw, Zap } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { ResetButton } from "@/components/ResetButton";
import { SwingSlider } from "@/components/SwingSlider";
import {
  demographicSliderBounds,
  demographicSliderConfigs,
} from "@/data/demographicSliders";
import {
  defaultHistoricalElectionYear,
  historicalElectionYears,
} from "@/data/historicalElectionData.generated";
import {
  resetBaselinePresetId,
  scenarioPresets,
} from "@/data/scenarioPresets";
import { formatSignedPoints } from "@/lib/format";
import type {
  DemographicAssumptions,
  DemographicSliderConfig,
  DemographicSliderId,
  HistoricalElectionYear,
  ScenarioPreset,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type ScenarioControlsProps = {
  baselineYear: HistoricalElectionYear;
  nationalSwing: number;
  demographicAssumptions: DemographicAssumptions;
  onBaselineYearChange: (year: HistoricalElectionYear) => void;
  onNationalSwingChange: (value: number) => void;
  onDemographicAssumptionChange: (
    id: DemographicSliderId,
    value: number,
  ) => void;
  onApplyPreset: (preset: ScenarioPreset) => void;
  onCopyLink: () => Promise<void>;
  onReset: () => void;
};

type CopyStatus = "idle" | "copied" | "failed";

function formatDemographicValue(value: number) {
  if (Math.abs(value) < 0.05) {
    return "Default";
  }

  return formatSignedPoints(value);
}

export function ScenarioControls({
  baselineYear,
  nationalSwing,
  demographicAssumptions,
  onBaselineYearChange,
  onNationalSwingChange,
  onDemographicAssumptionChange,
  onApplyPreset,
  onCopyLink,
  onReset,
}: ScenarioControlsProps) {
  const isAtDefault = baselineYear === defaultHistoricalElectionYear &&
    Math.abs(nationalSwing) < 0.05 &&
    Object.values(demographicAssumptions).every((value) => Math.abs(value) < 0.05);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  function getDemographicSliderPosition(value: number) {
    const { min, max } = demographicSliderBounds;
    return ((value - min) / (max - min)) * 100;
  }

  function getDemographicReadout(
    config: DemographicSliderConfig,
    value: number,
  ) {
    if (Math.abs(value) < 0.05) {
      return config.neutralLabel;
    }

    return value > 0 ? config.highReadout : config.lowReadout;
  }

  return (
    <section className={styles.panel} aria-label="Scenario controls">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Scenario</p>
          <h2>Assumptions</h2>
        </div>
        <div className={styles.panelActions}>
          <button
            className={styles.shareButton}
            type="button"
            onClick={handleCopyLink}
            title="Copy scenario link"
            aria-label={copyStatus === "copied" ? "Scenario link copied" : "Copy scenario link"}
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

      <div className={styles.baselineSelector}>
        <div className={styles.baselineSelectorHeader}>
          <span>
            <CalendarClock size={14} strokeWidth={2.2} />
            Historical replay
          </span>
          <strong>{baselineYear}</strong>
        </div>
        <div className={styles.baselineYearGrid} aria-label="Historical baseline year">
          {historicalElectionYears.map((year) => (
            <button
              aria-pressed={baselineYear === year}
              className={baselineYear === year ? styles.activeBaselineYear : ""}
              key={year}
              onClick={() => onBaselineYearChange(year)}
              title={`Replay from the ${year} presidential election baseline`}
              type="button"
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <SwingSlider value={nationalSwing} onChange={onNationalSwingChange} />

      <details className={styles.optionDisclosure}>
        <summary>
          <div>
            <p className={styles.sectionKicker}>Scenario presets</p>
            <h3>One-click stress tests</h3>
          </div>
          <span>+/-15 range</span>
        </summary>

        <div className={styles.optionDisclosureBody}>
          <div className={styles.presetGrid}>
            {scenarioPresets.map((preset) => {
              const isResetPreset = preset.id === resetBaselinePresetId;
              const Icon = isResetPreset ? RotateCcw : Zap;

              return (
                <button
                  aria-label={`Apply ${preset.label} preset`}
                  className={styles.presetButton}
                  key={preset.id}
                  onClick={() => onApplyPreset(preset)}
                  type="button"
                >
                  <Icon size={15} strokeWidth={2.2} />
                  <span>
                    <b>{preset.label}</b>
                    <small>{preset.summary}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.simulationDisclaimer}>
            <Info size={14} strokeWidth={2.2} />
            <p>
              +/-15 presets are simulation stress tests, not real forecast claims.
              Real electorate changes this large are unlikely and need sourced data.
            </p>
          </div>
        </div>
      </details>

      <details className={styles.optionDisclosure}>
        <summary>
          <div>
            <p className={styles.sectionKicker}>Demographic-style sliders</p>
            <h3>Electorate adjustments</h3>
          </div>
          <span>{demographicSliderConfigs.length} inputs</span>
        </summary>

        <div className={styles.optionDisclosureBody}>
          <div className={styles.demographicControls}>
            {demographicSliderConfigs.map((config) => {
              const value = demographicAssumptions[config.id];
              const sliderPosition = getDemographicSliderPosition(value);
              const readout = getDemographicReadout(config, value);

              return (
                <label
                  className={styles.demographicSlider}
                  htmlFor={`demographic-${config.id}`}
                  key={config.id}
                >
                  <div className={styles.sliderValue}>
                    <span>{config.label}</span>
                    <strong>{formatDemographicValue(value)}</strong>
                  </div>

                  <div className={styles.sliderFrame}>
                    <span className={styles.sliderNeutralMarker} aria-hidden="true" />
                    <input
                      aria-label={config.label}
                      aria-valuetext={`${readout}, ${formatDemographicValue(value)}`}
                      className={styles.swingSlider}
                      id={`demographic-${config.id}`}
                      max={demographicSliderBounds.max}
                      min={demographicSliderBounds.min}
                      onChange={(event) =>
                        onDemographicAssumptionChange(
                          config.id,
                          Number(event.target.value),
                        )
                      }
                      onInput={(event) =>
                        onDemographicAssumptionChange(
                          config.id,
                          Number(event.currentTarget.value),
                        )
                      }
                      step={demographicSliderBounds.step}
                      style={{ "--slider-position": `${sliderPosition}%` } as CSSProperties}
                      type="range"
                      value={value}
                    />
                  </div>

                  <div className={styles.demographicTicks} aria-hidden="true">
                    <span>{config.lowLabel}</span>
                    <span>{config.neutralLabel}</span>
                    <span>{config.highLabel}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </details>
    </section>
  );
}
