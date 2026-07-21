import { describe, expect, it } from "vitest";
import { houseDistrictBaselines } from "@/data/legislativeData.generated";
import {
  getSeatStatusOverrideDelta,
  hasSeatOverride,
  normalizeSeatOverride,
  normalizeStateOverride,
} from "@/lib/localOverrides";
import type { SeatOverride, SeatStatusOverride } from "@/types/election";

describe("local override normalization", () => {
  it("clamps finite values and neutralizes missing or non-finite values", () => {
    expect(
      normalizeStateOverride({
        turnout: 99,
        partisanShift: "5",
        candidateQuality: -99,
      }),
    ).toEqual({ turnout: 10, partisanShift: 0, candidateQuality: -10 });
    expect(normalizeSeatOverride(null)).toEqual({
      turnout: 0,
      candidateQuality: 0,
      seatStatus: "baseline",
    });
  });

  it("does not treat an invalid seat status as an open-seat override", () => {
    const malformed = {
      turnout: Number.NaN,
      candidateQuality: Number.POSITIVE_INFINITY,
      seatStatus: "surprise",
    } as unknown as SeatOverride;

    expect(hasSeatOverride(malformed)).toBe(false);
    expect(
      getSeatStatusOverrideDelta(
        houseDistrictBaselines[0],
        "surprise" as SeatStatusOverride,
      ),
    ).toBe(0);
  });
});
