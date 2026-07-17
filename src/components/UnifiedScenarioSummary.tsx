"use client";

import { Check, Copy, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  formatPartyShort,
  formatSwing,
} from "@/lib/format";
import type {
  LegislativeScenarioResult,
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

function getChamberLeadShort(scenario: LegislativeScenarioResult) {
  if (scenario.controlTotals.democratic === scenario.controlTotals.republican) {
    return "Tie";
  }

  return `${formatPartyShort(
    scenario.controlTotals.democratic > scenario.controlTotals.republican
      ? "democratic"
      : "republican",
  )} lead`;
}

function formatCountDelta(value: number, label: string) {
  if (value === 0) {
    return `No ${label} change`;
  }

  return `${value > 0 ? "+" : ""}${value} ${label}`;
}

export function UnifiedScenarioSummary({
  activeTab,
  presidentialScenario,
  houseScenario,
  senateScenario,
  shareUrl,
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
  const snapshotText = [
    "Election Forecast Playground · Simulation only",
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
      <text x="92" y="125" fill="#123442" font-family="system-ui,sans-serif" font-size="28" font-weight="700">Election Forecast Playground</text>
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
        <div>
          <p className={styles.sectionKicker}>All chambers</p>
          <h2>Scenario snapshot</h2>
        </div>
        <span className={styles.summaryPill}>{getActiveLabel(activeTab)}</span>
      </div>

      <div className={styles.unifiedSummaryGrid}>
        <div>
          <span>President</span>
          <strong>
            D {presidentialScenario.totals.democratic} / R{" "}
            {presidentialScenario.totals.republican}
          </strong>
          <small>
            {getPresidentialLeader(presidentialScenario)} · {formatCountDelta(presidentialEvDelta, "D EV")}
          </small>
        </div>
        <div>
          <span>House</span>
          <strong>
            D {houseScenario.controlTotals.democratic} / R{" "}
            {houseScenario.controlTotals.republican}
          </strong>
          <small>{getChamberControl(houseScenario)} · {formatCountDelta(houseSeatDelta, "D seats")}</small>
        </div>
        <div>
          <span>Senate</span>
          <strong>
            D {senateScenario.controlTotals.democratic} / R{" "}
            {senateScenario.controlTotals.republican}
          </strong>
          <small>{getChamberControl(senateScenario)} · {formatCountDelta(senateSeatDelta, "D seats")}</small>
        </div>
        <div>
          <span>Assumption mode</span>
          <strong>Shared state, local seats</strong>
          <small>
            {stateOverrideCount} state · {districtOverrideCount} district · {raceOverrideCount} race overrides
          </small>
        </div>
      </div>

      <div className={styles.unifiedAssumptionStrip}>
        <span>Pres {formatSwing(presidentialScenario.assumptions.nationalSwing)}</span>
        <span>
          House {formatSwing(houseScenario.assumptions.nationalSwing)} /{" "}
          {getChamberLeadShort(houseScenario)}
        </span>
        <span>
          Senate {formatSwing(senateScenario.assumptions.nationalSwing)} /{" "}
          {getChamberLeadShort(senateScenario)}
        </span>
        <span>
          State overrides affect all tabs; chamber sliders remain independent
        </span>
      </div>

      <div className={styles.nationalShareCard} aria-label="Full national scenario share card">
        <div>
          <span>Full national share card</span>
          <strong>President · House · Senate</strong>
          <small>Includes all state, district, and Senate race overrides in the shared URL.</small>
        </div>
        <div>
          <button disabled={!shareUrl} onClick={copySnapshot} type="button">
            {shareStatus === "copied" ? <Check size={14} /> : <Copy size={14} />}
            {shareStatus === "copied" ? "Copied" : "Copy snapshot"}
          </button>
          <button onClick={exportSnapshotCard} type="button">
            {shareStatus === "saved" ? <Check size={14} /> : <Download size={14} />}
            {shareStatus === "saved" ? "Saved" : "Export SVG"}
          </button>
        </div>
      </div>
    </section>
  );
}
