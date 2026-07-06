import type {
  Party,
  ScenarioAssumptionDriver,
  ScenarioResult,
  StateScenarioResult,
} from "@/types/election";

const winningThreshold = 270;
const maxSensitivityItems = 5;

export type DriverSensitivity = {
  id: ScenarioAssumptionDriver["id"];
  label: string;
  totalWeightedDelta: number;
  maxStateDelta: number;
  maxStateCode: string;
};

export type PathTo270 = {
  party: Party;
  votesNeeded: number;
  electoralVotes: number;
  states: StateScenarioResult[];
};

export type TippingPointState = {
  result: StateScenarioResult;
  score: number;
};

export type SensitivityView = {
  closestStates: StateScenarioResult[];
  flippedFirst: StateScenarioResult[];
  biggestDrivers: DriverSensitivity[];
  pathTo270: PathTo270;
  tippingPointStates: TippingPointState[];
};

function getPartyShortOf270(scenario: ScenarioResult): Party {
  if (scenario.totals.democratic < winningThreshold) {
    return "democratic";
  }

  if (scenario.totals.republican < winningThreshold) {
    return "republican";
  }

  return scenario.totals.democratic >= scenario.totals.republican
    ? "republican"
    : "democratic";
}

function getCurrentLeader(scenario: ScenarioResult): Party {
  return scenario.totals.democratic >= scenario.totals.republican
    ? "democratic"
    : "republican";
}

function sortByCurrentCloseness(
  first: StateScenarioResult,
  second: StateScenarioResult,
) {
  return first.marginToFlip - second.marginToFlip ||
    second.state.electoralVotes - first.state.electoralVotes ||
    first.state.name.localeCompare(second.state.name);
}

function calculateBiggestDrivers(
  states: StateScenarioResult[],
): DriverSensitivity[] {
  const driverMap = new Map<ScenarioAssumptionDriver["id"], DriverSensitivity>();

  states.forEach((result) => {
    result.assumptionDrivers.forEach((driver) => {
      const weightedDelta = Math.abs(driver.delta) * result.state.electoralVotes;
      const existingDriver = driverMap.get(driver.id) ?? {
        id: driver.id,
        label: driver.label,
        totalWeightedDelta: 0,
        maxStateDelta: 0,
        maxStateCode: result.state.code,
      };

      existingDriver.totalWeightedDelta += weightedDelta;

      if (Math.abs(driver.delta) > Math.abs(existingDriver.maxStateDelta)) {
        existingDriver.maxStateDelta = driver.delta;
        existingDriver.maxStateCode = result.state.code;
      }

      driverMap.set(driver.id, existingDriver);
    });
  });

  return Array.from(driverMap.values())
    .filter((driver) => driver.totalWeightedDelta >= 0.05)
    .sort((a, b) => b.totalWeightedDelta - a.totalWeightedDelta)
    .slice(0, maxSensitivityItems);
}

function calculatePathTo270(scenario: ScenarioResult): PathTo270 {
  const party = getPartyShortOf270(scenario);
  const votesNeeded = Math.max(0, winningThreshold - scenario.totals[party]);
  const pickupStates = scenario.states
    .filter((result) => result.simulatedWinner !== party)
    .sort(sortByCurrentCloseness);
  const pathStates: StateScenarioResult[] = [];
  let electoralVotes = 0;

  for (const result of pickupStates) {
    if (electoralVotes >= votesNeeded) {
      break;
    }

    pathStates.push(result);
    electoralVotes += result.state.electoralVotes;
  }

  return {
    party,
    votesNeeded,
    electoralVotes,
    states: pathStates,
  };
}

function calculateTippingPointStates(
  scenario: ScenarioResult,
): TippingPointState[] {
  const leader = getCurrentLeader(scenario);

  return scenario.states
    .filter((result) => result.simulatedWinner === leader)
    .map((result) => ({
      result,
      score: result.state.electoralVotes / Math.max(result.marginToFlip, 0.5),
    }))
    .sort((a, b) => b.score - a.score ||
      a.result.marginToFlip - b.result.marginToFlip ||
      b.result.state.electoralVotes - a.result.state.electoralVotes)
    .slice(0, maxSensitivityItems);
}

export function calculateSensitivityView(
  scenario: ScenarioResult,
): SensitivityView {
  return {
    closestStates: [...scenario.states]
      .sort(sortByCurrentCloseness)
      .slice(0, maxSensitivityItems),
    flippedFirst: [...scenario.flippedStates]
      .sort((a, b) => Math.abs(a.state.baselineMargin) - Math.abs(b.state.baselineMargin))
      .slice(0, maxSensitivityItems),
    biggestDrivers: calculateBiggestDrivers(scenario.states),
    pathTo270: calculatePathTo270(scenario),
    tippingPointStates: calculateTippingPointStates(scenario),
  };
}
