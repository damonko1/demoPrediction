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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function normalizeUnknownLocalOverrideValue(value: unknown) {
  return normalizeLocalOverrideValue(typeof value === "number" ? value : Number.NaN);
}

export function normalizeLocalOverrideValue(value: number) {
  const finiteValue = Number.isFinite(value) ? value : 0;
  return Number(
    Math.min(
      localOverrideBounds.max,
      Math.max(localOverrideBounds.min, finiteValue),
    ).toFixed(1),
  );
}

export function normalizeStateOverride(value: unknown): StateOverride {
  const override = isRecord(value) ? value : {};

  return {
    turnout: normalizeUnknownLocalOverrideValue(override.turnout),
    partisanShift: normalizeUnknownLocalOverrideValue(override.partisanShift),
    candidateQuality: normalizeUnknownLocalOverrideValue(override.candidateQuality),
  };
}

export function normalizeSeatOverride(value: unknown): SeatOverride {
  const override = isRecord(value) ? value : {};

  return {
    turnout: normalizeUnknownLocalOverrideValue(override.turnout),
    candidateQuality: normalizeUnknownLocalOverrideValue(override.candidateQuality),
    seatStatus: isSeatStatusOverride(override.seatStatus)
      ? override.seatStatus
      : "baseline",
  };
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
  if (!override) {
    return false;
  }

  const normalizedOverride = normalizeStateOverride(override);
  return (
    Math.abs(normalizedOverride.turnout) >= 0.05 ||
    Math.abs(normalizedOverride.partisanShift) >= 0.05 ||
    Math.abs(normalizedOverride.candidateQuality) >= 0.05
  );
}

export function hasSeatOverride(override?: SeatOverride) {
  if (!override) {
    return false;
  }

  const normalizedOverride = normalizeSeatOverride(override);
  return (
    Math.abs(normalizedOverride.turnout) >= 0.05 ||
    Math.abs(normalizedOverride.candidateQuality) >= 0.05 ||
    normalizedOverride.seatStatus !== "baseline"
  );
}

export function getSeatStatusOverrideDelta(
  seat: LegislativeSeatBaseline,
  status: SeatStatusOverride,
) {
  if (!isSeatStatusOverride(status) || status === "baseline") {
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
