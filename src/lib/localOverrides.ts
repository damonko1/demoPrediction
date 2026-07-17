import type {
  LegislativeSeatBaseline,
  SeatOverride,
  SeatStatusOverride,
  StateOverride,
} from "@/types/election";

export const localOverrideBounds = {
  min: -10,
  max: 10,
} as const;

export const emptyStateOverride: StateOverride = {
  turnout: 0,
  partisanShift: 0,
  candidateQuality: 0,
};

export const emptySeatOverride: SeatOverride = {
  turnout: 0,
  candidateQuality: 0,
  seatStatus: "baseline",
};

export function normalizeLocalOverrideValue(value: number) {
  const finiteValue = Number.isFinite(value) ? value : 0;
  return Number(
    Math.min(
      localOverrideBounds.max,
      Math.max(localOverrideBounds.min, finiteValue),
    ).toFixed(1),
  );
}

export function isSeatStatusOverride(value: unknown): value is SeatStatusOverride {
  return (
    value === "baseline" ||
    value === "open" ||
    value === "democratic" ||
    value === "republican"
  );
}

export function hasStateOverride(override?: StateOverride) {
  return Boolean(
    override &&
      (Math.abs(override.turnout) >= 0.05 ||
        Math.abs(override.partisanShift) >= 0.05 ||
        Math.abs(override.candidateQuality) >= 0.05),
  );
}

export function hasSeatOverride(override?: SeatOverride) {
  return Boolean(
    override &&
      (Math.abs(override.turnout) >= 0.05 ||
        Math.abs(override.candidateQuality) >= 0.05 ||
        override.seatStatus !== "baseline"),
  );
}

export function getSeatStatusOverrideDelta(
  seat: LegislativeSeatBaseline,
  status: SeatStatusOverride,
) {
  if (status === "baseline") {
    return 0;
  }

  if (status === "democratic") {
    return 1.5;
  }

  if (status === "republican") {
    return -1.5;
  }

  const incumbentControlParty =
    seat.incumbent?.caucusParty ??
    (seat.incumbent?.party === "democratic" || seat.incumbent?.party === "republican"
      ? seat.incumbent.party
      : null);

  if (incumbentControlParty === "democratic") {
    return -1.5;
  }

  if (incumbentControlParty === "republican") {
    return 1.5;
  }

  return 0;
}
