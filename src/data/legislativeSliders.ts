import type {
  DemographicAssumptions,
  LegislativeChamber,
  LegislativeSeatBaseline,
  LegislativeSliderAssumptions,
  LegislativeSliderConfig,
  LegislativeSliderId,
  Party,
  StateCode,
} from "@/types/election";

export const legislativeSliderIds = [
  "genericTurnout",
  "incumbencyAdvantage",
  "openSeatPenalty",
  "candidateQuality",
  "suburbanDistrictShift",
  "ruralDistrictShift",
  "collegeEducatedDistrictShift",
  "nonCollegeDistrictShift",
  "presidentialCoattails",
  "statePartisanshipElasticity",
  "independentVoteShift",
  "antiIncumbentWave",
] as const satisfies readonly LegislativeSliderId[];

export const defaultLegislativeSliderAssumptions = Object.fromEntries(
  legislativeSliderIds.map((id) => [id, 0]),
) as LegislativeSliderAssumptions;

export const legislativeSliderBounds = {
  min: -10,
  max: 10,
  step: 0.5,
} as const;

export const legislativeSliderConfigs: LegislativeSliderConfig[] = [
  {
    id: "genericTurnout",
    chambers: ["house", "senate"],
    label: "Generic turnout",
    lowLabel: "R-leaning turnout",
    neutralLabel: "Neutral turnout",
    highLabel: "D-leaning turnout",
    lowReadout: "Turnout tilts Republican",
    highReadout: "Turnout tilts Democratic",
    helperText: "Weighted by district competitiveness and low-data status.",
  },
  {
    id: "incumbencyAdvantage",
    chambers: ["house", "senate"],
    label: "Incumbency advantage",
    lowLabel: "Weaker incumbents",
    neutralLabel: "No incumbency shift",
    highLabel: "Stronger incumbents",
    lowReadout: "Incumbents penalized",
    highReadout: "Incumbents protected",
    helperText: "Applies toward the current incumbent party where a roster incumbent exists.",
  },
  {
    id: "openSeatPenalty",
    chambers: ["house", "senate"],
    label: "Open-seat penalty",
    lowLabel: "Open seats protected",
    neutralLabel: "No open-seat shift",
    highLabel: "Open seats penalized",
    lowReadout: "Open seats protected",
    highReadout: "Open seats penalized",
    helperText: "Applies only where the current roster has no incumbent.",
  },
  {
    id: "candidateQuality",
    chambers: ["house", "senate"],
    label: "Candidate quality",
    lowLabel: "R candidate edge",
    neutralLabel: "No quality edge",
    highLabel: "D candidate edge",
    lowReadout: "Republican candidate edge",
    highReadout: "Democratic candidate edge",
    helperText: "Generic quality stress test, strongest in competitive districts.",
  },
  {
    id: "suburbanDistrictShift",
    chambers: ["house", "senate"],
    label: "Suburban district shift",
    lowLabel: "Suburbs shift R",
    neutralLabel: "No suburban shift",
    highLabel: "Suburbs shift D",
    lowReadout: "Suburban districts shift Republican",
    highReadout: "Suburban districts shift Democratic",
    helperText: "Uses state exposure plus district competitiveness as a rough district weight.",
  },
  {
    id: "ruralDistrictShift",
    chambers: ["house", "senate"],
    label: "Rural district shift",
    lowLabel: "Rural shift R",
    neutralLabel: "No rural shift",
    highLabel: "Rural shift D",
    lowReadout: "Rural districts shift Republican",
    highReadout: "Rural districts shift Democratic",
    helperText: "Uses rural-state exposure and district competitiveness.",
  },
  {
    id: "collegeEducatedDistrictShift",
    chambers: ["house"],
    label: "College-educated district shift",
    lowLabel: "College districts shift R",
    neutralLabel: "No college shift",
    highLabel: "College districts shift D",
    lowReadout: "College-educated districts shift Republican",
    highReadout: "College-educated districts shift Democratic",
    helperText: "Uses college-heavy state exposure and district competitiveness.",
  },
  {
    id: "nonCollegeDistrictShift",
    chambers: ["house"],
    label: "Non-college district shift",
    lowLabel: "Non-college shift R",
    neutralLabel: "No non-college shift",
    highLabel: "Non-college shift D",
    lowReadout: "Non-college districts shift Republican",
    highReadout: "Non-college districts shift Democratic",
    helperText: "Uses non-college-heavy state exposure and district competitiveness.",
  },
  {
    id: "presidentialCoattails",
    chambers: ["house", "senate"],
    label: "Presidential coattails",
    lowLabel: "R coattails",
    neutralLabel: "No coattails",
    highLabel: "D coattails",
    lowReadout: "Republican presidential pull",
    highReadout: "Democratic presidential pull",
    helperText: "A heuristic downballot coattail effect weighted by competitiveness.",
  },
  {
    id: "statePartisanshipElasticity",
    chambers: ["senate"],
    label: "State partisanship elasticity",
    lowLabel: "State lean R",
    neutralLabel: "No state shift",
    highLabel: "State lean D",
    lowReadout: "State baseline shifts Republican",
    highReadout: "State baseline shifts Democratic",
    helperText: "Senate-specific state baseline stress test, strongest in competitive states.",
  },
  {
    id: "independentVoteShift",
    chambers: ["senate"],
    label: "Independent vote shift",
    lowLabel: "Independents shift R",
    neutralLabel: "No independent shift",
    highLabel: "Independents shift D",
    lowReadout: "Independent vote shifts Republican",
    highReadout: "Independent vote shifts Democratic",
    helperText: "A Senate race stress test weighted by competitiveness and active-cycle status.",
  },
  {
    id: "antiIncumbentWave",
    chambers: ["house", "senate"],
    label: "Anti-incumbent wave",
    lowLabel: "Incumbents protected",
    neutralLabel: "No wave",
    highLabel: "Anti-incumbent wave",
    lowReadout: "Incumbents protected",
    highReadout: "Incumbents penalized",
    helperText: "Moves against current incumbents and has no effect in vacant seats.",
  },
];

