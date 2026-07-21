export const scenarioSwingBounds = {
  min: -15,
  max: 15,
} as const;

export function normalizeBoundedNumber(
  value: number,
  bounds: { min: number; max: number },
  precision = 1,
) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const clampedValue = Math.min(bounds.max, Math.max(bounds.min, value));
  return Number(clampedValue.toFixed(precision));
}

export function normalizeSwing(value: number) {
  return normalizeBoundedNumber(value, scenarioSwingBounds);
}

export function finiteOrZero(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function normalizeElectoralVotes(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}
