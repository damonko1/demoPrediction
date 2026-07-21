import {
  defaultDemographicAssumptions,
  demographicSliderBounds,
  demographicSliderConfigs,
  getDemographicWeightsForState,
} from "@/data/demographicSliders";
import { getPartyFromMargin } from "@/lib/format";
import { normalizeStateOverride } from "@/lib/localOverrides";
import {
  finiteOrZero,
  normalizeBoundedNumber,
  normalizeElectoralVotes,
  normalizeSwing,
} from "@/lib/simulationNormalization";
import type {
  ElectoralTotals,
  ElectoralVoteUnit,
  ElectoralVoteUnitResult,
  ScenarioAssumptionDriver,
  ScenarioAssumptions,
  ScenarioResult,
  StateBaseline,
  StateScenarioResult,
} from "@/types/election";

const emptyTotals: ElectoralTotals = {
  democratic: 0,
  republican: 0,
};

function cloneEmptyTotals(): ElectoralTotals {
  return { ...emptyTotals };
}

function getBaselineWinner(state: StateBaseline) {
  return Number.isFinite(state.baselineMargin)
    ? getPartyFromMargin(state.baselineMargin)
    : state.baselineWinner;
}

function getScenarioDemographics(assumptions: ScenarioAssumptions) {
  const demographics = {
    ...defaultDemographicAssumptions,
    ...assumptions.demographics,
  };

  return Object.fromEntries(
    demographicSliderConfigs.map(({ id }) => [
      id,
      normalizeBoundedNumber(demographics[id], demographicSliderBounds),
    ]),
  ) as typeof demographics;
}

function calculateAssumptionDrivers(
  state: StateBaseline,
  assumptions: ScenarioAssumptions,
): ScenarioAssumptionDriver[] {
  const demographicAssumptions = getScenarioDemographics(assumptions);
  const demographicWeights = getDemographicWeightsForState(state);
  const rawStateOverride = assumptions.stateOverrides?.[state.code];
  const stateOverride = rawStateOverride
    ? normalizeStateOverride(rawStateOverride)
    : undefined;

  return [
    {
      id: "nationalSwing",
      label: "National swing",
      value: normalizeSwing(assumptions.nationalSwing),
      weight: 1,
      delta: normalizeSwing(assumptions.nationalSwing),
    },
    ...demographicSliderConfigs.map((config) => {
      const value = demographicAssumptions[config.id];
      const weight = demographicWeights[config.id];

      return {
        id: config.id,
        label: config.label,
        value,
        weight,
        delta: value * weight,
      };
    }),
    ...(stateOverride
      ? [
          {
            id: "stateTurnout" as const,
            label: "State turnout override",
            value: stateOverride.turnout,
            weight: 1,
            delta: stateOverride.turnout,
          },
          {
            id: "statePartisanShift" as const,
            label: "State partisan shift",
            value: stateOverride.partisanShift,
            weight: 1,
            delta: stateOverride.partisanShift,
          },
          {
            id: "stateCandidateQuality" as const,
            label: "State candidate quality",
            value: stateOverride.candidateQuality,
            weight: 1,
            delta: stateOverride.candidateQuality,
          },
        ]
      : []),
  ];
}

function sumDriverDeltas(drivers: ScenarioAssumptionDriver[]) {
  return drivers.reduce((total, driver) => total + driver.delta, 0);
}

export function calculateSimulatedMargin(
  state: StateBaseline,
  assumptions: ScenarioAssumptions,
) {
  return finiteOrZero(state.baselineMargin) +
    sumDriverDeltas(calculateAssumptionDrivers(state, assumptions));
}

function calculateTotals(states: StateScenarioResult[]): ElectoralTotals {
  return states.reduce<ElectoralTotals>(
    (totals, stateResult) => {
      totals.democratic += stateResult.electoralVotes.democratic;
      totals.republican += stateResult.electoralVotes.republican;
      return totals;
    },
    cloneEmptyTotals(),
  );
}

function calculateBaselineTotals(states: StateScenarioResult[]): ElectoralTotals {
  return states.reduce<ElectoralTotals>(
    (totals, stateResult) => {
      totals.democratic += stateResult.baselineElectoralVotes.democratic;
      totals.republican += stateResult.baselineElectoralVotes.republican;
      return totals;
    },
    cloneEmptyTotals(),
  );
}

function getStatewideElectoralVoteUnit(state: StateBaseline): ElectoralVoteUnit {
  return {
    id: state.code,
    label: state.name,
    kind: "statewide",
    electoralVotes: normalizeElectoralVotes(state.electoralVotes),
    baselineMargin: state.baselineMargin,
    sourceNote: "Winner-take-all statewide electoral vote allocation.",
  };
}

