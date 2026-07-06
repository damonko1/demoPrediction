import type {
  DemographicAssumptions,
  DemographicSliderConfig,
  DemographicSliderId,
  StateBaseline,
  StateCode,
  StateDemographicWeights,
} from "@/types/election";

export const demographicSliderIds = [
  "youthTurnout",
  "seniorTurnout",
  "suburbanVoteShift",
  "ruralTurnout",
  "independentVoteShift",
  "collegeEducatedVoteShift",
  "nonCollegeVoteShift",
] as const satisfies readonly DemographicSliderId[];

export const defaultDemographicAssumptions = Object.fromEntries(
  demographicSliderIds.map((id) => [id, 0]),
) as DemographicAssumptions;

export const demographicSliderBounds = {
  min: -15,
  max: 15,
  step: 0.5,
} as const;

export const demographicSliderConfigs: DemographicSliderConfig[] = [
  {
    id: "youthTurnout",
    label: "Youth turnout",
    lowLabel: "Fewer young voters",
    neutralLabel: "Usual turnout",
    highLabel: "More young voters",
    lowReadout: "Lower youth turnout",
    highReadout: "Higher youth turnout",
  },
  {
    id: "seniorTurnout",
    label: "Senior turnout",
    lowLabel: "Fewer senior voters",
    neutralLabel: "Usual turnout",
    highLabel: "More senior voters",
    lowReadout: "Lower senior turnout",
    highReadout: "Higher senior turnout",
  },
  {
    id: "suburbanVoteShift",
    label: "Suburban vote shift",
    lowLabel: "Suburbs shift R",
    neutralLabel: "No shift",
    highLabel: "Suburbs shift D",
    lowReadout: "Suburbs shifting Republican",
    highReadout: "Suburbs shifting Democratic",
  },
  {
    id: "ruralTurnout",
    label: "Rural turnout",
    lowLabel: "Lower rural turnout",
    neutralLabel: "Usual turnout",
    highLabel: "Higher rural turnout",
    lowReadout: "Lower rural turnout",
    highReadout: "Higher rural turnout",
  },
  {
    id: "independentVoteShift",
    label: "Independent vote shift",
    lowLabel: "Independents shift R",
    neutralLabel: "No shift",
    highLabel: "Independents shift D",
    lowReadout: "Independents shifting Republican",
    highReadout: "Independents shifting Democratic",
  },
  {
    id: "collegeEducatedVoteShift",
    label: "College-educated vote shift",
    lowLabel: "College voters shift R",
    neutralLabel: "No shift",
    highLabel: "College voters shift D",
    lowReadout: "College-educated voters shifting Republican",
    highReadout: "College-educated voters shifting Democratic",
  },
  {
    id: "nonCollegeVoteShift",
    label: "Non-college vote shift",
    lowLabel: "Non-college voters shift R",
    neutralLabel: "No shift",
    highLabel: "Non-college voters shift D",
    lowReadout: "Non-college voters shifting Republican",
    highReadout: "Non-college voters shifting Democratic",
  },
];

const highYouthStates = new Set<StateCode>([
  "AZ",
  "CA",
  "CO",
  "DC",
  "GA",
  "NV",
  "NC",
  "TX",
  "UT",
  "WA",
]);

const mediumYouthStates = new Set<StateCode>([
  "FL",
  "IL",
  "MA",
  "MD",
  "MI",
  "MN",
  "NY",
  "OR",
  "VA",
]);

const highSeniorStates = new Set<StateCode>([
  "AZ",
  "FL",
  "ME",
  "MI",
  "NH",
  "OH",
  "PA",
  "WI",
  "WV",
]);

const mediumSeniorStates = new Set<StateCode>([
  "CT",
  "DE",
  "IA",
  "MT",
  "NM",
  "OR",
  "SC",
  "VT",
]);

const highSuburbanStates = new Set<StateCode>([
  "AZ",
  "CO",
  "FL",
  "GA",
  "MI",
  "MN",
  "NC",
  "NV",
  "PA",
  "TX",
  "VA",
  "WI",
]);

