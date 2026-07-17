"use client";

import { ChamberCounter } from "@/components/ChamberCounter";
import { HouseDistrictMap } from "@/components/HouseDistrictMap";
import { LegislativeControls } from "@/components/LegislativeControls";
import { LegislativeDetailPanel } from "@/components/LegislativeDetailPanel";
import { LegislativeModelExplanation } from "@/components/LegislativeModelExplanation";
import { LegislativeSummary } from "@/components/LegislativeSummary";
import { SenateMap } from "@/components/SenateMap";
import type {
  LegislativeChamber,
  LegislativeAssumptions,
  LegislativeSliderId,
  LegislativeScenarioResult,
  ScenarioAssumptions,
  ScenarioResult,
  SeatOverride,
  StateOverride,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeWorkspaceProps = {
  chamber: LegislativeChamber;
  scenario: LegislativeScenarioResult;
  selectedSeatId: string;
  assumptions: LegislativeAssumptions;
  presidentialAssumptions?: ScenarioAssumptions;
  presidentialScenario?: ScenarioResult;
  isFocusMode?: boolean;
  onSelectSeat: (seatId: string) => void;
  onNationalSwingChange: (value: number) => void;
  onSliderChange?: (id: LegislativeSliderId, value: number) => void;
  onApplyPresidentAssumptions?: () => void;
  onApplyAssumptions?: (assumptions: LegislativeAssumptions) => void;
  onStateOverrideChange: (stateCode: string, value: StateOverride) => void;
  onStateOverrideReset: (stateCode: string) => void;
  onSeatOverrideChange: (seatId: string, value: SeatOverride) => void;
  onSeatOverrideReset: (seatId: string) => void;
  onCopyLink: () => Promise<void>;
  onReset: () => void;
};

export function LegislativeWorkspace({
  chamber,
  scenario,
  selectedSeatId,
  assumptions,
  presidentialAssumptions,
  presidentialScenario,
  isFocusMode = false,
  onSelectSeat,
  onNationalSwingChange,
  onSliderChange,
  onApplyPresidentAssumptions,
  onApplyAssumptions,
  onStateOverrideChange,
  onStateOverrideReset,
  onSeatOverrideChange,
  onSeatOverrideReset,
  onCopyLink,
  onReset,
}: LegislativeWorkspaceProps) {
  const selectedSeat =
    scenario.seats.find((result) => result.seat.id === selectedSeatId) ??
    scenario.seats[0];
  const stateOverride = scenario.assumptions.overrides.states[selectedSeat.seat.stateCode];
  const seatOverride = chamber === "house"
    ? scenario.assumptions.overrides.districts[selectedSeat.seat.id]
    : scenario.assumptions.overrides.races[selectedSeat.seat.id];
  const customStateCodes = new Set(
    Object.keys(scenario.assumptions.overrides.states),
  );
  const customSeatIds = new Set(
    Object.keys(
      chamber === "house"
        ? scenario.assumptions.overrides.districts
        : scenario.assumptions.overrides.races,
    ),
  );

  return (
    <>
      <ChamberCounter scenario={scenario} />

      <section
        className={`${styles.workspace} ${isFocusMode ? styles.focusWorkspace : ""}`}
        aria-label={`${chamber === "house" ? "House" : "Senate"} scenario workspace`}
      >
        <aside
          className={styles.leftRail}
          aria-label={`${chamber === "house" ? "House" : "Senate"} controls`}
        >
          <LegislativeControls
            chamber={chamber}
            assumptions={assumptions}
            presidentialAssumptions={presidentialAssumptions}
            onNationalSwingChange={onNationalSwingChange}
            onSliderChange={onSliderChange}
            onApplyPresidentAssumptions={onApplyPresidentAssumptions}
            onApplyAssumptions={onApplyAssumptions}
            onCopyLink={onCopyLink}
            onReset={onReset}
          />
        </aside>

        <div className={styles.centerStage}>
          {chamber === "house" ? (
            <HouseDistrictMap
              results={scenario.seats}
              selectedSeatId={selectedSeat.seat.id}
              customStateCodes={customStateCodes}
              customSeatIds={customSeatIds}
              onSelectSeat={onSelectSeat}
            />
          ) : (
            <SenateMap
              results={scenario.seats}
              selectedSeatId={selectedSeat.seat.id}
              customStateCodes={customStateCodes}
              customSeatIds={customSeatIds}
              onSelectSeat={onSelectSeat}
            />
          )}
        </div>

        <aside
          className={styles.detailRail}
          aria-label={`Selected ${chamber === "house" ? "House district" : "Senate seat"} details`}
        >
          <LegislativeDetailPanel
            result={selectedSeat}
            stateOverride={stateOverride}
            seatOverride={seatOverride}
            onStateOverrideChange={(value) =>
              onStateOverrideChange(selectedSeat.seat.stateCode, value)
            }
            onStateOverrideReset={() =>
              onStateOverrideReset(selectedSeat.seat.stateCode)
            }
            onSeatOverrideChange={(value) =>
              onSeatOverrideChange(selectedSeat.seat.id, value)
            }
            onSeatOverrideReset={() => onSeatOverrideReset(selectedSeat.seat.id)}
          />
        </aside>

        <aside
          className={styles.analysisRail}
          aria-label={`${chamber === "house" ? "House" : "Senate"} summary and assumptions`}
        >
          <LegislativeSummary
            scenario={scenario}
            presidentialScenario={presidentialScenario}
          />
          <LegislativeModelExplanation chamber={chamber} />
        </aside>
      </section>
    </>
  );
}
