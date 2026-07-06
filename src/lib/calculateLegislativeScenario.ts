import { getPartyFromMargin } from "@/lib/format";
import type {
  LegislativeAssumptions,
  LegislativeChamber,
  LegislativeOverrides,
  LegislativeParty,
  LegislativePartyTotals,
  LegislativeScenarioResult,
  LegislativeSeatBaseline,
  LegislativeSeatResult,
  Party,
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

function getOverrideAdjustment(
  seat: LegislativeSeatBaseline,
  overrides: LegislativeOverrides,
) {
  const stateAdjustment = overrides.states[seat.overrideKeys.state] ?? 0;
  const districtAdjustment = overrides.districts[seat.overrideKeys.district] ?? 0;
  const raceAdjustment = overrides.races[seat.overrideKeys.race] ?? 0;

  return stateAdjustment + districtAdjustment + raceAdjustment;
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
  const overrideAdjustment = getOverrideAdjustment(seat, assumptions.overrides);
  const totalAdjustment = assumptions.nationalSwing + overrideAdjustment;
  const simulatedMargin = seat.baselineMargin + totalAdjustment;
  const simulatedControlParty = getPartyFromMargin(simulatedMargin);
  const flipped = simulatedControlParty !== seat.baselineControlParty;

  return {
    seat,
    simulatedWinner: getSimulatedWinner(seat, simulatedControlParty, flipped),
    simulatedControlParty,
    simulatedMargin,
    flipped,
    marginToFlip: Math.abs(simulatedMargin),
    totalAdjustment,
    overrideAdjustment,
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
      .sort((a, b) => Math.abs(a.seat.baselineMargin) - Math.abs(b.seat.baselineMargin)),
    lowDataSeats: seatResults.filter((result) => result.seat.lowData),
  };
}
