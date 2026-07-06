import type { ElectoralTotals, ScenarioResult } from "@/types/election";

export type MonteCarloSummary = {
  sampleCount: number;
  democraticWins: number;
  republicanWins: number;
  ties: number;
  democraticWinShare: number;
  republicanWinShare: number;
  tieShare: number;
  medianDemocraticEv: number;
  democraticEvRange: {
    low: number;
    high: number;
  };
};

const defaultSampleCount = 750;
const defaultMarginStdDev = 3.5;

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function randomNormal(random: () => number) {
  const u1 = Math.max(random(), Number.EPSILON);
  const u2 = random();

  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function getScenarioSeed(scenario: ScenarioResult) {
  const assumptionSeed = Object.entries(scenario.assumptions.demographics)
    .reduce((seed, [id, value]) => {
      return seed + id.length * 97 + Math.round((value + 20) * 31);
    }, Math.round((scenario.assumptions.nationalSwing + 20) * 100));
  const yearSeed = scenario.states[0]?.state.baselineYear ?? 2024;

  return yearSeed * 1009 + assumptionSeed;
}

function percentile(values: number[], percentileRank: number) {
  if (values.length === 0) {
    return 0;
  }

  const index = Math.min(
    values.length - 1,
    Math.max(0, Math.round((values.length - 1) * percentileRank)),
  );

  return values[index];
}

function emptyTotals(): ElectoralTotals {
  return {
    democratic: 0,
    republican: 0,
  };
}

export function calculateMonteCarloSummary(
  scenario: ScenarioResult,
  {
    marginStdDev = defaultMarginStdDev,
    sampleCount = defaultSampleCount,
  }: {
    marginStdDev?: number;
    sampleCount?: number;
  } = {},
): MonteCarloSummary {
  const random = createSeededRandom(getScenarioSeed(scenario));
  const democraticEvSamples: number[] = [];
  let democraticWins = 0;
  let republicanWins = 0;
  let ties = 0;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const totals = emptyTotals();

    scenario.states.forEach((stateResult) => {
      stateResult.splitElectoralVotes.forEach((unit) => {
        const sampledMargin =
          unit.simulatedMargin + randomNormal(random) * marginStdDev;
        const winner = sampledMargin >= 0 ? "democratic" : "republican";

        totals[winner] += unit.electoralVotes;
      });
    });

    democraticEvSamples.push(totals.democratic);

    if (totals.democratic > totals.republican) {
      democraticWins += 1;
    } else if (totals.republican > totals.democratic) {
      republicanWins += 1;
    } else {
      ties += 1;
    }
  }

  democraticEvSamples.sort((a, b) => a - b);

  return {
    sampleCount,
    democraticWins,
    republicanWins,
    ties,
    democraticWinShare: democraticWins / sampleCount,
    republicanWinShare: republicanWins / sampleCount,
    tieShare: ties / sampleCount,
    medianDemocraticEv: percentile(democraticEvSamples, 0.5),
    democraticEvRange: {
      low: percentile(democraticEvSamples, 0.1),
      high: percentile(democraticEvSamples, 0.9),
    },
  };
}
