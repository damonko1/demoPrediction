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
  LegislativeScenarioResult,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeWorkspaceProps = {
  chamber: LegislativeChamber;
  scenario: LegislativeScenarioResult;
  selectedSeatId: string;
  nationalSwing: number;
  onSelectSeat: (seatId: string) => void;
  onNationalSwingChange: (value: number) => void;
  onCopyLink: () => Promise<void>;
  onReset: () => void;
};

export function LegislativeWorkspace({
  chamber,
  scenario,
  selectedSeatId,
  nationalSwing,
  onSelectSeat,
  onNationalSwingChange,
  onCopyLink,
  onReset,
}: LegislativeWorkspaceProps) {
  const selectedSeat =
    scenario.seats.find((result) => result.seat.id === selectedSeatId) ??
    scenario.seats[0];

  return (
    <>
      <ChamberCounter scenario={scenario} />

      <section
        className={styles.workspace}
        aria-label={`${chamber === "house" ? "House" : "Senate"} scenario workspace`}
      >
        <aside
          className={styles.leftRail}
          aria-label={`${chamber === "house" ? "House" : "Senate"} controls`}
        >
          <LegislativeControls
            chamber={chamber}
            nationalSwing={nationalSwing}
            onNationalSwingChange={onNationalSwingChange}
            onCopyLink={onCopyLink}
            onReset={onReset}
          />
        </aside>

        <div className={styles.centerStage}>
          {chamber === "house" ? (
            <HouseDistrictMap
              results={scenario.seats}
              selectedSeatId={selectedSeat.seat.id}
              onSelectSeat={onSelectSeat}
            />
          ) : (
            <SenateMap
              results={scenario.seats}
              selectedSeatId={selectedSeat.seat.id}
              onSelectSeat={onSelectSeat}
            />
          )}
        </div>

        <aside
          className={styles.detailRail}
          aria-label={`Selected ${chamber === "house" ? "House district" : "Senate seat"} details`}
        >
          <LegislativeDetailPanel result={selectedSeat} />
        </aside>

        <aside
          className={styles.analysisRail}
          aria-label={`${chamber === "house" ? "House" : "Senate"} summary and assumptions`}
        >
          <LegislativeSummary scenario={scenario} />
          <LegislativeModelExplanation chamber={chamber} />
        </aside>
      </section>
    </>
  );
}
