import {
  defaultHistoricalElectionYear,
  historicalElectionYears,
} from "@/data/historicalElectionData.generated";
import {
  defaultLegislativeSliderAssumptions,
  getLegislativeSliderConfigsForChamber,
  legislativeSliderBounds,
  legislativeSliderIds,
} from "@/data/legislativeSliders";
import {
  defaultDemographicAssumptions,
  demographicSliderBounds,
  demographicSliderIds,
} from "@/data/demographicSliders";
import {
  houseDistrictBaselines,
  senateSeatBaselines,
} from "@/data/legislativeData.generated";
import { getStateBaselinesForYear } from "@/data/states";
import type {
  DemographicAssumptions,
  DemographicSliderId,
  HistoricalElectionYear,
  LegislativeChamber,
  LegislativeOverrides,
  LegislativeSliderAssumptions,
  LegislativeSliderId,
  ScenarioAssumptions,
  SeatOverride,
  StateOverrides,
  SimulationTab,
} from "@/types/election";
import {
  hasSeatOverride,
  hasStateOverride,
  isSeatStatusOverride,
  normalizeSeatOverride,
  normalizeStateOverride,
} from "@/lib/localOverrides";
import {
  normalizeBoundedNumber,
  normalizeSwing,
  scenarioSwingBounds,
} from "@/lib/simulationNormalization";

const swingParam = "swing";
const baselineYearParam = "year";
const tabParam = "tab";
const selectedStateParam = "state";
const houseSwingParam = "houseSwing";
const senateSwingParam = "senateSwing";
const houseSeatParam = "houseSeat";
const senateSeatParam = "senateSeat";
const stateOverridesParam = "stateOverrides";
const districtOverridesParam = "districtOverrides";
const senateRaceOverridesParam = "senateRaceOverrides";
const validStateCodes = new Set<string>(
  getStateBaselinesForYear(defaultHistoricalElectionYear).map((state) => state.code),
);
const validHouseSeatIds = new Set<string>(houseDistrictBaselines.map((seat) => seat.id));
const validSenateOverrideIds = new Set<string>(
  senateSeatBaselines.filter((seat) => seat.upNextCycle).map((seat) => seat.id),
);
const validSenateSeatIds = new Set<string>(senateSeatBaselines.map((seat) => seat.id));
const houseSliderParams: Record<LegislativeSliderId, string> = {
  genericTurnout: "hTurnout",
  incumbencyAdvantage: "hIncumb",
  openSeatPenalty: "hOpen",
  candidateQuality: "hQuality",
  suburbanDistrictShift: "hSuburb",
  ruralDistrictShift: "hRural",
  collegeEducatedDistrictShift: "hCollege",
  nonCollegeDistrictShift: "hNoncollege",
  presidentialCoattails: "hCoattails",
  statePartisanshipElasticity: "hPartisan",
  independentVoteShift: "hIndie",
  antiIncumbentWave: "hAntiInc",
};
const senateSliderParams: Record<LegislativeSliderId, string> = {
  genericTurnout: "sTurnout",
  incumbencyAdvantage: "sIncumb",
  openSeatPenalty: "sOpen",
  candidateQuality: "sQuality",
  suburbanDistrictShift: "sSuburb",
  ruralDistrictShift: "sRural",
  collegeEducatedDistrictShift: "sCollege",
  nonCollegeDistrictShift: "sNoncollege",
  presidentialCoattails: "sCoattails",
  statePartisanshipElasticity: "sPartisan",
  independentVoteShift: "sIndie",
  antiIncumbentWave: "sAntiInc",
};
const demographicParams: Record<DemographicSliderId, string> = {
  youthTurnout: "youth",
  seniorTurnout: "senior",
  suburbanVoteShift: "suburbs",
  ruralTurnout: "rural",
  independentVoteShift: "independents",
  collegeEducatedVoteShift: "college",
  nonCollegeVoteShift: "noncollege",
};

export { normalizeSwing, scenarioSwingBounds };

function normalizeDemographicValue(value: number) {
  return normalizeBoundedNumber(value, demographicSliderBounds);
}

