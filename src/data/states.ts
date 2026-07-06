import { currentDatasetAccuracyProfiles } from "@/data/dataAccuracy";
import {
  defaultHistoricalElectionYear,
  historicalStateResultsByYear,
  splitElectoralVoteUnitsByYear,
} from "@/data/historicalElectionData.generated";
import type {
  ElectoralVoteUnit,
  HistoricalElectionYear,
  HistoricalStateResult,
  Party,
  StateBaseline,
} from "@/types/election";

export const stateMapShapeAssetPath = "/us-states-albers-10m.json";
export const stateBaselineAccuracyProfile = currentDatasetAccuracyProfiles.find(
  (profile) => profile.id === "historical-state-baselines",
);

const stateMapShapeIds = {
  AL: "01",
  AK: "02",
  AZ: "04",
  AR: "05",
  CA: "06",
  CO: "08",
  CT: "09",
  DE: "10",
  DC: "11",
  FL: "12",
  GA: "13",
  HI: "15",
  ID: "16",
  IL: "17",
  IN: "18",
  IA: "19",
  KS: "20",
  KY: "21",
  LA: "22",
  ME: "23",
  MD: "24",
  MA: "25",
  MI: "26",
  MN: "27",
  MS: "28",
  MO: "29",
  MT: "30",
  NE: "31",
  NV: "32",
  NH: "33",
  NJ: "34",
  NM: "35",
  NY: "36",
  NC: "37",
  ND: "38",
  OH: "39",
  OK: "40",
  OR: "41",
  PA: "42",
  RI: "44",
  SC: "45",
  SD: "46",
  TN: "47",
  TX: "48",
  UT: "49",
  VT: "50",
  VA: "51",
  WA: "53",
  WV: "54",
  WI: "55",
  WY: "56",
} as const;

type MappedStateCode = keyof typeof stateMapShapeIds;
type StateMetadata = Pick<
  StateBaseline,
  "name" | "tile"
> & {
  code: MappedStateCode;
};

export const stateCodeByMapShapeId = Object.fromEntries(
  Object.entries(stateMapShapeIds).map(([code, mapShapeId]) => [mapShapeId, code]),
) as Record<string, MappedStateCode>;

function getBaselineWinner(baselineMargin: number): Party {
  return baselineMargin >= 0 ? "democratic" : "republican";
}

function getHistoricalStateResult(
  year: HistoricalElectionYear,
  code: MappedStateCode,
): HistoricalStateResult {
  return historicalStateResultsByYear[year][code] as HistoricalStateResult;
}

function buildStateBaseline(
  state: StateMetadata,
  year: HistoricalElectionYear,
): StateBaseline {
  const historicalResult = getHistoricalStateResult(year, state.code);
  const splitElectoralVoteUnits = splitElectoralVoteUnitsByYear[year] as Partial<
    Record<MappedStateCode, readonly ElectoralVoteUnit[]>
  >;

  return {
    ...state,
    electoralVotes: historicalResult.electoralVotes,
    electoralVoteUnits: splitElectoralVoteUnits[state.code],
    baselineYear: year,
    baselineMargin: historicalResult.baselineMargin,
    baselineMargins: {
      democratic: historicalResult.baselineMargin,
      republican: -historicalResult.baselineMargin,
    },
    baselineWinner: getBaselineWinner(historicalResult.baselineMargin),
    democraticVotes: historicalResult.democraticVotes,
    republicanVotes: historicalResult.republicanVotes,
    otherVotes: historicalResult.otherVotes,
    totalVotes: historicalResult.totalVotes,
    mapShapeId: stateMapShapeIds[state.code],
  };
}

