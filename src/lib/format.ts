import type { LegislativeParty, Party } from "@/types/election";
export { formatMargin, getPartyFromMargin } from "@/lib/formatMargin";

export function formatParty(party: Party) {
  return party === "democratic" ? "Democratic" : "Republican";
}

export function formatPartyShort(party: Party) {
  return party === "democratic" ? "D" : "R";
}

export function formatLegislativeParty(party: LegislativeParty) {
  if (party === "independent") {
    return "Independent";
  }

  if (party === "vacant") {
    return "Vacant";
  }

  return formatParty(party);
}

export function formatLegislativePartyShort(party: LegislativeParty) {
  if (party === "independent") {
    return "I";
  }

  if (party === "vacant") {
    return "V";
  }

  return formatPartyShort(party);
}

export function formatSignedPoints(value: number) {
  if (Math.abs(value) < 0.05) {
    return "0.0 pts";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)} pts`;
}

export function formatSwing(value: number) {
  if (Math.abs(value) < 0.05) {
    return "No national swing";
  }

  return `${value > 0 ? "D" : "R"} +${Math.abs(value).toFixed(1)} pts`;
}
