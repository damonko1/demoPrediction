"use client";

import { Check, Info, Link2, RotateCcw, UsersRound, Zap } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { ResetButton } from "@/components/ResetButton";
import { SwingSlider } from "@/components/SwingSlider";
import {
  defaultLegislativeSliderAssumptions,
  getLegislativeSliderConfigsForChamber,
  legislativeSliderBounds,
} from "@/data/legislativeSliders";
import {
  getLegislativePresets,
  getMatchingLegislativePreset,
} from "@/data/legislativePresets";
import { formatSignedPoints, formatSwing } from "@/lib/format";
import type {
  LegislativeAssumptions,
  LegislativeChamber,
  LegislativeSliderConfig,
  LegislativeSliderId,
  ScenarioAssumptions,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeControlsProps = {
  chamber: LegislativeChamber;
  assumptions: LegislativeAssumptions;
  presidentialAssumptions?: ScenarioAssumptions;
  onNationalSwingChange: (value: number) => void;
  onSliderChange?: (id: LegislativeSliderId, value: number) => void;
  onApplyPresidentAssumptions?: () => void;
  onApplyAssumptions?: (assumptions: LegislativeAssumptions) => void;
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

function getChamberEnvironmentLabel(chamber: LegislativeChamber) {
  return chamber === "house" ? "District environment" : "State and race environment";
}

function getPresetLibraryTitle(chamber: LegislativeChamber) {
  return chamber === "house" ? "House preset library" : "Senate preset library";
}

function formatSliderValue(value: number) {
  if (Math.abs(value) < 0.05) {
    return "Default";
  }

  return formatSignedPoints(value);
}

function getSliderPosition(value: number) {
  const { min, max } = legislativeSliderBounds;
  return ((value - min) / (max - min)) * 100;
}

function getSliderReadout(config: LegislativeSliderConfig, value: number) {
  if (Math.abs(value) < 0.05) {
    return config.neutralLabel;
  }

  return value > 0 ? config.highReadout : config.lowReadout;
}

function LegislativeHeuristicSlider({
  config,
  value,
  onChange,
}: {
  config: LegislativeSliderConfig;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className={styles.demographicSlider}>
      <div className={styles.sliderValue}>
        <span>{config.label}</span>
        <strong>{formatSliderValue(value)}</strong>
      </div>

      <div className={styles.sliderFrame}>
        <span className={styles.sliderNeutralMarker} aria-hidden="true" />
        <input
          aria-label={config.label}
          aria-valuetext={formatSliderValue(value)}
          className={styles.swingSlider}
          max={legislativeSliderBounds.max}
          min={legislativeSliderBounds.min}
          onChange={(event) => onChange(Number(event.target.value))}
          step={legislativeSliderBounds.step}
          style={
            { "--slider-position": `${getSliderPosition(value)}%` } as CSSProperties
          }
          type="range"
          value={value}
        />
      </div>

      <div className={styles.demographicTicks} aria-hidden="true">
        <span>{config.lowLabel}</span>
        <span>{config.neutralLabel}</span>
        <span>{config.highLabel}</span>
      </div>

      <div className={styles.sliderReadout} aria-live="polite">
        <span>{getSliderReadout(config, value)}</span>
        <strong>Heuristic</strong>
      </div>

      <p className={styles.heuristicSliderNote}>{config.helperText}</p>
    </div>
  );
}

export function LegislativeControls({
  chamber,
  assumptions,
  presidentialAssumptions,
  onNationalSwingChange,
  onSliderChange,
  onApplyPresidentAssumptions,
  onApplyAssumptions,
  onCopyLink,
  onReset,
}: LegislativeControlsProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sliderAssumptions = {
    ...defaultLegislativeSliderAssumptions,
    ...assumptions.sliders,
  };
  const chamberTitle = getChamberTitle(chamber);
  const chamberSliderConfigs = getLegislativeSliderConfigsForChamber(chamber);
  const hasChamberOverrides = chamber === "house"
    ? Object.keys(assumptions.overrides.districts).length > 0
    : Object.keys(assumptions.overrides.races).length > 0;
  const isAtDefault = Math.abs(assumptions.nationalSwing) < 0.05 &&
    Object.values(sliderAssumptions).every((value) => Math.abs(value) < 0.05) &&
    !hasChamberOverrides;
  const showChamberSliders = Boolean(onSliderChange && chamberSliderConfigs.length);
  const showPresetLibrary = Boolean(onApplyAssumptions);
  const chamberPresetsForLibrary = getLegislativePresets(chamber);
  const matchingPreset = getMatchingLegislativePreset(chamber, assumptions);

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

      <SwingSlider
        ariaLabel={`National ${chamberTitle} swing in percentage points`}
        label={`National ${chamberTitle} swing`}
        value={assumptions.nationalSwing}
        onChange={onNationalSwingChange}
      />

      {showChamberSliders ? (
        <details className={styles.optionDisclosure}>
          <summary>
            <div>
              <p className={styles.sectionKicker}>{chamberTitle} heuristic sliders</p>
              <h3>{getChamberEnvironmentLabel(chamber)}</h3>
            </div>
            <span>{chamberSliderConfigs.length} inputs</span>
          </summary>

          <div className={styles.optionDisclosureBody}>
            <div className={styles.demographicControls}>
              {presidentialAssumptions && onApplyPresidentAssumptions ? (
                <button
                  aria-label={`Apply President tab demographic assumptions to ${chamberTitle} sliders`}
                  className={styles.presetButton}
                  onClick={onApplyPresidentAssumptions}
                  type="button"
                >
                  <UsersRound size={15} strokeWidth={2.2} />
                  <span>
                    <b>Use President demographics</b>
                    <small>
                      Copy turnout, suburban, rural, independent, and coattail
                      assumptions into {chamberTitle} heuristics
                    </small>
                  </span>
                </button>
              ) : null}

              <div className={styles.simulationDisclaimer}>
                <Info size={14} strokeWidth={2.2} />
                <p>
                  {chamberTitle} heuristic sliders are not sourced forecasts.
                  They apply transparent state and race weights to the sourced
                  election baseline so similarly sized slider moves can affect
                  seats differently.
                </p>
              </div>

              {chamberSliderConfigs.map((config) => (
                <LegislativeHeuristicSlider
                  config={config}
                  key={config.id}
                  value={sliderAssumptions[config.id]}
                  onChange={(value) => onSliderChange?.(config.id, value)}
                />
              ))}
            </div>
          </div>
        </details>
      ) : null}

      <details className={styles.optionDisclosure}>
        <summary>
          <div>
            <p className={styles.sectionKicker}>Scenario presets</p>
            <h3>{showPresetLibrary ? getPresetLibraryTitle(chamber) : "Chamber stress tests"}</h3>
          </div>
          <span>{formatSwing(assumptions.nationalSwing)}</span>
        </summary>

        <div className={styles.optionDisclosureBody}>
          <div className={styles.presetGrid}>
            {showPresetLibrary
              ? chamberPresetsForLibrary.map((preset) => (
                  <button
                    aria-label={`Apply ${preset.label} preset`}
                    aria-pressed={matchingPreset?.id === preset.id}
                    className={`${styles.presetButton} ${
                      matchingPreset?.id === preset.id
                        ? styles.activePresetButton
                        : ""
                    }`}
                    key={preset.id}
                    onClick={() =>
                      onApplyAssumptions?.({
                        ...preset.assumptions,
                        overrides: preset.id.endsWith("baseline")
                          ? {
                              states: assumptions.overrides.states,
                              districts: {},
                              races: {},
                            }
                          : assumptions.overrides,
                      })
                    }
                    type="button"
                  >
                    {matchingPreset?.id === preset.id ? (
                      <Check size={15} strokeWidth={2.4} />
                    ) : preset.id.endsWith("baseline") ? (
                      <RotateCcw size={15} strokeWidth={2.2} />
                    ) : (
                      <Zap size={15} strokeWidth={2.2} />
                    )}
                    <span>
                      <b>{preset.label}</b>
                      <small>{preset.summary}</small>
                    </span>
                  </button>
                ))
              : chamberPresets.map((preset) => (
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
            {!showPresetLibrary ? (
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
            ) : null}
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
      </details>
    </section>
  );
}