function calculateElectoralVoteUnits(
  state: StateBaseline,
  totalAdjustment: number,
): ElectoralVoteUnitResult[] {
  const expectedElectoralVotes = normalizeElectoralVotes(state.electoralVotes);
  const providedUnits = (state.electoralVoteUnits ?? [])
    .filter((unit) => unit && typeof unit.id === "string" && unit.id.length > 0)
    .map((unit) => ({
      ...unit,
      electoralVotes: normalizeElectoralVotes(unit.electoralVotes),
    }))
    .filter((unit) => unit.electoralVotes > 0);
  const providedElectoralVotes = providedUnits.reduce(
    (total, unit) => total + unit.electoralVotes,
    0,
  );
  const unitIdsAreUnique = new Set(providedUnits.map((unit) => unit.id)).size ===
    providedUnits.length;
  const electoralVoteUnits =
    providedUnits.length > 0 &&
    unitIdsAreUnique &&
    providedElectoralVotes === expectedElectoralVotes
      ? providedUnits
      : [getStatewideElectoralVoteUnit(state)];

  return electoralVoteUnits.map((unit) => {
    const hasFiniteBaselineMargin = Number.isFinite(unit.baselineMargin);
    const baselineMargin = finiteOrZero(unit.baselineMargin);
    const simulatedMargin = baselineMargin + totalAdjustment;
    const baselineWinner = hasFiniteBaselineMargin
      ? getPartyFromMargin(baselineMargin)
      : getBaselineWinner(state);
    const simulatedWinner = !hasFiniteBaselineMargin && Math.abs(simulatedMargin) < 0.05
      ? baselineWinner
      : getPartyFromMargin(simulatedMargin);

    return {
      ...unit,
      baselineWinner,
      simulatedWinner,
      simulatedMargin,
      flipped: baselineWinner !== simulatedWinner,
    };
  });
}

function sumElectoralVoteUnits(
  units: ElectoralVoteUnitResult[],
  winnerField: "baselineWinner" | "simulatedWinner",
): ElectoralTotals {
  return units.reduce<ElectoralTotals>((totals, unit) => {
    totals[unit[winnerField]] += unit.electoralVotes;
    return totals;
  }, cloneEmptyTotals());
}

function calculateStateResult(
  state: StateBaseline,
  assumptions: ScenarioAssumptions,
): StateScenarioResult {
  const assumptionDrivers = calculateAssumptionDrivers(state, assumptions);
  const demographicDelta = assumptionDrivers
    .filter((driver) => demographicSliderConfigs.some((config) => config.id === driver.id))
    .reduce((total, driver) => total + driver.delta, 0);
  const overrideAdjustment = assumptionDrivers
    .filter((driver) => driver.id.startsWith("state"))
    .reduce((total, driver) => total + driver.delta, 0);
  const totalAdjustment = sumDriverDeltas(assumptionDrivers);
  const baselineMargin = finiteOrZero(state.baselineMargin);
  const simulatedMargin = baselineMargin + totalAdjustment;
  const baselineWinner = getBaselineWinner(state);
  const simulatedWinner = !Number.isFinite(state.baselineMargin) &&
    Math.abs(simulatedMargin) < 0.05
    ? baselineWinner
    : getPartyFromMargin(simulatedMargin);
  const splitElectoralVotes = calculateElectoralVoteUnits(state, totalAdjustment);

  return {
    state,
    baselineWinner,
    simulatedWinner,
    simulatedMargin,
    electoralVotes: sumElectoralVoteUnits(splitElectoralVotes, "simulatedWinner"),
    baselineElectoralVotes: sumElectoralVoteUnits(splitElectoralVotes, "baselineWinner"),
    splitElectoralVotes,
    flipped: baselineWinner !== simulatedWinner,
    marginToFlip: Math.abs(simulatedMargin),
    totalAdjustment,
    demographicDelta,
    overrideAdjustment,
    assumptionDrivers,
  };
}

function calculateBaselineStateResult(state: StateBaseline): StateScenarioResult {
  const baselineMargin = finiteOrZero(state.baselineMargin);
  const baselineWinner = getBaselineWinner(state);
  const splitElectoralVotes = calculateElectoralVoteUnits(state, 0);

  return {
    state,
    baselineWinner,
    simulatedWinner: baselineWinner,
    simulatedMargin: baselineMargin,
    electoralVotes: sumElectoralVoteUnits(splitElectoralVotes, "baselineWinner"),
    baselineElectoralVotes: sumElectoralVoteUnits(splitElectoralVotes, "baselineWinner"),
    splitElectoralVotes,
    flipped: false,
    marginToFlip: Math.abs(baselineMargin),
    totalAdjustment: 0,
    demographicDelta: 0,
    overrideAdjustment: 0,
    assumptionDrivers: [],
  };
}

export function calculateScenario(
  states: StateBaseline[],
  assumptions: ScenarioAssumptions,
): ScenarioResult {
  const stateResults = states.map((state) => calculateStateResult(state, assumptions));
  const baselineStateResults = states.map(calculateBaselineStateResult);

  return {
    assumptions,
    states: stateResults,
    totals: calculateTotals(stateResults),
    baselineTotals: calculateBaselineTotals(baselineStateResults),
    flippedStates: stateResults
      .filter((state) => state.flipped)
      .sort((a, b) => Math.abs(a.state.baselineMargin) - Math.abs(b.state.baselineMargin)),
  };
}
