import type { Party } from "@/types/election";

export function getPartyFromMargin(margin: number): Party {
  return margin >= 0 ? "democratic" : "republican";
}

export function formatParty(party: Party) {
  return party === "democratic" ? "Democratic" : "Republican";
}

export function formatPartyShort(party: Party) {
  return party === "democratic" ? "D" : "R";
}

export function formatMargin(margin: number) {
  if (Math.abs(margin) < 0.05) {
    return "Tie";
  }

  return `${margin > 0 ? "D" : "R"} +${Math.abs(margin).toFixed(1)}`;
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