const stateMetadata: StateMetadata[] = [
  { code: "AK", name: "Alaska", tile: { row: 1, col: 1 } },
  { code: "ME", name: "Maine", tile: { row: 1, col: 12 } },
  { code: "WA", name: "Washington", tile: { row: 2, col: 2 } },
  { code: "MT", name: "Montana", tile: { row: 2, col: 3 } },
  { code: "ND", name: "North Dakota", tile: { row: 2, col: 4 } },
  { code: "MN", name: "Minnesota", tile: { row: 2, col: 5 } },
  { code: "WI", name: "Wisconsin", tile: { row: 2, col: 6 } },
  { code: "MI", name: "Michigan", tile: { row: 2, col: 7 } },
  { code: "VT", name: "Vermont", tile: { row: 2, col: 10 } },
  { code: "NH", name: "New Hampshire", tile: { row: 2, col: 11 } },
  { code: "MA", name: "Massachusetts", tile: { row: 2, col: 12 } },
  { code: "OR", name: "Oregon", tile: { row: 3, col: 2 } },
  { code: "ID", name: "Idaho", tile: { row: 3, col: 3 } },
  { code: "SD", name: "South Dakota", tile: { row: 3, col: 4 } },
  { code: "IA", name: "Iowa", tile: { row: 3, col: 5 } },
  { code: "IL", name: "Illinois", tile: { row: 3, col: 6 } },
  { code: "IN", name: "Indiana", tile: { row: 3, col: 7 } },
  { code: "OH", name: "Ohio", tile: { row: 3, col: 8 } },
  { code: "PA", name: "Pennsylvania", tile: { row: 3, col: 9 } },
  { code: "NY", name: "New York", tile: { row: 3, col: 10 } },
  { code: "CT", name: "Connecticut", tile: { row: 3, col: 11 } },
  { code: "RI", name: "Rhode Island", tile: { row: 3, col: 12 } },
  { code: "CA", name: "California", tile: { row: 4, col: 2 } },
  { code: "NV", name: "Nevada", tile: { row: 4, col: 3 } },
  { code: "WY", name: "Wyoming", tile: { row: 4, col: 4 } },
  { code: "NE", name: "Nebraska", tile: { row: 4, col: 5 } },
  { code: "MO", name: "Missouri", tile: { row: 4, col: 6 } },
  { code: "KY", name: "Kentucky", tile: { row: 4, col: 7 } },
  { code: "WV", name: "West Virginia", tile: { row: 4, col: 8 } },
  { code: "VA", name: "Virginia", tile: { row: 4, col: 9 } },
  { code: "NJ", name: "New Jersey", tile: { row: 4, col: 10 } },
  { code: "DE", name: "Delaware", tile: { row: 4, col: 11 } },
  { code: "DC", name: "District of Columbia", tile: { row: 4, col: 12 } },
  { code: "AZ", name: "Arizona", tile: { row: 5, col: 3 } },
  { code: "UT", name: "Utah", tile: { row: 5, col: 4 } },
  { code: "CO", name: "Colorado", tile: { row: 5, col: 5 } },
  { code: "KS", name: "Kansas", tile: { row: 5, col: 6 } },
  { code: "AR", name: "Arkansas", tile: { row: 5, col: 7 } },
  { code: "TN", name: "Tennessee", tile: { row: 5, col: 8 } },
  { code: "NC", name: "North Carolina", tile: { row: 5, col: 9 } },
  { code: "SC", name: "South Carolina", tile: { row: 5, col: 10 } },
  { code: "MD", name: "Maryland", tile: { row: 5, col: 11 } },
  { code: "NM", name: "New Mexico", tile: { row: 6, col: 4 } },
  { code: "OK", name: "Oklahoma", tile: { row: 6, col: 5 } },
  { code: "LA", name: "Louisiana", tile: { row: 6, col: 6 } },
  { code: "MS", name: "Mississippi", tile: { row: 6, col: 7 } },
  { code: "AL", name: "Alabama", tile: { row: 6, col: 8 } },
  { code: "GA", name: "Georgia", tile: { row: 6, col: 9 } },
  { code: "HI", name: "Hawaii", tile: { row: 7, col: 1 } },
  { code: "TX", name: "Texas", tile: { row: 7, col: 5 } },
  { code: "FL", name: "Florida", tile: { row: 7, col: 10 } },
];

export function getStateBaselinesForYear(
  year: HistoricalElectionYear = defaultHistoricalElectionYear,
) {
  return stateMetadata.map((state) => buildStateBaseline(state, year));
}

export const stateBaselines = getStateBaselinesForYear();
