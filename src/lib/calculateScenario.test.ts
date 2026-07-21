import { describe, expect, it } from "vitest";
import { defaultDemographicAssumptions } from "@/data/demographicSliders";
import { stateBaselines } from "@/data/states";
import {
  calculateScenario,
  calculateSimulatedMargin,
} from "@/lib/calculateScenario";
import type { ScenarioAssumptions, StateBaseline } from "@/types/election";

function assumptions(
  overrides: Partial<ScenarioAssumptions> = {},
): ScenarioAssumptions {
  return {
    nationalSwing: 0,
    demographics: { ...defaultDemographicAssumptions },
    stateOverrides: {},
    ...overrides,
  };
}

describe("calculateScenario", () => {
  it("preserves all 538 electoral votes at baseline and slider extremes", () => {
    const baseline = calculateScenario(stateBaselines, assumptions());
    const extreme = calculateScenario(
      stateBaselines,
      assumptions({
        nationalSwing: 1_000,
        demographics: Object.fromEntries(
          Object.keys(defaultDemographicAssumptions).map((id) => [id, -1_000]),
        ) as ScenarioAssumptions["demographics"],
      }),
    );

    expect(baseline.totals.democratic + baseline.totals.republican).toBe(538);
    expect(extreme.totals.democratic + extreme.totals.republican).toBe(538);
    expect(extreme.states.every((result) => Number.isFinite(result.simulatedMargin))).toBe(true);
    expect(extreme.states[0].assumptionDrivers[0]).toMatchObject({
      id: "nationalSwing",
      value: 15,
      delta: 15,
    });
    expect(
      extreme.states[0].assumptionDrivers
        .filter((driver) => driver.id !== "nationalSwing")
        .every((driver) => driver.value === -15),
    ).toBe(true);
  });

  it("turns non-finite and missing assumption fields into neutral values", () => {
    const malformed = {
      nationalSwing: Number.NaN,
      demographics: {
        youthTurnout: Number.POSITIVE_INFINITY,
      },
      stateOverrides: {
        PA: {
          turnout: Number.NEGATIVE_INFINITY,
          partisanShift: Number.NaN,
        },
      },
    } as unknown as ScenarioAssumptions;
    const pennsylvania = stateBaselines.find((state) => state.code === "PA")!;
    const scenario = calculateScenario([pennsylvania], malformed);

    expect(calculateSimulatedMargin(pennsylvania, malformed)).toBe(
      pennsylvania.baselineMargin,
    );
    expect(scenario.states[0].simulatedMargin).toBe(pennsylvania.baselineMargin);
    expect(scenario.states[0].totalAdjustment).toBe(0);
    expect(scenario.states[0].assumptionDrivers.every((driver) => Number.isFinite(driver.delta))).toBe(true);
  });

  it("falls back to statewide allocation when split-unit data is incomplete", () => {
    const maine = stateBaselines.find((state) => state.code === "ME")!;
    const incompleteMaine: StateBaseline = {
      ...maine,
      electoralVoteUnits: maine.electoralVoteUnits?.slice(0, 1),
    };
    const result = calculateScenario([incompleteMaine], assumptions()).states[0];

    expect(result.splitElectoralVotes).toHaveLength(1);
    expect(result.splitElectoralVotes[0].id).toBe("ME");
    expect(
      result.electoralVotes.democratic + result.electoralVotes.republican,
    ).toBe(maine.electoralVotes);
  });

  it("preserves the supplied winner when baseline margin data is non-finite", () => {
    const source = stateBaselines[0];
    const missingMargin: StateBaseline = {
      ...source,
      baselineMargin: Number.NaN,
      baselineWinner: "republican",
      electoralVoteUnits: undefined,
    };
    const result = calculateScenario([missingMargin], assumptions()).states[0];

    expect(result.baselineWinner).toBe("republican");
    expect(result.simulatedWinner).toBe("republican");
    expect(result.electoralVotes.republican).toBe(source.electoralVotes);
    expect(result.simulatedMargin).toBe(0);
  });

  it("returns a stable empty result when no state data is available", () => {
    const result = calculateScenario([], assumptions());

    expect(result.states).toEqual([]);
    expect(result.flippedStates).toEqual([]);
    expect(result.totals).toEqual({ democratic: 0, republican: 0 });
    expect(result.baselineTotals).toEqual({ democratic: 0, republican: 0 });
  });
});