function normalizeLegislativeSliderValue(value: number) {
  return normalizeBoundedNumber(value, legislativeSliderBounds);
}

function serializeStateOverrides(overrides: StateOverrides) {
  const entries = Object.entries(overrides)
    .filter(([id]) => validStateCodes.has(id))
    .map(([id, override]) => [id, normalizeStateOverride(override)] as const)
    .filter((entry) => hasStateOverride(entry[1]))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, override]) => [
      id,
      override.turnout,
      override.partisanShift,
      override.candidateQuality,
    ]);

  return entries.length ? JSON.stringify(entries) : "";
}

function serializeSeatOverrides(
  overrides: Partial<Record<string, SeatOverride>>,
  validIds: ReadonlySet<string>,
) {
  const entries = Object.entries(overrides)
    .filter(([id]) => validIds.has(id))
    .map(([id, override]) => [id, normalizeSeatOverride(override)] as const)
    .filter((entry) => hasSeatOverride(entry[1]))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, override]) => [
      id,
      override.turnout,
      override.candidateQuality,
      override.seatStatus,
    ]);

  return entries.length ? JSON.stringify(entries) : "";
}

function parseJsonArray(rawValue: string | null): unknown[] {
  if (!rawValue || rawValue.length > 64_000) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function stateOverridesFromSearchParams(params: URLSearchParams): StateOverrides {
  return parseJsonArray(params.get(stateOverridesParam)).reduce<StateOverrides>(
    (overrides, entry) => {
      if (!Array.isArray(entry) || entry.length !== 4 || typeof entry[0] !== "string") {
        return overrides;
      }

      const [id, turnout, partisanShift, candidateQuality] = entry;
      if (
        !validStateCodes.has(id) ||
        typeof turnout !== "number" ||
        !Number.isFinite(turnout) ||
        typeof partisanShift !== "number" ||
        !Number.isFinite(partisanShift) ||
        typeof candidateQuality !== "number" ||
        !Number.isFinite(candidateQuality)
      ) {
        return overrides;
      }

      const normalizedOverride = normalizeStateOverride({
        turnout,
        partisanShift,
        candidateQuality,
      });

      if (hasStateOverride(normalizedOverride)) {
        overrides[id] = normalizedOverride;
      }

      return overrides;
    },
    {},
  );
}

function seatOverridesFromSearchParams(
  params: URLSearchParams,
  paramName: string,
  validIds: ReadonlySet<string>,
) {
  return parseJsonArray(params.get(paramName)).reduce<Partial<Record<string, SeatOverride>>>(
    (overrides, entry) => {
      if (!Array.isArray(entry) || entry.length !== 4 || typeof entry[0] !== "string") {
        return overrides;
      }

      const [id, turnout, candidateQuality, seatStatus] = entry;
      if (
        !validIds.has(id) ||
        typeof turnout !== "number" ||
        !Number.isFinite(turnout) ||
        typeof candidateQuality !== "number" ||
        !Number.isFinite(candidateQuality) ||
        !isSeatStatusOverride(seatStatus)
      ) {
        return overrides;
      }

      const normalizedOverride = normalizeSeatOverride({
        turnout,
        candidateQuality,
        seatStatus,
      });

      if (hasSeatOverride(normalizedOverride)) {
        overrides[id] = normalizedOverride;
      }

      return overrides;
    },
    {},
  );
}

export function legislativeOverridesFromSearchParams(
  params: URLSearchParams,
  chamber: LegislativeChamber,
): LegislativeOverrides {
  return {
    states: stateOverridesFromSearchParams(params),
    districts: chamber === "house"
      ? seatOverridesFromSearchParams(
          params,
          districtOverridesParam,
          validHouseSeatIds,
        )
      : {},
    races: chamber === "senate"
      ? seatOverridesFromSearchParams(
          params,
          senateRaceOverridesParam,
          validSenateOverrideIds,
        )
      : {},
  };
}

export function normalizeHistoricalElectionYear(
  year: number,
): HistoricalElectionYear {
  return historicalElectionYears.includes(year as HistoricalElectionYear)
    ? year as HistoricalElectionYear
    : defaultHistoricalElectionYear;
}

export function baselineYearFromSearchParams(
  params: URLSearchParams,
): HistoricalElectionYear {
  const rawYear = params.get(baselineYearParam);
  const parsedYear = rawYear === null ? defaultHistoricalElectionYear : Number(rawYear);

  return Number.isFinite(parsedYear)
    ? normalizeHistoricalElectionYear(parsedYear)
    : defaultHistoricalElectionYear;
}

export function scenarioToSearchParams(
  assumptions: ScenarioAssumptions,
  baselineYear: HistoricalElectionYear = defaultHistoricalElectionYear,
) {
  const params = new URLSearchParams();
  const nationalSwing = normalizeSwing(assumptions.nationalSwing);
  const normalizedBaselineYear = normalizeHistoricalElectionYear(Number(baselineYear));
  const demographics = {
    ...defaultDemographicAssumptions,
    ...assumptions.demographics,
  };

  if (Math.abs(nationalSwing) >= 0.05) {
    params.set(swingParam, nationalSwing.toFixed(1));
  }

  if (normalizedBaselineYear !== defaultHistoricalElectionYear) {
    params.set(baselineYearParam, String(normalizedBaselineYear));
  }

  demographicSliderIds.forEach((id) => {
    const value = normalizeDemographicValue(demographics[id]);

    if (Math.abs(value) >= 0.05) {
      params.set(demographicParams[id], value.toFixed(1));
    }
  });

  const serializedStateOverrides = serializeStateOverrides(
    assumptions.stateOverrides ?? {},
  );
  if (serializedStateOverrides) {
    params.set(stateOverridesParam, serializedStateOverrides);
  }

  return params;
}

export function scenarioToUrl(
  assumptions: ScenarioAssumptions,
  basePath = "/",
  baselineYear: HistoricalElectionYear = defaultHistoricalElectionYear,
) {
  const params = scenarioToSearchParams(assumptions, baselineYear);
  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function simulationTabFromSearchParams(
  params: URLSearchParams,
): SimulationTab {
  const tab = params.get(tabParam);

  if (tab === "house" || tab === "senate" || tab === "president") {
    return tab;
  }

  // Lead a bare landing page with the current midterm cycle. Older shared
  // presidential URLs did not include an explicit tab, so keep treating any
  // URL with scenario state as presidential for backwards compatibility.
  return params.size === 0 ? "house" : "president";
}

export function legislativeSwingFromSearchParams(
  params: URLSearchParams,
  chamber: LegislativeChamber,
) {
  const paramName = chamber === "house" ? houseSwingParam : senateSwingParam;
  const rawSwing = params.get(paramName);
  const parsedSwing = rawSwing === null ? 0 : Number(rawSwing);

  return Number.isFinite(parsedSwing) ? normalizeSwing(parsedSwing) : 0;
}

export function legislativeSeatFromSearchParams(
  params: URLSearchParams,
  chamber: LegislativeChamber,
) {
  const seatId = params.get(chamber === "house" ? houseSeatParam : senateSeatParam);
  const validIds = chamber === "house" ? validHouseSeatIds : validSenateSeatIds;

  return seatId && validIds.has(seatId) ? seatId : null;
}

export function legislativeSlidersFromSearchParams(
  params: URLSearchParams,
  chamber: LegislativeChamber = "house",
): LegislativeSliderAssumptions {
  const sliderParams = chamber === "house" ? houseSliderParams : senateSliderParams;

  return legislativeSliderIds.reduce<LegislativeSliderAssumptions>(
    (currentAssumptions, id) => {
      const rawValue = params.get(sliderParams[id]);
      const parsedValue = rawValue === null ? 0 : Number(rawValue);

      currentAssumptions[id] = Number.isFinite(parsedValue)
        ? normalizeLegislativeSliderValue(parsedValue)
        : 0;

      return currentAssumptions;
    },
    { ...defaultLegislativeSliderAssumptions },
  );
}

export function selectedStateFromSearchParams(params: URLSearchParams) {
  const stateCode = params.get(selectedStateParam);
  return stateCode && validStateCodes.has(stateCode) ? stateCode : null;
}

export function appScenarioToUrl({
  activeTab,
  basePath = "/",
  baselineYear = defaultHistoricalElectionYear,
  houseSeatId,
  houseOverrides,
  houseSliders,
  houseSwing,
  presidentialAssumptions,
  selectedStateCode,
  senateSeatId,
  senateOverrides,
  senateSliders,
  senateSwing,
}: {
  activeTab: SimulationTab;
  basePath?: string;
  baselineYear?: HistoricalElectionYear;
  presidentialAssumptions: ScenarioAssumptions;
  selectedStateCode: string;
  houseSwing: number;
  houseSliders?: LegislativeSliderAssumptions;
  houseOverrides?: LegislativeOverrides;
  senateSwing: number;
  senateSliders?: LegislativeSliderAssumptions;
  senateOverrides?: LegislativeOverrides;
  houseSeatId: string;
  senateSeatId: string;
}) {
  const params = scenarioToSearchParams(presidentialAssumptions, baselineYear);
  const normalizedHouseSwing = normalizeSwing(houseSwing);
  const normalizedSenateSwing = normalizeSwing(senateSwing);

  params.set(tabParam, activeTab);

  if (validStateCodes.has(selectedStateCode)) {
    params.set(selectedStateParam, selectedStateCode);
  }

  if (Math.abs(normalizedHouseSwing) >= 0.05) {
    params.set(houseSwingParam, normalizedHouseSwing.toFixed(1));
  }

  getLegislativeSliderConfigsForChamber("house").forEach(({ id }) => {
    const value = normalizeLegislativeSliderValue(
      houseSliders?.[id] ?? defaultLegislativeSliderAssumptions[id],
    );

    if (Math.abs(value) >= 0.05) {
      params.set(houseSliderParams[id], value.toFixed(1));
    }
  });

  const serializedDistrictOverrides = serializeSeatOverrides(
    houseOverrides?.districts ?? {},
    validHouseSeatIds,
  );
  if (serializedDistrictOverrides) {
    params.set(districtOverridesParam, serializedDistrictOverrides);
  }

  if (Math.abs(normalizedSenateSwing) >= 0.05) {
    params.set(senateSwingParam, normalizedSenateSwing.toFixed(1));
  }

  getLegislativeSliderConfigsForChamber("senate").forEach(({ id }) => {
    const value = normalizeLegislativeSliderValue(
      senateSliders?.[id] ?? defaultLegislativeSliderAssumptions[id],
    );

    if (Math.abs(value) >= 0.05) {
      params.set(senateSliderParams[id], value.toFixed(1));
    }
  });

  const serializedSenateRaceOverrides = serializeSeatOverrides(
    senateOverrides?.races ?? {},
    validSenateOverrideIds,
  );
  if (serializedSenateRaceOverrides) {
    params.set(senateRaceOverridesParam, serializedSenateRaceOverrides);
  }

  if (validHouseSeatIds.has(houseSeatId)) {
    params.set(houseSeatParam, houseSeatId);
  }

  if (validSenateSeatIds.has(senateSeatId)) {
    params.set(senateSeatParam, senateSeatId);
  }

  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function scenarioFromSearchParams(
  params: URLSearchParams,
): ScenarioAssumptions {
  const rawSwing = params.get(swingParam);
  const parsedSwing = rawSwing === null ? 0 : Number(rawSwing);
  const demographics = demographicSliderIds.reduce<DemographicAssumptions>(
    (currentAssumptions, id) => {
      const rawValue = params.get(demographicParams[id]);
      const parsedValue = rawValue === null ? 0 : Number(rawValue);

      currentAssumptions[id] = Number.isFinite(parsedValue)
        ? normalizeDemographicValue(parsedValue)
        : 0;

      return currentAssumptions;
    },
    { ...defaultDemographicAssumptions },
  );

  return {
    nationalSwing: Number.isFinite(parsedSwing) ? normalizeSwing(parsedSwing) : 0,
    demographics,
    stateOverrides: stateOverridesFromSearchParams(params),
    adjustments: [],
  };
}
