import { describe, expect, it } from "vitest";
import {
  houseDistrictBaselines,
  senateSeatBaselines,
} from "@/data/legislativeData.generated";
import {
  calculateLegislativeScenario,
  getDefaultLegislativeAssumptions,
} from "@/lib/calculateLegislativeScenario";
import type { HouseDistrictBaseline } from "@/types/election";

describe("calculateLegislativeScenario", () => {
  it("keeps baseline chamber totals complete", () => {
    const assumptions = getDefaultLegislativeAssumptions();
    const house = calculateLegislativeScenario("house", houseDistrictBaselines, assumptions);
    const senate = calculateLegislativeScenario("senate", senateSeatBaselines, assumptions);

    expect(house.totalSeats).toBe(435);
    expect(house.controlTotals.democratic + house.controlTotals.republican).toBe(435);
    expect(senate.totalSeats).toBe(100);
    expect(senate.controlTotals.democratic + senate.controlTotals.republican).toBe(100);
  });

  it("applies one district override without changing another district", () => {
    const target = [...houseDistrictBaselines]
      .filter((seat) => Math.abs(seat.baselineMargin) < 9)
      .sort((a, b) => Math.abs(a.baselineMargin) - Math.abs(b.baselineMargin))[0];
    const untouched = houseDistrictBaselines.find((seat) => seat.id !== target.id)!;
    const assumptions = getDefaultLegislativeAssumptions();
    assumptions.overrides.districts[target.id] = {
      turnout: target.baselineMargin > 0 ? -10 : 10,
      candidateQuality: 0,
      seatStatus: "baseline",
    };

    const scenario = calculateLegislativeScenario("house", houseDistrictBaselines, assumptions);
    const targetResult = scenario.seats.find((result) => result.seat.id === target.id)!;
    const untouchedResult = scenario.seats.find((result) => result.seat.id === untouched.id)!;

    expect(targetResult.flipped).toBe(true);
    expect(Math.abs(targetResult.overrideAdjustment)).toBe(10);
    expect(untouchedResult.simulatedMargin).toBe(untouched.baselineMargin);
  });

  it("applies state overrides only to seats in that state", () => {
    const assumptions = getDefaultLegislativeAssumptions();
    assumptions.overrides.states.PA = {
      turnout: 2,
      partisanShift: 1,
      candidateQuality: -0.5,
    };
    const scenario = calculateLegislativeScenario("house", houseDistrictBaselines, assumptions);

    expect(
      scenario.seats
        .filter((result) => result.seat.stateCode === "PA")
        .every((result) => Math.abs(result.overrideAdjustment) >= 0.05),
    ).toBe(true);
    expect(
      scenario.seats
        .filter((result) => result.seat.stateCode !== "PA")
        .every((result) => result.overrideAdjustment === 0),
    ).toBe(true);
  });

  it("freezes Senate seats that are not up in the modeled cycle", () => {
    const assumptions = getDefaultLegislativeAssumptions();
    assumptions.nationalSwing = 10;
    assumptions.overrides.states.PA = {
      turnout: 5,
      partisanShift: 5,
      candidateQuality: 5,
    };
    const scenario = calculateLegislativeScenario("senate", senateSeatBaselines, assumptions);

    expect(
      scenario.seats
        .filter(
          (result) =>
            "upNextCycle" in result.seat && !result.seat.upNextCycle,
        )
        .every(
          (result) =>
            result.totalAdjustment === 0 &&
            result.simulatedMargin === result.seat.baselineMargin,
        ),
    ).toBe(true);
    expect(
      scenario.seats.some(
        (result) =>
          "upNextCycle" in result.seat &&
          result.seat.upNextCycle &&
          Math.abs(result.totalAdjustment) > 0,
      ),
    ).toBe(true);
  });

  it("holds baseline control on an exact tie", () => {
    const baseSeat = houseDistrictBaselines[0];
    const tiedSeat: HouseDistrictBaseline = {
      ...baseSeat,
      id: "ZZ-01",
      stateCode: "ZZ",
      districtLabel: "ZZ-01",
      baselineWinner: "republican",
      baselineControlParty: "republican",
      baselineMargin: 0,
      sortIndex: 1,
      overrideKeys: { state: "ZZ", district: "ZZ-01", race: "ZZ-01" },
    };
    const scenario = calculateLegislativeScenario(
      "house",
      [tiedSeat],
      getDefaultLegislativeAssumptions(),
    );

    expect(scenario.tiedSeats).toHaveLength(1);
    expect(scenario.seats[0].simulatedControlParty).toBe("republican");
    expect(scenario.seats[0].flipped).toBe(false);
  });

  it("sorts flipped seats deterministically", () => {
    const baseSeat = houseDistrictBaselines[0];
    const makeSeat = (
      id: string,
      baselineMargin: number,
      sortIndex: number,
    ): HouseDistrictBaseline => ({
      ...baseSeat,
      id,
      stateCode: "ZZ",
      districtLabel: id,
      baselineWinner: "republican",
      baselineControlParty: "republican",
      baselineMargin,
      sortIndex,
      overrideKeys: { state: "ZZ", district: id, race: id },
    });
    const assumptions = getDefaultLegislativeAssumptions();
    assumptions.nationalSwing = 4;
    const scenario = calculateLegislativeScenario(
      "house",
      [
        makeSeat("ZZ-03", -2, 3),
        makeSeat("ZZ-02", -1, 2),
        makeSeat("ZZ-01", -1, 1),
      ],
      assumptions,
    );

    expect(scenario.flippedSeats.map((result) => result.seat.id)).toEqual([
      "ZZ-01",
      "ZZ-02",
      "ZZ-03",
    ]);
  });

  it("lets an open-seat override drive the chamber open-seat control", () => {
    const target = houseDistrictBaselines.find(
      (seat) => Math.abs(seat.baselineMargin) < 15,
    )!;
    const assumptions = getDefaultLegislativeAssumptions();
    assumptions.overrides.districts[target.id] = {
      turnout: 0,
      candidateQuality: 0,
      seatStatus: "open",
    };
    assumptions.sliders.openSeatPenalty = 3;
    const scenario = calculateLegislativeScenario("house", [target], assumptions);
    const driver = scenario.seats[0].assumptionDrivers.find(
      (item) => item.id === "openSeatPenalty",
    );

    expect(driver?.weight).not.toBe(0);
    expect(driver?.delta).not.toBe(0);
  });
});
