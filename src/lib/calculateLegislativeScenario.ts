import {
  defaultLegislativeSliderAssumptions,
  getLegislativeSliderConfigsForChamber,
  getLegislativeSliderWeight,
  legislativeSliderBounds,
  legislativeSliderIds,
} from "@/data/legislativeSliders";
import { getPartyFromMargin, isTiedMargin } from "@/lib/format";
import {
  getSeatStatusOverrideDelta,
  normalizeSeatOverride,
  normalizeStateOverride,
} from "@/lib/localOverrides";
import {
  finiteOrZero,
  normalizeBoundedNumber,
  normalizeSwing,
} from "@/lib/simulationNormalization";
import type {
  LegislativeAssumptions,
  LegislativeAssumptionDriver,
  LegislativeChamber,
  LegislativeOverrides,
  LegislativeParty,
  LegislativePartyTotals,
  LegislativeScenarioResult,
  LegislativeSeatBaseline,
  LegislativeSeatResult,
  LegislativeSliderId,
  Party,
  SeatOverride,
} from "@/types/election";

const emptyPartyTotals: LegislativePartyTotals = {
  democratic: 0,
  republican: 0,
  independent: 0,
  vacant: 0,
};

const majorityThresholds: Record<LegislativeChamber, number> = {
  house: 218,
  senate: 51,
};

export const defaultLegislativeOverrides: LegislativeOverrides = {
  states: {},
  districts: {},
  races: {},
};

export function getDefaultLegislativeAssumptions(): LegislativeAssumptions {
  return {
    nationalSwing: 0,
    sliders: { ...defaultLegislativeSliderAssumptions },
    overrides: {
      states: {},
      districts: {},
      races: {},
    },
  };
}

function cloneEmptyPartyTotals(): LegislativePartyTotals {
  return { ...emptyPartyTotals };
}

function getCaucusParty(seat: LegislativeSeatBaseline): Party | null {
  return seat.incumbent?.caucusParty ?? null;
}

function calculateOverrideDrivers(
  seat: LegislativeSeatBaseline,
  overrides: LegislativeOverrides,
): LegislativeAssumptionDriver[] {
  const rawStateOverride = overrides.states[seat.overrideKeys.state];
  const stateOverride = rawStateOverride
    ? normalizeStateOverride(rawStateOverride)
    : undefined;
  const seatOverride = getSeatOverride(seat, overrides);
  const seatStatusDelta = seatOverride
    ? getSeatStatusOverrideDelta(seat, seatOverride.seatStatus)
    : 0;

  return [
    ...(stateOverride
      ? [
          {
            id: "stateTurnout" as const,
            label: "State turnout override",
            value: stateOverride.turnout,
            weight: getLegislativeSliderWeight(seat, "genericTurnout"),
            delta:
              stateOverride.turnout *
              getLegislativeSliderWeight(seat, "genericTurnout"),
            heuristic: true,
          },
          {
            id: "statePartisanShift" as const,
            label: "State partisan shift",
            value: stateOverride.partisanShift,
            weight: 1,
            delta: stateOverride.partisanShift,
            heuristic: true,
          },
          {
            id: "stateCandidateQuality" as const,
            label: "State candidate quality",
            value: stateOverride.candidateQuality,
            weight: getLegislativeSliderWeight(seat, "candidateQuality"),
            delta:
              stateOverride.candidateQuality *
              getLegislativeSliderWeight(seat, "candidateQuality"),
            heuristic: true,
          },
        ]
      : []),
    ...(seatOverride
      ? [
          {
            id: "localTurnout" as const,
            label: seat.chamber === "house" ? "District turnout override" : "Race turnout override",
            value: seatOverride.turnout,
            weight: 1,
            delta: seatOverride.turnout,
            heuristic: true,
          },
          {
            id: "localCandidateQuality" as const,
            label: seat.chamber === "house" ? "District candidate quality" : "Race candidate quality",
            value: seatOverride.candidateQuality,
            weight: 1,
            delta: seatOverride.candidateQuality,
            heuristic: true,
          },
          {
            id: "localSeatStatus" as const,
            label: "Incumbency / open-seat override",
            value: seatStatusDelta,
            weight: 1,
            delta: seatStatusDelta,
            heuristic: true,
          },
        ]
      : []),
  ];
}

