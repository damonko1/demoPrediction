export type Party = "democratic" | "republican";

export type StateCode = string;

export type StateBaseline = {
  code: StateCode;
  name: string;
  electoralVotes: number;
  electoralVoteUnits?: readonly ElectoralVoteUnit[];
  baselineMargin: number;
  baselineMargins: Record<Party, number>;
  baselineWinner: Party;
  baselineYear: HistoricalElectionYear;
  democraticVotes: number;
  republicanVotes: number;
  otherVotes: number;
  totalVotes: number;
  mapShapeId: string;
  tile: {
    row: number;
    col: number;
  };
};

export type HistoricalElectionYear =
  | 2000
  | 2004
  | 2008
  | 2012
  | 2016
  | 2020
  | 2024;

export type HistoricalStateResult = {
  code: StateCode;
  democraticVotes: number;
  republicanVotes: number;
  otherVotes: number;
  totalVotes: number;
  baselineMargin: number;
  electoralVotes: number;
};

export type ElectoralVoteUnitKind = "statewide" | "congressional-district";

export type ElectoralVoteUnit = {
  id: string;
  label: string;
  kind: ElectoralVoteUnitKind;
  electoralVotes: number;
  baselineMargin: number;
  sourceNote: string;
};

export type ElectoralVoteUnitResult = ElectoralVoteUnit & {
  simulatedMargin: number;
  simulatedWinner: Party;
  baselineWinner: Party;
  flipped: boolean;
};

export type ScenarioAdjustment = {
  id: string;
  label: string;
  stateDeltas: Partial<Record<StateCode, number>>;
};

export type DemographicSliderId =
  | "youthTurnout"
  | "seniorTurnout"
  | "suburbanVoteShift"
  | "ruralTurnout"
  | "independentVoteShift"
  | "collegeEducatedVoteShift"
  | "nonCollegeVoteShift";

export type DemographicAssumptions = Record<DemographicSliderId, number>;

export type DemographicSliderConfig = {
  id: DemographicSliderId;
  label: string;
  lowLabel: string;
  neutralLabel: string;
  highLabel: string;
  lowReadout: string;
  highReadout: string;
};

export type StateDemographicWeights = Record<DemographicSliderId, number>;

export type ScenarioAssumptionDriver = {
  id: "nationalSwing" | DemographicSliderId;
  label: string;
  value: number;
  weight: number;
  delta: number;
};

export type ScenarioAssumptions = {
  nationalSwing: number;
  demographics: DemographicAssumptions;
  adjustments?: ScenarioAdjustment[];
};

export type ScenarioPresetId =
  | "highYouthTurnout"
  | "suburbanShift"
  | "ruralSurge"
  | "lowTurnout"
  | "popularVoteElectoralSplit"
  | "resetBaseline";

export type ScenarioPreset = {
  id: ScenarioPresetId;
  label: string;
  summary: string;
  assumptions: ScenarioAssumptions;
};

export type StateScenarioResult = {
  state: StateBaseline;
  baselineWinner: Party;
  simulatedWinner: Party;
  simulatedMargin: number;
  electoralVotes: ElectoralTotals;
  baselineElectoralVotes: ElectoralTotals;
  splitElectoralVotes: ElectoralVoteUnitResult[];
  flipped: boolean;
  marginToFlip: number;
  totalAdjustment: number;
  demographicDelta: number;
  assumptionDrivers: ScenarioAssumptionDriver[];
};

export type ElectoralTotals = Record<Party, number>;

export type ScenarioResult = {
  assumptions: ScenarioAssumptions;
  states: StateScenarioResult[];
  totals: ElectoralTotals;
  baselineTotals: ElectoralTotals;
  flippedStates: StateScenarioResult[];
};

export type SimulationTab = "president" | "house" | "senate";

export type LegislativeChamber = "house" | "senate";

export type LegislativeParty = Party | "independent" | "vacant";

export type LegislativePartyTotals = Record<LegislativeParty, number>;

export type LegislativeSourceId =
  | "mit-house-1976-2024"
  | "mit-senate-state-1976-2024"
  | "unitedstates-congress-legislators-current";

export type LegislativeOverrideKeys = {
  state: StateCode;
  district: string;
  race: string;
};

