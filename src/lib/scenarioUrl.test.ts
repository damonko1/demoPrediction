import { describe, expect, it } from "vitest";
import { defaultDemographicAssumptions } from "@/data/demographicSliders";
import { getDefaultLegislativeAssumptions } from "@/lib/calculateLegislativeScenario";
import {
  appScenarioToUrl,
  legislativeOverridesFromSearchParams,
  scenarioFromSearchParams,
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
});
