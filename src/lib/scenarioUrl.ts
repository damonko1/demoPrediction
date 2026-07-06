import {
  defaultHistoricalElectionYear,
  historicalElectionYears,
} from "@/data/historicalElectionData.generated";
import {
  defaultDemographicAssumptions,
  demographicSliderBounds,
  demographicSliderIds,
} from "@/data/demographicSliders";
import type {
  DemographicAssumptions,
  DemographicSliderId,
  HistoricalElectionYear,
  LegislativeChamber,
  ScenarioAssumptions,
  SimulationTab,
} from "@/types/election";

const swingParam = "swing";
const baselineYearParam = "year";
const tabParam = "tab";
const houseSwingParam = "houseSwing";
const senateSwingParam = "senateSwing";
const houseSeatParam = "houseSeat";
const senateSeatParam = "senateSeat";
const demographicParams: Record<DemographicSliderId, string> = {
  youthTurnout: "youth",
  seniorTurnout: "senior",
  suburbanVoteShift: "suburbs",
  ruralTurnout: "rural",
  independentVoteShift: "independents",
  collegeEducatedVoteShift: "college",
  nonCollegeVoteShift: "noncollege",
};

export const scenarioSwingBounds = {
  min: -15,
  max: 15,
} as const;

function clampSwing(value: number) {
  return Math.min(
    scenarioSwingBounds.max,
    Math.max(scenarioSwingBounds.min, value),
  );
}

function clampDemographicValue(value: number) {
  return Math.min(
    demographicSliderBounds.max,
    Math.max(demographicSliderBounds.min, value),
  );
}

export function normalizeSwing(value: number) {
  return Number(clampSwing(value).toFixed(1));
}

function normalizeDemographicValue(value: number) {
  return Number(clampDemographicValue(value).toFixed(1));
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
  const demographics = {
    ...defaultDemographicAssumptions,
    ...assumptions.demographics,
  };

  if (Math.abs(nationalSwing) >= 0.05) {
    params.set(swingParam, nationalSwing.toFixed(1));
  }

  if (baselineYear !== defaultHistoricalElectionYear) {
    params.set(baselineYearParam, String(baselineYear));
  }

  demographicSliderIds.forEach((id) => {
    const value = normalizeDemographicValue(demographics[id]);

    if (Math.abs(value) >= 0.05) {
      params.set(demographicParams[id], value.toFixed(1));
    }
  });

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

  return tab === "house" || tab === "senate" || tab === "president"
    ? tab
    : "president";
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
  return params.get(chamber === "house" ? houseSeatParam : senateSeatParam);
}

export function appScenarioToUrl({
  activeTab,
  basePath = "/",
  baselineYear = defaultHistoricalElectionYear,
  houseSeatId,
  houseSwing,
  presidentialAssumptions,
  senateSeatId,
  senateSwing,
}: {
  activeTab: SimulationTab;
  basePath?: string;
  baselineYear?: HistoricalElectionYear;
  presidentialAssumptions: ScenarioAssumptions;
  houseSwing: number;
  senateSwing: number;
  houseSeatId: string;
  senateSeatId: string;
}) {
  const params = scenarioToSearchParams(presidentialAssumptions, baselineYear);
  const normalizedHouseSwing = normalizeSwing(houseSwing);
  const normalizedSenateSwing = normalizeSwing(senateSwing);

  if (activeTab !== "president") {
    params.set(tabParam, activeTab);
  }

  if (Math.abs(normalizedHouseSwing) >= 0.05) {
    params.set(houseSwingParam, normalizedHouseSwing.toFixed(1));
  }

  if (Math.abs(normalizedSenateSwing) >= 0.05) {
    params.set(senateSwingParam, normalizedSenateSwing.toFixed(1));
  }

  if (houseSeatId) {
    params.set(houseSeatParam, houseSeatId);
  }

  if (senateSeatId) {
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
    adjustments: [],
  };
}
