import { defaultLegislativeSliderAssumptions } from "@/data/legislativeSliders";
import type {
  LegislativeAssumptions,
  LegislativeChamber,
  LegislativeSliderId,
} from "@/types/election";

export type LegislativePreset = {
  id: string;
  label: string;
  summary: string;
  assumptions: LegislativeAssumptions;
};

function createLegislativePreset(
  id: string,
  label: string,
  summary: string,
  nationalSwing: number,
  sliders: Partial<Record<LegislativeSliderId, number>> = {},
): LegislativePreset {
  return {
    id,
    label,
    summary,
    assumptions: {
      nationalSwing,
      sliders: { ...defaultLegislativeSliderAssumptions, ...sliders },
      overrides: { states: {}, districts: {}, races: {} },
    },
  };
}

const housePresets: LegislativePreset[] = [
  createLegislativePreset("house-blue-wave", "Blue House wave", "D +5 national House environment", 5),
  createLegislativePreset("house-red-wave", "Red House wave", "R +5 national House environment", -5),
  createLegislativePreset(
    "house-coattails",
    "Presidential coattails",
    "A winning presidential coalition pulls close House seats",
    1,
    { genericTurnout: 1, presidentialCoattails: 4 },
  ),
  createLegislativePreset(
    "house-split-ticket",
    "Split-ticket House",
    "House races move against the presidential environment",
    -1,
    { candidateQuality: -2, presidentialCoattails: -4 },
  ),
  createLegislativePreset(
    "house-anti-incumbent",
    "Anti-incumbent year",
    "Sitting members lose their normal edge in close districts",
    0,
    { incumbencyAdvantage: -5, openSeatPenalty: 2 },
  ),
];

const senatePresets: LegislativePreset[] = [
  createLegislativePreset("senate-blue-wave", "Blue Senate wave", "D +5 national Senate environment", 5),
  createLegislativePreset("senate-red-wave", "Red Senate wave", "R +5 national Senate environment", -5),
  createLegislativePreset(
    "senate-coattails",
    "Presidential coattails",
    "The presidential result pulls competitive Senate races",
    1,
    { presidentialCoattails: 4, statePartisanshipElasticity: 2 },
  ),
  createLegislativePreset(
    "senate-split-ticket",
    "Split-ticket Senate",
    "Senate candidates run against the presidential environment",
    -1,
    { presidentialCoattails: -4, candidateQuality: -2 },
  ),
  createLegislativePreset(
    "senate-incumbent-firewall",
    "Incumbent firewall",
    "Current senators outperform in close active-cycle races",
    0,
    { incumbencyAdvantage: 5 },
  ),
  createLegislativePreset(
    "senate-anti-incumbent",
    "Anti-incumbent year",
    "Incumbents lose their normal edge in close active races",
    0,
    { incumbencyAdvantage: -5, openSeatPenalty: 2 },
  ),
];

export function getLegislativePresets(chamber: LegislativeChamber) {
  return chamber === "house" ? housePresets : senatePresets;
}

export function getMatchingLegislativePreset(
  chamber: LegislativeChamber,
  assumptions: LegislativeAssumptions,
) {
  return getLegislativePresets(chamber).find((preset) =>
    Math.abs(preset.assumptions.nationalSwing - assumptions.nationalSwing) < 0.05 &&
    Object.entries(preset.assumptions.sliders).every(
      ([id, value]) =>
        Math.abs(value - assumptions.sliders[id as LegislativeSliderId]) < 0.05,
    ),
  ) ?? null;
}