const senateSliderCopy: Partial<Record<LegislativeSliderId, LegislativeSliderConfig>> = {
  genericTurnout: {
    ...legislativeSliderConfigs[0],
    label: "Turnout environment",
    lowLabel: "R turnout edge",
    neutralLabel: "Neutral turnout",
    highLabel: "D turnout edge",
    lowReadout: "Turnout environment tilts Republican",
    highReadout: "Turnout environment tilts Democratic",
    helperText: "Weighted by statewide vote volume, competitiveness, and low-data status.",
  },
  candidateQuality: {
    ...legislativeSliderConfigs[3],
    helperText: "Generic Senate candidate-quality stress test, strongest in competitive races.",
  },
  suburbanDistrictShift: {
    ...legislativeSliderConfigs[4],
    label: "Suburban shift",
    lowReadout: "Suburban-heavy states shift Republican",
    highReadout: "Suburban-heavy states shift Democratic",
    helperText: "Uses state exposure plus race competitiveness as a rough Senate weight.",
  },
  ruralDistrictShift: {
    ...legislativeSliderConfigs[5],
    label: "Rural turnout",
    lowReadout: "Rural-heavy states shift Republican",
    highReadout: "Rural-heavy states shift Democratic",
    helperText: "Uses rural-state exposure and Senate race competitiveness.",
  },
  antiIncumbentWave: {
    ...legislativeSliderConfigs[11],
    helperText: "Moves against current Senate incumbents and has no effect in vacant seats.",
  },
};

export function getLegislativeSliderConfigsForChamber(
  chamber: LegislativeChamber,
): LegislativeSliderConfig[] {
  return legislativeSliderConfigs
    .filter((config) => config.chambers.includes(chamber))
    .map((config) => {
      const senateConfig =
        chamber === "senate" ? senateSliderCopy[config.id] : undefined;

      return senateConfig ?? config;
    });
}

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