export type LegislativeOverrides = {
  states: Partial<Record<StateCode, number>>;
  districts: Partial<Record<string, number>>;
  races: Partial<Record<string, number>>;
};

export type LegislativeSliderId =
  | "genericTurnout"
  | "incumbencyAdvantage"
  | "openSeatPenalty"
  | "candidateQuality"
  | "suburbanDistrictShift"
  | "ruralDistrictShift"
  | "collegeEducatedDistrictShift"
  | "nonCollegeDistrictShift"
  | "presidentialCoattails"
  | "antiIncumbentWave";

export type LegislativeSliderAssumptions = Record<LegislativeSliderId, number>;

export type LegislativeSliderConfig = {
  id: LegislativeSliderId;
  label: string;
  lowLabel: string;
  neutralLabel: string;
  highLabel: string;
  lowReadout: string;
  highReadout: string;
  helperText: string;
};

export type LegislativeAssumptionDriver = {
  id: "nationalSwing" | "localOverride" | LegislativeSliderId;
  label: string;
  value: number;
  weight: number;
  delta: number;
  heuristic: boolean;
};

export type LegislativeAssumptions = {
  nationalSwing: number;
  sliders: LegislativeSliderAssumptions;
  overrides: LegislativeOverrides;
};

export type LegislativeIncumbent = {
  name: string;
  party: LegislativeParty;
  partyLabel: string;
  caucusParty: Party | null;
  firstYear: number;
  firstChamberServiceDate: string;
  currentTermStart: string;
  currentTermEnd: string;
  tenureYears: number;
  bioguideId: string;
};

export type LegislativeCandidate = {
  name: string;
  party: LegislativeParty;
  partyLabel: string;
  votes: number;
  voteShare: number;
  sourceParties: readonly string[];
  writeIn: boolean;
};

export type LegislativeSeatBaselineBase = {
  id: string;
  chamber: LegislativeChamber;
  stateCode: StateCode;
  stateName: string;
  districtLabel: string;
  sortIndex: number;
  incumbent: LegislativeIncumbent | null;
  baselineWinner: LegislativeParty;
  baselineControlParty: Party;
  baselineMargin: number;
  latestElectionYear: number;
  democraticVotes: number;
  republicanVotes: number;
  otherVotes: number;
  totalVotes: number;
  uncontested: boolean;
  lowData: boolean;
  specialElection: boolean;
  runoff: boolean;
  missingVoteTotal: boolean;
  cancelledElection: boolean;
  writeInVotes: number;
  writeInCandidateCount: number;
  candidateVoteTotalDifference: number;
  candidates: readonly LegislativeCandidate[];
  sourceId: LegislativeSourceId;
  sourceNote: string;
  overrideKeys: LegislativeOverrideKeys;
};

export type HouseDistrictBaseline = LegislativeSeatBaselineBase & {
  chamber: "house";
  district: number;
};

export type SenateSeatBaseline = LegislativeSeatBaselineBase & {
  chamber: "senate";
  senateClass: 1 | 2 | 3;
  specialElection: boolean;
  upNextCycle: boolean;
};

export type LegislativeSeatBaseline =
  | HouseDistrictBaseline
  | SenateSeatBaseline;

export type LegislativeSeatResult = {
  seat: LegislativeSeatBaseline;
  simulatedWinner: LegislativeParty;
  simulatedControlParty: Party;
  simulatedMargin: number;
  flipped: boolean;
  marginToFlip: number;
  totalAdjustment: number;
  sliderAdjustment: number;
  overrideAdjustment: number;
  assumptionDrivers: LegislativeAssumptionDriver[];
};

export type LegislativeScenarioResult = {
  chamber: LegislativeChamber;
  assumptions: LegislativeAssumptions;
  seats: LegislativeSeatResult[];
  totals: LegislativePartyTotals;
  baselineTotals: LegislativePartyTotals;
  currentRosterTotals: LegislativePartyTotals;
  controlTotals: ElectoralTotals;
  baselineControlTotals: ElectoralTotals;
  totalSeats: number;
  majorityThreshold: number;
  flippedSeats: LegislativeSeatResult[];
  tiedSeats: LegislativeSeatResult[];
  lowDataSeats: LegislativeSeatResult[];
};
