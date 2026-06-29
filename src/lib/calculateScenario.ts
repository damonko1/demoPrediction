import { getPartyFromMargin } from "@/lib/format";
import type {
  ElectoralTotals,
  ScenarioAssumptions,
  ScenarioResult,
  StateBaseline,
  StateScenarioResult,
} from "@/types/election";

const emptyTotals: ElectoralTotals = {
  democratic: 0,
  republican: 0,
};

function calculateAdjustmentDelta(
  state: StateBaseline,
  assumptions: ScenarioAssumptions,
) {
  return (assumptions.adjustments ?? []).reduce((totalDelta, adjustment) => {
    return totalDelta + (adjustment.stateDeltas[state.code] ?? 0);
  }, 0);
}

function calculateTotals(states: StateScenarioResult[]): ElectoralTotals {
  return states.reduce<ElectoralTotals>(
    (totals, stateResult) => {
      totals[stateResult.simulatedWinner] += stateResult.state.electoralVotes;
      return totals;
    },
    { ...emptyTotals },
  );
}

export function calculateScenario(
  states: StateBaseline[],
  assumptions: ScenarioAssumptions,
): ScenarioResult {
  const stateResults = states.map<StateScenarioResult>((state) => {
    const adjustmentDelta = calculateAdjustmentDelta(state, assumptions);
    const simulatedMargin =
      state.baselineMargin + assumptions.nationalSwing + adjustmentDelta;
    const baselineWinner = getPartyFromMargin(state.baselineMargin);
    const simulatedWinner = getPartyFromMargin(simulatedMargin);

    return {
      state,
      baselineWinner,
      simulatedWinner,
      simulatedMargin,
      flipped: baselineWinner !== simulatedWinner,
      marginToFlip: Math.abs(simulatedMargin),
    };
  });

  const baselineStateResults = states.map<StateScenarioResult>((state) => {
    const baselineWinner = getPartyFromMargin(state.baselineMargin);

    return {
      state,
      baselineWinner,
      simulatedWinner: baselineWinner,
      simulatedMargin: state.baselineMargin,
      flipped: false,
      marginToFlip: Math.abs(state.baselineMargin),
    };
  });

  return {
    assumptions,
    states: stateResults,
    totals: calculateTotals(stateResults),
    baselineTotals: calculateTotals(baselineStateResults),
    flippedStates: stateResults
      .filter((state) => state.flipped)
      .sort((a, b) => Math.abs(a.state.baselineMargin) - Math.abs(b.state.baselineMargin)),
  };
}
