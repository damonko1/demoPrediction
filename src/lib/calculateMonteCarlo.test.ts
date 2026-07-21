import { describe, expect, it } from "vitest";
import { defaultDemographicAssumptions } from "@/data/demographicSliders";
import { stateBaselines } from "@/data/states";
import { calculateMonteCarloSummary } from "@/lib/calculateMonteCarlo";
import { calculateScenario } from "@/lib/calculateScenario";

const scenario = calculateScenario(stateBaselines, {
  nationalSwing: 0,
  demographics: { ...defaultDemographicAssumptions },
  stateOverrides: {},
});

describe("calculateMonteCarloSummary", () => {
  it("is deterministic for an identical scenario", () => {
    expect(calculateMonteCarloSummary(scenario, { sampleCount: 25 })).toEqual(
      calculateMonteCarloSummary(scenario, { sampleCount: 25 }),
    );
  });

  it("normalizes zero, negative, non-finite, and fractional sample counts", () => {
    expect(calculateMonteCarloSummary(scenario, { sampleCount: 0 }).sampleCount).toBe(1);
    expect(calculateMonteCarloSummary(scenario, { sampleCount: -12 }).sampleCount).toBe(1);
    expect(
      calculateMonteCarloSummary(scenario, { sampleCount: Number.NaN }).sampleCount,
    ).toBe(750);
    expect(calculateMonteCarloSummary(scenario, { sampleCount: 2.9 }).sampleCount).toBe(2);
  });

  it("caps huge runs and always returns finite shares", () => {
    const summary = calculateMonteCarloSummary(scenario, {
      marginStdDev: Number.POSITIVE_INFINITY,
      sampleCount: 1_000_000_000,
    });

    expect(summary.sampleCount).toBe(10_000);
    expect(summary.democraticWins + summary.republicanWins + summary.ties).toBe(10_000);
    expect(summary.democraticWinShare + summary.republicanWinShare + summary.tieShare).toBeCloseTo(1);
    expect(Object.values(summary.democraticEvRange).every(Number.isFinite)).toBe(true);
  });

  it("clamps a negative error band to a deterministic zero-error run", () => {
    const summary = calculateMonteCarloSummary(scenario, {
      marginStdDev: -5,
      sampleCount: 5,
    });

    expect(summary.democraticWins + summary.republicanWins + summary.ties).toBe(5);
    expect(summary.democraticEvRange.low).toBe(scenario.totals.democratic);
    expect(summary.democraticEvRange.high).toBe(scenario.totals.democratic);
  });
});