const highCollegeStates = new Set<StateCode>([
  "CA",
  "CO",
  "CT",
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

const mediumCollegeStates = new Set<StateCode>(["IL", "MN", "NH", "NM", "PA"]);

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

function partySign(party: Party) {
  return party === "democratic" ? 1 : -1;
}

function incumbentParty(seat: LegislativeSeatBaseline): Party | null {
  const incumbentPartyValue = seat.incumbent?.caucusParty ?? seat.incumbent?.party;

  return incumbentPartyValue === "democratic" || incumbentPartyValue === "republican"
    ? incumbentPartyValue
    : null;
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

function competitivenessMultiplier(seat: LegislativeSeatBaseline) {
  return clamp(1.18 - Math.abs(seat.baselineMargin) / 54, 0.25, 1.18);
}

function lowDataMultiplier(seat: LegislativeSeatBaseline) {
  return seat.lowData ? 0.62 : 1;
}

function turnoutMultiplier(seat: LegislativeSeatBaseline) {
  if (seat.totalVotes <= 0) {
    return 0.55;
  }

  return clamp(seat.totalVotes / 180000, 0.62, 1.18);
}

function exposureWeight(
  seat: LegislativeSeatBaseline,
  highStates: Set<StateCode>,
  mediumStates: Set<StateCode>,
  base: number,
  emphasis: number,
) {
  return roundWeight(
    (base + emphasis * exposure(seat.stateCode, highStates, mediumStates)) *
      competitivenessMultiplier(seat) *
      lowDataMultiplier(seat),
  );
}

export function getLegislativeSliderWeight(
  seat: LegislativeSeatBaseline,
  id: LegislativeSliderId,
) {
  const competitive = competitivenessMultiplier(seat);
  const lowData = lowDataMultiplier(seat);
  const incumbent = incumbentParty(seat);
  const incumbentSign = incumbent ? partySign(incumbent) : 0;
  const baselineSign = partySign(seat.baselineControlParty);

  if (id === "genericTurnout") {
    return roundWeight(0.42 * competitive * lowData * turnoutMultiplier(seat));
  }

  if (id === "incumbencyAdvantage") {
    return roundWeight(incumbentSign * 0.62 * competitive * lowData);
  }

  if (id === "openSeatPenalty") {
    return seat.incumbent
      ? 0
      : roundWeight(-baselineSign * 0.72 * competitive * lowData);
  }

  if (id === "candidateQuality") {
    return roundWeight(0.58 * competitive * lowData);
  }

  if (id === "suburbanDistrictShift") {
    return exposureWeight(seat, highSuburbanStates, mediumSuburbanStates, 0.12, 0.46);
  }

  if (id === "ruralDistrictShift") {
    return exposureWeight(seat, highRuralStates, mediumRuralStates, 0.1, 0.42);
  }

  if (id === "collegeEducatedDistrictShift") {
    return exposureWeight(seat, highCollegeStates, mediumCollegeStates, 0.11, 0.43);
  }

  if (id === "nonCollegeDistrictShift") {
    return exposureWeight(seat, highNonCollegeStates, mediumNonCollegeStates, 0.11, 0.4);
  }

  if (id === "presidentialCoattails") {
    return roundWeight(0.5 * competitive * lowData);
  }

  if (id === "statePartisanshipElasticity") {
    return roundWeight(0.46 * competitive * lowData);
  }

  if (id === "independentVoteShift") {
    const activeCycleMultiplier =
      "upNextCycle" in seat && !seat.upNextCycle ? 0.62 : 1;

    return roundWeight(0.44 * competitive * lowData * activeCycleMultiplier);
  }

  if (id === "antiIncumbentWave") {
    return roundWeight(-incumbentSign * 0.55 * competitive * lowData);
  }

  return 0;
}

function normalizeCopyValue(value: number) {
  return Number(
    clamp(value, legislativeSliderBounds.min, legislativeSliderBounds.max).toFixed(1),
  );
}

export function getLegislativeAssumptionsFromPresident(
  demographics: DemographicAssumptions,
  presidentialSwing: number,
): LegislativeSliderAssumptions {
  return {
    ...defaultLegislativeSliderAssumptions,
    genericTurnout: normalizeCopyValue(
      (demographics.youthTurnout - demographics.seniorTurnout) / 2,
    ),
    incumbencyAdvantage: 0,
    openSeatPenalty: 0,
    candidateQuality: 0,
    suburbanDistrictShift: normalizeCopyValue(demographics.suburbanVoteShift),
    ruralDistrictShift: normalizeCopyValue(-demographics.ruralTurnout),
    collegeEducatedDistrictShift: normalizeCopyValue(
      demographics.collegeEducatedVoteShift,
    ),
    nonCollegeDistrictShift: normalizeCopyValue(demographics.nonCollegeVoteShift),
    presidentialCoattails: normalizeCopyValue(presidentialSwing),
    statePartisanshipElasticity: normalizeCopyValue(presidentialSwing / 2),
    independentVoteShift: normalizeCopyValue(demographics.independentVoteShift),
    antiIncumbentWave: 0,
  };
}
