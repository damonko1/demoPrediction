"use client";

import { Check, Copy, Download, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScenarioBookmarks } from "@/components/ScenarioBookmarks";
import { demographicSliderConfigs } from "@/data/demographicSliders";
import {
  getMatchingLegislativePreset,
} from "@/data/legislativePresets";
import { getLegislativeSliderConfigsForChamber } from "@/data/legislativeSliders";
import { getMatchingScenarioPreset } from "@/data/scenarioPresets";
import {
  formatSwing,
} from "@/lib/format";
import type {
  LegislativeScenarioResult,
  HistoricalElectionYear,
  ScenarioResult,
  SimulationTab,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type UnifiedScenarioSummaryProps = {
  activeTab: SimulationTab;
  presidentialScenario: ScenarioResult;
  houseScenario: LegislativeScenarioResult;
  senateScenario: LegislativeScenarioResult;
  shareUrl: string;
  baselineYear: HistoricalElectionYear;
  onResetAll: () => void;
  resetDisabled: boolean;
};

type ShareStatus = "idle" | "copied" | "saved" | "failed";

function getActiveLabel(activeTab: SimulationTab) {
  if (activeTab === "house") {
    return "House active";
  }

  if (activeTab === "senate") {
    return "Senate active";
  }

  return "President active";
}

function getPresidentialLeader(scenario: ScenarioResult) {
  if (scenario.totals.democratic === scenario.totals.republican) {
    return "Electoral tie";
  }

  return scenario.totals.democratic > scenario.totals.republican
    ? "Democratic EV lead"
    : "Republican EV lead";
}

function getChamberControl(scenario: LegislativeScenarioResult) {
  if (scenario.controlTotals.democratic === scenario.controlTotals.republican) {
    return `${scenario.chamber === "senate" ? "Senate" : "House"} tie`;
  }

  return scenario.controlTotals.democratic > scenario.controlTotals.republican
    ? "Democratic control"
    : "Republican control";
}

function formatCountDelta(value: number, label: string) {
  if (value === 0) {
    return `No ${label} change`;
  }

  return `${value > 0 ? "+" : ""}${value} ${label}`;
}

export function UnifiedScenarioSummary({
  activeTab,
  baselineYear,
  presidentialScenario,
  houseScenario,
  senateScenario,
  shareUrl,
  onResetAll,
  resetDisabled,
}: UnifiedScenarioSummaryProps) {
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const presidentialEvDelta =
    presidentialScenario.totals.democratic -
    presidentialScenario.baselineTotals.democratic;
  const houseSeatDelta =
    houseScenario.controlTotals.democratic -
    houseScenario.baselineControlTotals.democratic;
  const senateSeatDelta =
    senateScenario.controlTotals.democratic -
    senateScenario.baselineControlTotals.democratic;
  const stateOverrideCount = Object.keys(
    presidentialScenario.assumptions.stateOverrides ?? {},
  ).length;
  const districtOverrideCount = Object.keys(
    houseScenario.assumptions.overrides.districts,
  ).length;
  const raceOverrideCount = Object.keys(
    senateScenario.assumptions.overrides.races,
  ).length;
  const presidentialPreset = getMatchingScenarioPreset(
    presidentialScenario.assumptions,
  );
  const housePreset = getMatchingLegislativePreset(
    "house",
    houseScenario.assumptions,
  );
  const senatePreset = getMatchingLegislativePreset(
    "senate",
    senateScenario.assumptions,
  );
  const activeLegislativeScenario = activeTab === "house"
    ? houseScenario
    : senateScenario;
  const activeLegislativePreset = activeTab === "house"
    ? housePreset
    : senatePreset;
  const activeSliderLabels = activeTab === "president"
    ? demographicSliderConfigs
        .filter(
          (config) =>
            Math.abs(presidentialScenario.assumptions.demographics[config.id]) >= 0.05,
        )
        .map(
          (config) =>
            `${config.label} ${formatSwing(
              presidentialScenario.assumptions.demographics[config.id],
            )}`,
        )
    : getLegislativeSliderConfigsForChamber(activeTab)
        .filter(
          (config) =>
            Math.abs(activeLegislativeScenario.assumptions.sliders[config.id]) >= 0.05,
        )
        .map(
          (config) =>
            `${config.label} ${formatSwing(
              activeLegislativeScenario.assumptions.sliders[config.id],
            )}`,
        );
  const activeSwing = activeTab === "president"
    ? presidentialScenario.assumptions.nationalSwing
    : activeLegislativeScenario.assumptions.nationalSwing;
  const activeLocalOverrideCount = activeTab === "president"
    ? stateOverrideCount
    : stateOverrideCount + (activeTab === "house" ? districtOverrideCount : raceOverrideCount);
  const hasActiveCustomSettings = Math.abs(activeSwing) >= 0.05 ||
    activeSliderLabels.length > 0 || activeLocalOverrideCount > 0;
  const activePresetName = activeTab === "president"
    ? presidentialPreset?.label
    : activeLegislativePreset?.label;
  const defaultScenarioName = activeTab === "president"
    ? `${baselineYear} presidential replay`
    : `2026 ${activeTab === "house" ? "House" : "Senate"} scenario`;
  const activeScenarioName = activePresetName ??
    (hasActiveCustomSettings ? "Custom mix" : defaultScenarioName);
  const visibleSettings = activeSliderLabels.slice(0, 4);
  const hiddenSettingCount = Math.max(0, activeSliderLabels.length - visibleSettings.length);
  const snapshotText = [
    "Election Scenario Playground · Simulation only",
    `President D ${presidentialScenario.totals.democratic} / R ${presidentialScenario.totals.republican}`,
    `House D ${houseScenario.controlTotals.democratic} / R ${houseScenario.controlTotals.republican}`,
    `Senate D ${senateScenario.controlTotals.democratic} / R ${senateScenario.controlTotals.republican}`,
    `Overrides: ${stateOverrideCount} state, ${districtOverrideCount} district, ${raceOverrideCount} Senate race`,
    shareUrl,
  ].filter(Boolean).join("\n");

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  function queueStatusReset() {
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => setShareStatus("idle"), 2600);
  }

  async function copySnapshot() {
    try {
      await navigator.clipboard.writeText(snapshotText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
    queueStatusReset();
  }

  function exportSnapshotCard() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#e9f7f9"/>
      <rect x="48" y="48" width="1104" height="534" rx="24" fill="#ffffff" stroke="#257e91" stroke-width="3"/>
      <text x="92" y="125" fill="#123442" font-family="system-ui,sans-serif" font-size="28" font-weight="700">Election Scenario Playground</text>
      <text x="92" y="170" fill="#5d7781" font-family="system-ui,sans-serif" font-size="20">Full national scenario · Simulation only</text>
      <text x="92" y="270" fill="#123442" font-family="system-ui,sans-serif" font-size="34" font-weight="800">President</text>
      <text x="92" y="320" fill="#1976c9" font-family="system-ui,sans-serif" font-size="30">D ${presidentialScenario.totals.democratic}</text>
      <text x="270" y="320" fill="#d84452" font-family="system-ui,sans-serif" font-size="30">R ${presidentialScenario.totals.republican}</text>
      <text x="455" y="270" fill="#123442" font-family="system-ui,sans-serif" font-size="34" font-weight="800">House</text>
      <text x="455" y="320" fill="#1976c9" font-family="system-ui,sans-serif" font-size="30">D ${houseScenario.controlTotals.democratic}</text>
      <text x="635" y="320" fill="#d84452" font-family="system-ui,sans-serif" font-size="30">R ${houseScenario.controlTotals.republican}</text>
      <text x="815" y="270" fill="#123442" font-family="system-ui,sans-serif" font-size="34" font-weight="800">Senate</text>
      <text x="815" y="320" fill="#1976c9" font-family="system-ui,sans-serif" font-size="30">D ${senateScenario.controlTotals.democratic}</text>
      <text x="985" y="320" fill="#d84452" font-family="system-ui,sans-serif" font-size="30">R ${senateScenario.controlTotals.republican}</text>
      <text x="92" y="440" fill="#123442" font-family="system-ui,sans-serif" font-size="25" font-weight="700">Custom assumptions</text>
      <text x="92" y="482" fill="#5d7781" font-family="system-ui,sans-serif" font-size="22">${stateOverrideCount} state · ${districtOverrideCount} district · ${raceOverrideCount} Senate race overrides</text>
      <text x="92" y="535" fill="#397066" font-family="system-ui,sans-serif" font-size="18">Shared URL restores every national and local assumption</text>
    </svg>`;
    const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `national-election-scenario-${new Date().toISOString().slice(0, 10)}.svg`;
    link.click();
    URL.revokeObjectURL(blobUrl);
    setShareStatus("saved");
    queueStatusReset();
  }

  return (
    <section
      className={styles.unifiedSummary}
      aria-label="Unified presidential, House, and Senate scenario summary"
    >
      <div className={styles.unifiedSummaryHeader}>
        <div className={styles.simulationIdentity}>
          <div>
            <p className={styles.sectionKicker}>Active simulation</p>
            <h2>{activeScenarioName}</h2>
          </div>
          <span className={styles.summaryPill}>{getActiveLabel(activeTab)}</span>
        </div>
        <div className={styles.simulationDockActions}>
          <button disabled={!shareUrl} onClick={copySnapshot} type="button">
            {shareStatus === "copied" ? <Check size={14} /> : <Copy size={14} />}
            {shareStatus === "copied" ? "Copied" : "Copy"}
          </button>
          <button onClick={exportSnapshotCard} type="button">
            {shareStatus === "saved" ? <Check size={14} /> : <Download size={14} />}
            {shareStatus === "saved" ? "Saved" : "Export"}
          </button>
          <button
            className={styles.completeResetButton}
            disabled={resetDisabled}
            onClick={onResetAll}
            type="button"
          >
            <RotateCcw size={14} />
            Reset all
          </button>
        </div>
      </div>

      <div className={styles.unifiedSummaryGrid}>
        <div data-active={activeTab === "president"}>
          <span>President</span>
          <strong>
            D {presidentialScenario.totals.democratic} / R{" "}
            {presidentialScenario.totals.republican}
          </strong>
          <small>
            {getPresidentialLeader(presidentialScenario)} · {formatCountDelta(presidentialEvDelta, "D EV")}
          </small>
        </div>
        <div data-active={activeTab === "house"}>
          <span>House</span>
          <strong>
            D {houseScenario.controlTotals.democratic} / R{" "}
            {houseScenario.controlTotals.republican}
          </strong>
          <small>{getChamberControl(houseScenario)} · {formatCountDelta(houseSeatDelta, "D seats")}</small>
        </div>
        <div data-active={activeTab === "senate"}>
          <span>Senate</span>
          <strong>
            D {senateScenario.controlTotals.democratic} / R{" "}
            {senateScenario.controlTotals.republican}
          </strong>
          <small>{getChamberControl(senateScenario)} · {formatCountDelta(senateSeatDelta, "D seats")}</small>
        </div>
      </div>

      <div className={styles.activeSettingsBar} aria-label="Active simulation settings">
        <strong>Now simulating</strong>
        {activeTab === "president" ? <span>{baselineYear} result baseline</span> : null}
        {activeTab === "house" ? <span>2024 result baseline</span> : null}
        {activeTab === "senate" ? <span>Latest completed race baselines</span> : null}
        <span>{formatSwing(activeSwing)}</span>
        {visibleSettings.map((label) => <span key={label}>{label}</span>)}
        {hiddenSettingCount ? <span>+{hiddenSettingCount} more settings</span> : null}
        {stateOverrideCount ? <span>{stateOverrideCount} state override{stateOverrideCount === 1 ? "" : "s"}</span> : null}
        {activeTab === "house" && districtOverrideCount ? (
          <span>{districtOverrideCount} district override{districtOverrideCount === 1 ? "" : "s"}</span>
        ) : null}
        {activeTab === "senate" && raceOverrideCount ? (
          <span>{raceOverrideCount} race override{raceOverrideCount === 1 ? "" : "s"}</span>
        ) : null}
        {!hasActiveCustomSettings ? <span>All assumptions at default</span> : null}
      </div>

      <details className={styles.scenarioBookmarkDisclosure}>
        <summary>Save or open a named scenario</summary>
        <ScenarioBookmarks currentUrl={shareUrl} />
      </details>
    </section>
  );
}