function getScenarioSliders(assumptions: LegislativeAssumptions) {
  const sliders = {
    ...defaultLegislativeSliderAssumptions,
    ...assumptions.sliders,
  };

  return Object.fromEntries(
    legislativeSliderIds.map((id) => [
      id,
      normalizeBoundedNumber(sliders[id], legislativeSliderBounds),
    ]),
  ) as typeof sliders;
}

function getScenarioOverrides(
  assumptions: LegislativeAssumptions,
): LegislativeOverrides {
  return {
    states: assumptions.overrides?.states ?? {},
    districts: assumptions.overrides?.districts ?? {},
    races: assumptions.overrides?.races ?? {},
  };
}

function getSeatOverride(
  seat: LegislativeSeatBaseline,
  overrides: LegislativeOverrides,
): SeatOverride | undefined {
  const override = seat.chamber === "house"
    ? overrides.districts[seat.overrideKeys.district]
    : overrides.races[seat.overrideKeys.race];

  return override ? normalizeSeatOverride(override) : undefined;
}

function getScenarioSliderWeight(
  seat: LegislativeSeatBaseline,
  sliderId: LegislativeSliderId,
  overrides: LegislativeOverrides,
) {
  const baselineWeight = getLegislativeSliderWeight(seat, sliderId);
  const status = getSeatOverride(seat, overrides)?.seatStatus ?? "baseline";

  if (status === "baseline") {
    return baselineWeight;
  }

  const partyDirection = status === "democratic" ? 1 : status === "republican" ? -1 : 0;
  const candidateWeight = Math.abs(
    getLegislativeSliderWeight(seat, "candidateQuality"),
  );

  if (sliderId === "incumbencyAdvantage") {
    return partyDirection * candidateWeight;
  }

  if (sliderId === "openSeatPenalty") {
    if (status !== "open") {
      return 0;
    }

    return seat.baselineControlParty === "democratic"
      ? -candidateWeight
      : candidateWeight;
  }

  return baselineWeight;
}

function calculateAssumptionDrivers(
  seat: LegislativeSeatBaseline,
  assumptions: LegislativeAssumptions,
): LegislativeAssumptionDriver[] {
  const sliders = getScenarioSliders(assumptions);
  const overrides = getScenarioOverrides(assumptions);
  const drivers: LegislativeAssumptionDriver[] = [
    {
      id: "nationalSwing",
      label: "National chamber swing",
      value: normalizeSwing(assumptions.nationalSwing),
      weight: 1,
      delta: normalizeSwing(assumptions.nationalSwing),
      heuristic: false,
    },
    ...getLegislativeSliderConfigsForChamber(seat.chamber).map((config) => {
      const value = sliders[config.id];
      const weight = getScenarioSliderWeight(
        seat,
        config.id,
        overrides,
      );

      return {
        id: config.id,
        label: config.label,
        value,
        weight,
        delta: value * weight,
        heuristic: true,
      };
    }),
    ...calculateOverrideDrivers(seat, overrides),
  ];

  return drivers;
}

function sumDriverDeltas(drivers: readonly LegislativeAssumptionDriver[]) {
  return drivers.reduce((total, driver) => total + driver.delta, 0);
}

function getSimulatedWinner(
  seat: LegislativeSeatBaseline,
  simulatedControlParty: Party,
  flipped: boolean,
): LegislativeParty {
  if (
    !flipped &&
    seat.baselineWinner === "independent" &&
    getCaucusParty(seat) === simulatedControlParty
  ) {
    return "independent";
  }

  return simulatedControlParty;
}

