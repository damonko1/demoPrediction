export type Party = "democratic" | "republican";

export type StateCode = string;

export type StateBaseline = {
  code: StateCode;
  name: string;
  electoralVotes: number;
  baselineMargin: number;
  tile: {
    row: number;
    col: number;
  };
};

export type ScenarioAdjustment = {
  id: string;
  label: string;
  stateDeltas: Partial<Record<StateCode, number>>;
};

export type ScenarioAssumptions = {
  nationalSwing: number;
  adjustments?: ScenarioAdjustment[];
};

export type StateScenarioResult = {
  state: StateBaseline;
  baselineWinner: Party;
  simulatedWinner: Party;
  simulatedMargin: number;
  flipped: boolean;
  marginToFlip: number;
};

export type ElectoralTotals = Record<Party, number>;

export type ScenarioResult = {
  assumptions: ScenarioAssumptions;
  states: StateScenarioResult[];
  totals: ElectoralTotals;
  baselineTotals: ElectoralTotals;
  flippedStates: StateScenarioResult[];
};
