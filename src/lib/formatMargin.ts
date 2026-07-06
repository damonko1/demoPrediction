import type { Party } from "@/types/election";

export function getPartyFromMargin(margin: number): Party {
  return margin >= 0 ? "democratic" : "republican";
}

export function formatMargin(margin: number) {
  if (Math.abs(margin) < 0.05) {
    return "Tie";
  }

  return `${margin > 0 ? "D" : "R"} +${Math.abs(margin).toFixed(1)}`;
}
