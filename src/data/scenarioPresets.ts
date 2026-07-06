import {
  defaultDemographicAssumptions,
} from "@/data/demographicSliders";
import type {
  DemographicAssumptions,
  ScenarioAssumptions,
  ScenarioPreset,
  ScenarioPresetId,
} from "@/types/election";

function buildDemographics(
  overrides: Partial<DemographicAssumptions> = {},
): DemographicAssumptions {
  return {
    ...defaultDemographicAssumptions,
    ...overrides,
  };
}

function buildAssumptions(
  nationalSwing: number,
  demographics: Partial<DemographicAssumptions> = {},
): ScenarioAssumptions {
  return {
    nationalSwing,
    demographics: buildDemographics(demographics),
    adjustments: [],
  };
}

export const resetBaselinePresetId: ScenarioPresetId = "resetBaseline";

export const scenarioPresets: ScenarioPreset[] = [
  {
    id: "highYouthTurnout",
    label: "High youth turnout",
    summary: "Stress-tests a much younger electorate in youth-heavy states.",
    assumptions: buildAssumptions(0, {
      youthTurnout: 15,
      seniorTurnout: -4,
      independentVoteShift: 4,
      collegeEducatedVoteShift: 4,
    }),
  },
  {
    id: "suburbanShift",
    label: "Suburban shift",
    summary: "Pushes suburbs and college-educated voters strongly Democratic.",
    assumptions: buildAssumptions(0, {
      suburbanVoteShift: 15,
      independentVoteShift: 5,
      collegeEducatedVoteShift: 8,
    }),
  },
  {
    id: "ruralSurge",
    label: "Rural surge",
    summary: "Models a high rural and non-college Republican surge.",
    assumptions: buildAssumptions(0, {
      seniorTurnout: 8,
      suburbanVoteShift: -3,
      ruralTurnout: 15,
      nonCollegeVoteShift: -10,
    }),
  },
  {
    id: "lowTurnout",
    label: "Low turnout election",
    summary: "Compresses youth, college, and independent participation.",
    assumptions: buildAssumptions(0, {
      youthTurnout: -12,
      seniorTurnout: 8,
      independentVoteShift: -6,
      collegeEducatedVoteShift: -8,
      ruralTurnout: 6,
    }),
  },
  {
    id: "popularVoteElectoralSplit",
    label: "Popular vote / EC split",
    summary: "Adds a Democratic national lean while rural states resist it.",
    assumptions: buildAssumptions(6, {
      seniorTurnout: 8,
      suburbanVoteShift: 4,
      ruralTurnout: 15,
      nonCollegeVoteShift: -12,
    }),
  },
  {
    id: resetBaselinePresetId,
    label: "Reset to baseline",
    summary: "Returns every assumption to the neutral baseline.",
    assumptions: buildAssumptions(0),
  },
];
