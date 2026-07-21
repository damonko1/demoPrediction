import { describe, expect, it } from "vitest";
import { defaultDemographicAssumptions } from "@/data/demographicSliders";
import { getDefaultLegislativeAssumptions } from "@/lib/calculateLegislativeScenario";
import {
  appScenarioToUrl,
  legislativeSeatFromSearchParams,
  legislativeOverridesFromSearchParams,
  legislativeSlidersFromSearchParams,
  legislativeSwingFromSearchParams,
  normalizeSwing,
  scenarioFromSearchParams,
  selectedStateFromSearchParams,
} from "@/lib/scenarioUrl";

describe("local override URL state", () => {
  it("round-trips state, district, and active Senate race overrides", () => {
    const house = getDefaultLegislativeAssumptions();
    const senate = getDefaultLegislativeAssumptions();
    const stateOverrides = {
      PA: { turnout: 1.5, partisanShift: -2, candidateQuality: 0.5 },
      CA: { turnout: 0, partisanShift: 1, candidateQuality: 0 },
    };
    house.overrides = {
      states: stateOverrides,
      districts: {
        "AK-AL": { turnout: -1, candidateQuality: 2, seatStatus: "open" },
      },
      races: {},
    };
    senate.overrides = {
      states: stateOverrides,
      districts: {},
      races: {
        "GA-S2": { turnout: 2, candidateQuality: -1, seatStatus: "democratic" },
      },
    };

    const url = appScenarioToUrl({
      activeTab: "senate",
      presidentialAssumptions: {
        nationalSwing: 0,
        demographics: { ...defaultDemographicAssumptions },
        stateOverrides,
      },
      selectedStateCode: "PA",
      houseSwing: 0,
      houseOverrides: house.overrides,
      senateSwing: 0,
      senateOverrides: senate.overrides,
      houseSeatId: "AK-AL",
      senateSeatId: "GA-S2",
    });
    const params = new URL(url, "https://example.test").searchParams;

    expect(scenarioFromSearchParams(params).stateOverrides).toEqual(stateOverrides);
    expect(legislativeOverridesFromSearchParams(params, "house").districts).toEqual(
      house.overrides.districts,
    );
    expect(legislativeOverridesFromSearchParams(params, "senate").races).toEqual(
      senate.overrides.races,
    );
    expect(url.indexOf("CA")).toBeLessThan(url.indexOf("PA"));
  });

  it("rejects unknown, wrong-chamber, and non-cycle override IDs", () => {
    const params = new URLSearchParams();
    params.set("stateOverrides", JSON.stringify([["ZZ", 1, 1, 1]]));
    params.set("districtOverrides", JSON.stringify([["CA-S1", 1, 1, "open"]]));
    params.set("senateRaceOverrides", JSON.stringify([["GA-S3", 1, 1, "open"]]));

    expect(scenarioFromSearchParams(params).stateOverrides).toEqual({});
    expect(legislativeOverridesFromSearchParams(params, "house").districts).toEqual({});
    expect(legislativeOverridesFromSearchParams(params, "senate").races).toEqual({});
  });

  it("rejects malformed override values instead of coercing them", () => {
    const params = new URLSearchParams();
    params.set(
      "stateOverrides",
      JSON.stringify([
        ["PA", "3", 1, 1],
        ["GA", 99, -99, 0],
      ]),
    );
    params.set(
      "districtOverrides",
      JSON.stringify([
        ["AK-AL", true, 1, "open"],
        ["AL-01", 99, -99, "democratic"],
      ]),
    );

    expect(scenarioFromSearchParams(params).stateOverrides).toEqual({
      GA: { turnout: 10, partisanShift: -10, candidateQuality: 0 },
    });
    expect(legislativeOverridesFromSearchParams(params, "house").districts).toEqual({
      "AL-01": { turnout: 10, candidateQuality: -10, seatStatus: "democratic" },
    });
  });

  it("clamps scalar URL inputs and neutralizes non-finite values", () => {
    const params = new URLSearchParams({
      swing: "999",
      youth: "-999",
      houseSwing: "Infinity",
      hTurnout: "999",
    });

    expect(normalizeSwing(Number.NaN)).toBe(0);
    expect(scenarioFromSearchParams(params).nationalSwing).toBe(15);
    expect(scenarioFromSearchParams(params).demographics.youthTurnout).toBe(-15);
    expect(legislativeSwingFromSearchParams(params, "house")).toBe(0);
    expect(legislativeSlidersFromSearchParams(params, "house").genericTurnout).toBe(10);
  });

  it("returns only known selected state and seat IDs", () => {
    const valid = new URLSearchParams({
      state: "PA",
      houseSeat: "AK-AL",
      senateSeat: "GA-S2",
    });
    const invalid = new URLSearchParams({
      state: "ZZ",
      houseSeat: "ZZ-00",
      senateSeat: "ZZ-S1",
    });

    expect(selectedStateFromSearchParams(valid)).toBe("PA");
    expect(legislativeSeatFromSearchParams(valid, "house")).toBe("AK-AL");
    expect(legislativeSeatFromSearchParams(valid, "senate")).toBe("GA-S2");
    expect(selectedStateFromSearchParams(invalid)).toBeNull();
    expect(legislativeSeatFromSearchParams(invalid, "house")).toBeNull();
    expect(legislativeSeatFromSearchParams(invalid, "senate")).toBeNull();
  });
});
