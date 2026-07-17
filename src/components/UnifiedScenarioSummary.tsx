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
};

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

export function UnifiedScenarioSummary({
  activeTab,
  presidentialScenario,
  houseScenario,
  senateScenario,
}: UnifiedScenarioSummaryProps) {
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
          <small>{getPresidentialLeader(presidentialScenario)}</small>
        </div>
        <div>
          <span>House</span>
          <strong>
            D {houseScenario.controlTotals.democratic} / R{" "}
            {houseScenario.controlTotals.republican}
          </strong>
          <small>{getChamberControl(houseScenario)}</small>
        </div>
        <div>
          <span>Senate</span>
          <strong>
            D {senateScenario.controlTotals.democratic} / R{" "}
            {senateScenario.controlTotals.republican}
          </strong>
          <small>{getChamberControl(senateScenario)}</small>
        </div>
        <div>
          <span>Assumption mode</span>
          <strong>Independent per tab</strong>
          <small>House and Senate use chamber swings, not presidential sliders</small>
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
      </div>
    </section>
  );
}
