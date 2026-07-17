import { describe, expect, it } from "vitest";
import { getLegislativePresets, getMatchingLegislativePreset } from "@/data/legislativePresets";
import { getMatchingScenarioPreset, scenarioPresets } from "@/data/scenarioPresets";
import { getDefaultLegislativeAssumptions } from "@/lib/calculateLegislativeScenario";

describe("scenario preset matching", () => {
  it("identifies an exact presidential preset and treats neutral settings as baseline", () => {
    const preset = scenarioPresets.find((item) => item.id === "highYouthTurnout")!;

    expect(getMatchingScenarioPreset(preset.assumptions)?.id).toBe(preset.id);
    expect(
      getMatchingScenarioPreset({
        ...scenarioPresets.find((item) => item.id === "resetBaseline")!.assumptions,
        adjustments: [],
      }),
    ).toBeNull();
  });

  it("stops identifying a preset after one of its visible assumptions changes", () => {
    const preset = scenarioPresets.find((item) => item.id === "suburbanShift")!;

    expect(
      getMatchingScenarioPreset({
        ...preset.assumptions,
        demographics: {
          ...preset.assumptions.demographics,
          suburbanVoteShift: preset.assumptions.demographics.suburbanVoteShift + 1,
        },
      }),
    ).toBeNull();
  });

  it("identifies House and Senate presets without local overrides hiding the selection", () => {
    for (const chamber of ["house", "senate"] as const) {
      const preset = getLegislativePresets(chamber)[0];
      const assumptions = {
        ...preset.assumptions,
        overrides: {
          states: { PA: { turnout: 1, partisanShift: 0, candidateQuality: 0 } },
          districts: chamber === "house"
            ? { "PA-07": { turnout: 1, candidateQuality: 0, seatStatus: "baseline" as const } }
            : {},
          races: chamber === "senate"
            ? { "PA-S2": { turnout: 1, candidateQuality: 0, seatStatus: "baseline" as const } }
            : {},
        },
      };

      expect(getMatchingLegislativePreset(chamber, assumptions)?.id).toBe(preset.id);
    }
  });

  it("does not match the neutral legislative baseline to a stress-test preset", () => {
    const assumptions = getDefaultLegislativeAssumptions();

    expect(getMatchingLegislativePreset("house", assumptions)).toBeNull();
    expect(getMatchingLegislativePreset("senate", assumptions)).toBeNull();
  });
});