function calculateSeatResult(
  seat: LegislativeSeatBaseline,
  assumptions: LegislativeAssumptions,
): LegislativeSeatResult {
  const shouldSimulateSeat = seat.chamber === "house" || seat.upNextCycle;
  const assumptionDrivers = shouldSimulateSeat
    ? calculateAssumptionDrivers(seat, assumptions)
    : [];
  const totalAdjustment = sumDriverDeltas(assumptionDrivers);
  const sliderAdjustment = assumptionDrivers
    .filter((driver) =>
      driver.id !== "nationalSwing" &&
      !driver.id.startsWith("state") &&
      !driver.id.startsWith("local"),
    )
    .reduce((total, driver) => total + driver.delta, 0);
  const overrideAdjustment = assumptionDrivers
    .filter((driver) => driver.id.startsWith("state") || driver.id.startsWith("local"))
    .reduce((total, driver) => total + driver.delta, 0);
  const simulatedMargin = finiteOrZero(seat.baselineMargin) + totalAdjustment;
  const simulatedControlParty = isTiedMargin(simulatedMargin)
    ? seat.baselineControlParty
    : getPartyFromMargin(simulatedMargin);
  const flipped = simulatedControlParty !== seat.baselineControlParty;

  return {
    seat,
    simulatedWinner: getSimulatedWinner(seat, simulatedControlParty, flipped),
    simulatedControlParty,
    simulatedMargin,
    flipped,
    marginToFlip: Math.abs(simulatedMargin),
    totalAdjustment,
    sliderAdjustment,
    overrideAdjustment,
    assumptionDrivers,
  };
}

function calculatePartyTotals(
  seatResults: LegislativeSeatResult[],
  partySelector: (result: LegislativeSeatResult) => LegislativeParty,
) {
  return seatResults.reduce<LegislativePartyTotals>((totals, result) => {
    totals[partySelector(result)] += 1;
    return totals;
  }, cloneEmptyPartyTotals());
}

function calculateBaselinePartyTotals(seats: readonly LegislativeSeatBaseline[]) {
  return seats.reduce<LegislativePartyTotals>((totals, seat) => {
    totals[seat.baselineWinner] += 1;
    return totals;
  }, cloneEmptyPartyTotals());
}

function calculateCurrentRosterTotals(seats: readonly LegislativeSeatBaseline[]) {
  return seats.reduce<LegislativePartyTotals>((totals, seat) => {
    totals[seat.incumbent?.party ?? "vacant"] += 1;
    return totals;
  }, cloneEmptyPartyTotals());
}

function calculateControlTotals(
  seats: readonly LegislativeSeatResult[],
  partySelector: (result: LegislativeSeatResult) => Party,
) {
  return seats.reduce<Record<Party, number>>(
    (totals, result) => {
      totals[partySelector(result)] += 1;
      return totals;
    },
    {
      democratic: 0,
      republican: 0,
    },
  );
}

function calculateBaselineControlTotals(
  seats: readonly LegislativeSeatBaseline[],
) {
  return seats.reduce<Record<Party, number>>(
    (totals, seat) => {
      totals[seat.baselineControlParty] += 1;
      return totals;
    },
    {
      democratic: 0,
      republican: 0,
    },
  );
}

export function calculateLegislativeScenario(
  chamber: LegislativeChamber,
  seats: readonly LegislativeSeatBaseline[],
  assumptions: LegislativeAssumptions,
): LegislativeScenarioResult {
  const seatResults = seats.map((seat) => calculateSeatResult(seat, assumptions));

  return {
    chamber,
    assumptions,
    seats: seatResults,
    totals: calculatePartyTotals(seatResults, (result) => result.simulatedWinner),
    baselineTotals: calculateBaselinePartyTotals(seats),
    currentRosterTotals: calculateCurrentRosterTotals(seats),
    controlTotals: calculateControlTotals(
      seatResults,
      (result) => result.simulatedControlParty,
    ),
    baselineControlTotals: calculateBaselineControlTotals(seats),
    totalSeats: seats.length,
    majorityThreshold: majorityThresholds[chamber],
    flippedSeats: seatResults
      .filter((result) => result.flipped)
      .sort(
        (a, b) =>
          Math.abs(a.seat.baselineMargin) - Math.abs(b.seat.baselineMargin) ||
          a.seat.sortIndex - b.seat.sortIndex ||
          a.seat.id.localeCompare(b.seat.id),
      ),
    tiedSeats: seatResults
      .filter((result) => isTiedMargin(result.simulatedMargin))
      .sort(
        (a, b) =>
          Math.abs(a.seat.baselineMargin) - Math.abs(b.seat.baselineMargin) ||
          a.seat.sortIndex - b.seat.sortIndex ||
          a.seat.id.localeCompare(b.seat.id),
      ),
    lowDataSeats: seatResults.filter((result) => result.seat.lowData),
  };
}