const mediumSuburbanStates = new Set<StateCode>([
  "CA",
  "CT",
  "IL",
  "IN",
  "MD",
  "NJ",
  "NY",
  "OH",
  "OR",
  "WA",
]);

const highRuralStates = new Set<StateCode>([
  "AL",
  "AR",
  "IA",
  "ID",
  "KS",
  "KY",
  "LA",
  "ME",
  "MS",
  "MT",
  "ND",
  "NE",
  "OK",
  "SD",
  "TN",
  "WV",
  "WY",
]);

const mediumRuralStates = new Set<StateCode>([
  "AK",
  "IN",
  "MO",
  "NH",
  "NM",
  "OH",
  "SC",
  "VT",
  "WI",
]);

const highIndependentStates = new Set<StateCode>([
  "AZ",
  "CO",
  "GA",
  "MI",
  "MN",
  "NC",
  "NH",
  "NV",
  "PA",
  "VA",
  "WI",
]);

const mediumIndependentStates = new Set<StateCode>([
  "FL",
  "IA",
  "ME",
  "NE",
  "OH",
  "OR",
  "TX",
]);

const highCollegeStates = new Set<StateCode>([
  "CA",
  "CO",
  "CT",
  "DC",
  "MA",
  "MD",
  "NJ",
  "NY",
  "OR",
  "RI",
  "VA",
  "VT",
  "WA",
]);

const mediumCollegeStates = new Set<StateCode>([
  "IL",
  "MN",
  "NH",
  "NM",
  "PA",
]);

const highNonCollegeStates = new Set<StateCode>([
  "AL",
  "AR",
  "IA",
  "IN",
  "KY",
  "LA",
  "MI",
  "MS",
  "MO",
  "OH",
  "OK",
  "PA",
  "TN",
  "WI",
  "WV",
  "WY",
]);

const mediumNonCollegeStates = new Set<StateCode>([
  "AK",
  "AZ",
  "FL",
  "GA",
  "NC",
  "NV",
  "SC",
  "TX",
]);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundWeight(value: number) {
  return Number(value.toFixed(2));
}

function exposure(
  stateCode: StateCode,
  highStates: Set<StateCode>,
  mediumStates: Set<StateCode>,
) {
  if (highStates.has(stateCode)) {
    return 1;
  }

  if (mediumStates.has(stateCode)) {
    return 0.58;
  }

  return 0.24;
}

function competitivenessMultiplier(state: StateBaseline) {
  return clamp(1.16 - Math.abs(state.baselineMargin) / 48, 0.56, 1.16);
}

function sensitivity(
  state: StateBaseline,
  highStates: Set<StateCode>,
  mediumStates: Set<StateCode>,
  base: number,
  emphasis: number,
  direction: 1 | -1 = 1,
) {
  return roundWeight(
    direction *
      (base + emphasis * exposure(state.code, highStates, mediumStates)) *
      competitivenessMultiplier(state),
  );
}

export function getDemographicWeightsForState(
  state: StateBaseline,
): StateDemographicWeights {
  return {
    youthTurnout: sensitivity(state, highYouthStates, mediumYouthStates, 0.13, 0.42),
    seniorTurnout: sensitivity(
      state,
      highSeniorStates,
      mediumSeniorStates,
      0.11,
      0.34,
      -1,
    ),
    suburbanVoteShift: sensitivity(
      state,
      highSuburbanStates,
      mediumSuburbanStates,
      0.14,
      0.5,
    ),
    ruralTurnout: sensitivity(state, highRuralStates, mediumRuralStates, 0.12, 0.44, -1),
    independentVoteShift: sensitivity(
      state,
      highIndependentStates,
      mediumIndependentStates,
      0.22,
      0.38,
    ),
    collegeEducatedVoteShift: sensitivity(
      state,
      highCollegeStates,
      mediumCollegeStates,
      0.13,
      0.44,
    ),
    nonCollegeVoteShift: sensitivity(
      state,
      highNonCollegeStates,
      mediumNonCollegeStates,
      0.12,
      0.4,
    ),
  };
}
