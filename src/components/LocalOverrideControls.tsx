"use client";

import type { CSSProperties } from "react";
import {
  emptySeatOverride,
  emptyStateOverride,
  hasSeatOverride,
  hasStateOverride,
  localOverrideBounds,
  normalizeLocalOverrideValue,
} from "@/lib/localOverrides";
import type {
  SeatOverride,
  SeatStatusOverride,
  StateOverride,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type OverrideSliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function formatOverrideValue(value: number) {
  if (Math.abs(value) < 0.05) {
    return "No local shift";
  }

  return `${value > 0 ? "D" : "R"} +${Math.abs(value).toFixed(1)}`;
}

function OverrideSlider({ label, onChange, value }: OverrideSliderProps) {
  const sliderPosition =
    ((value - localOverrideBounds.min) /
      (localOverrideBounds.max - localOverrideBounds.min)) *
    100;

  return (
    <label className={styles.localOverrideField}>
      <span>
        <b>{label}</b>
        <strong>{formatOverrideValue(value)}</strong>
      </span>
      <input
        aria-label={label}
        aria-valuetext={formatOverrideValue(value)}
        className={styles.swingSlider}
        max={localOverrideBounds.max}
        min={localOverrideBounds.min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={0.5}
        style={{ "--slider-position": `${sliderPosition}%` } as CSSProperties}
        type="range"
        value={value}
      />
      <small>R +{Math.abs(localOverrideBounds.min)} · neutral · D +{localOverrideBounds.max}</small>
    </label>
  );
}

type StateOverrideControlsProps = {
  stateName: string;
  value?: StateOverride;
  onChange: (value: StateOverride) => void;
  onReset: () => void;
};

export function StateOverrideControls({
  onChange,
  onReset,
  stateName,
  value,
}: StateOverrideControlsProps) {
  const override = value ?? emptyStateOverride;
  const isCustom = hasStateOverride(value);

  function updateField(field: keyof StateOverride, nextValue: number) {
    onChange({
      ...override,
      [field]: normalizeLocalOverrideValue(nextValue),
    });
  }

  return (
    <section className={styles.localOverridePanel} aria-label={`${stateName} state assumptions`}>
      <div className={styles.localOverrideHeader}>
        <div>
          <span>State override</span>
          <strong>{stateName}</strong>
        </div>
        <span className={isCustom ? styles.customOverrideBadge : styles.defaultOverrideBadge}>
          {isCustom ? "Custom" : "Default"}
        </span>
      </div>
      <p>
        Shared across President, House, and Senate. Positive values move the local margin toward Democrats.
      </p>
      <OverrideSlider
        label="Local turnout"
        onChange={(nextValue) => updateField("turnout", nextValue)}
        value={override.turnout}
      />
      <OverrideSlider
        label="Partisan shift"
        onChange={(nextValue) => updateField("partisanShift", nextValue)}
        value={override.partisanShift}
      />
      <OverrideSlider
        label="Candidate quality"
        onChange={(nextValue) => updateField("candidateQuality", nextValue)}
        value={override.candidateQuality}
      />
      <button disabled={!isCustom} onClick={onReset} type="button">
        Reset {stateName}
      </button>
    </section>
  );
}

type SeatOverrideControlsProps = {
  kind: "district" | "race";
  label: string;
  value?: SeatOverride;
  onChange: (value: SeatOverride) => void;
  onReset: () => void;
};

export function SeatOverrideControls({
  kind,
  label,
  onChange,
  onReset,
  value,
}: SeatOverrideControlsProps) {
  const override = value ?? emptySeatOverride;
  const isCustom = hasSeatOverride(value);
  const kindLabel = kind === "district" ? "District" : "Senate race";

  function updateField(field: "turnout" | "candidateQuality", nextValue: number) {
    onChange({
      ...override,
      [field]: normalizeLocalOverrideValue(nextValue),
    });
  }

  function updateSeatStatus(seatStatus: SeatStatusOverride) {
    onChange({ ...override, seatStatus });
  }

  return (
    <section className={styles.localOverridePanel} aria-label={`${label} ${kind} assumptions`}>
      <div className={styles.localOverrideHeader}>
        <div>
          <span>{kindLabel} override</span>
          <strong>{label}</strong>
        </div>
        <span className={isCustom ? styles.customOverrideBadge : styles.defaultOverrideBadge}>
          {isCustom ? "Custom" : "Default"}
        </span>
      </div>
      <p>Changes only this {kind}; national and other local assumptions stay intact.</p>
      <OverrideSlider
        label="Local turnout"
        onChange={(nextValue) => updateField("turnout", nextValue)}
        value={override.turnout}
      />
      <OverrideSlider
        label="Candidate quality"
        onChange={(nextValue) => updateField("candidateQuality", nextValue)}
        value={override.candidateQuality}
      />
      <label className={styles.localOverrideSelect}>
        <span>Incumbency / open-seat status</span>
        <select
          onChange={(event) => updateSeatStatus(event.target.value as SeatStatusOverride)}
          value={override.seatStatus}
        >
          <option value="baseline">Use sourced baseline</option>
          <option value="open">Treat as open seat</option>
          <option value="democratic">Democratic incumbency edge</option>
          <option value="republican">Republican incumbency edge</option>
        </select>
      </label>
      <button disabled={!isCustom} onClick={onReset} type="button">
        Reset {label}
      </button>
    </section>
  );
}
