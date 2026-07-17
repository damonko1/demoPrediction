import {
  formatMargin,
  formatParty,
  formatPartyShort,
  formatSignedPoints,
  formatSwing,
} from "@/lib/format";
import type {
  LegislativeAssumptionDriver,
  LegislativeScenarioResult,
  LegislativeSeatResult,
  Party,
  ScenarioResult,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeSummaryProps = {
  scenario: LegislativeScenarioResult;
  presidentialScenario?: ScenarioResult;
};

type SensitivityListItem = {
  id: string;
  label: string;
  subLabel: string;
  detail: string;
};

type StateDelegationRow = {
  stateCode: string;
  stateName: string;
  totalSeats: number;
  democraticDelta: number;
  republicanDelta: number;
  flippedSeats: number;
  closeSeats: number;
  averageAbsAdjustment: number;
  volatilityScore: number;
};

const closeSeatThreshold = 5;

function getChamberLabel(scenario: LegislativeScenarioResult) {
  return scenario.chamber === "house" ? "House" : "Senate";
}

function formatSeatDelta(value: number) {
  if (value === 0) {
    return "0";
  }

  return value > 0 ? `+${value}` : `${value}`;
}

function getSeatName(result: LegislativeSeatResult) {
  return result.seat.chamber === "house"
    ? result.seat.districtLabel
    : `${result.seat.stateCode} S${result.seat.senateClass}`;
}

function getOppositeParty(party: Party): Party {
  return party === "democratic" ? "republican" : "democratic";
}

function getControlLeader(scenario: LegislativeScenarioResult): Party | null {
  if (scenario.controlTotals.democratic >= scenario.majorityThreshold) {
    return "democratic";
  }

  if (scenario.controlTotals.republican >= scenario.majorityThreshold) {
    return "republican";
  }

  return null;
}

function getPathParty(scenario: LegislativeScenarioResult): Party {
  if (scenario.controlTotals.democratic === scenario.controlTotals.republican) {
    return "democratic";
  }

  return scenario.controlTotals.democratic > scenario.controlTotals.republican
    ? "republican"
    : "democratic";
}

function getPathSeats(scenario: LegislativeScenarioResult) {
  const party = getPathParty(scenario);
  const seatsNeeded = Math.max(
    0,
    scenario.majorityThreshold - scenario.controlTotals[party],
  );
  const candidateSeats = scenario.seats
    .filter(
      (result) =>
        result.seat.chamber === "house" || result.seat.upNextCycle,
    )
    .filter((result) => result.simulatedControlParty !== party)
    .sort((left, right) => left.marginToFlip - right.marginToFlip)
    .slice(0, Math.max(5, seatsNeeded));

  return {
    party,
    seatsNeeded,
    seats: candidateSeats,
  };
}

function getStrongestAssumptionDriver(
  result: LegislativeSeatResult,
): LegislativeAssumptionDriver | null {
  return [...result.assumptionDrivers]
    .filter((driver) => Math.abs(driver.delta) >= 0.05)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))[0] ?? null;
}

function formatDriverLabel(driver: LegislativeAssumptionDriver) {
  if (driver.id === "nationalSwing") {
    return "National swing";
  }

  if (driver.id.startsWith("state")) {
    return "State override";
  }

  if (driver.id.startsWith("local")) {
    return "Local seat override";
  }

  return driver.label
    .replace("Generic ", "")
    .replace(" district shift", "")
    .replace("Generic ", "");
}

function formatDistrictCount(count: number) {
  return `${count} ${count === 1 ? "district" : "districts"}`;
}

function formatSeatCount(count: number) {
  return `${count} ${count === 1 ? "seat" : "seats"}`;
}

function getMajorityImportanceRows(
  scenario: LegislativeScenarioResult,
): SensitivityListItem[] {
  const leader = getControlLeader(scenario);
  const activeSeats = scenario.seats.filter(
    (result) => result.seat.chamber === "house" || result.seat.upNextCycle,
  );

  if (!leader) {
    return [...activeSeats]
      .sort((left, right) => left.marginToFlip - right.marginToFlip)
      .slice(0, 8)
      .map((result) => ({
        id: result.seat.id,
        label: getSeatName(result),
        subLabel: result.seat.stateName,
        detail: "Control pivot",
      }));
  }

  const challenger = getOppositeParty(leader);
  const leaderBuffer = activeSeats
    .filter((result) => result.simulatedControlParty === leader)
    .sort((left, right) => left.marginToFlip - right.marginToFlip)
    .slice(0, 5)
    .map((result) => ({
      id: `${result.seat.id}-buffer`,
      label: getSeatName(result),
      subLabel: result.seat.stateName,
      detail: `${formatPartyShort(leader)} buffer`,
      result,
    }));
  const challengerTargets = activeSeats
    .filter((result) => result.simulatedControlParty === challenger)
    .sort((left, right) => left.marginToFlip - right.marginToFlip)
    .slice(0, 3)
    .map((result) => ({
      id: `${result.seat.id}-target`,
      label: getSeatName(result),
      subLabel: result.seat.stateName,
      detail: `${formatPartyShort(leader)} target`,
      result,
    }));

  return [...leaderBuffer, ...challengerTargets]
    .sort((left, right) => left.result.marginToFlip - right.result.marginToFlip)
    .slice(0, 6)
    .map(({ id, label, subLabel, detail }) => ({ id, label, subLabel, detail }));
}

function getBiggestAssumptionRows(
  scenario: LegislativeScenarioResult,
): SensitivityListItem[] {
  return scenario.seats
    .filter(
      (result) => result.seat.chamber === "house" || result.seat.upNextCycle,
    )
    .map((result) => ({
      result,
      driver: getStrongestAssumptionDriver(result),
    }))
    .filter(
      (row): row is {
        result: LegislativeSeatResult;
        driver: LegislativeAssumptionDriver;
      } => row.driver !== null,
    )
    .sort(
      (left, right) =>
        Math.abs(right.driver.delta) - Math.abs(left.driver.delta),
    )
    .slice(0, 6)
    .map(({ driver, result }) => ({
      id: `${result.seat.id}-${driver.id}`,
      label: getSeatName(result),
      subLabel: result.seat.stateName,
      detail: `${formatDriverLabel(driver)} ${formatSignedPoints(driver.delta)}`,
    }));
}

function getStateDelegationRows(
  scenario: LegislativeScenarioResult,
): StateDelegationRow[] {
  const stateRows = new Map<
    string,
    Omit<StateDelegationRow, "averageAbsAdjustment" | "volatilityScore"> & {
      totalAbsAdjustment: number;
    }
  >();

  scenario.seats.forEach((result) => {
    const currentRow = stateRows.get(result.seat.stateCode) ?? {
      stateCode: result.seat.stateCode,
      stateName: result.seat.stateName,
      totalSeats: 0,
      democraticDelta: 0,
      republicanDelta: 0,
      flippedSeats: 0,
      closeSeats: 0,
      totalAbsAdjustment: 0,
    };

    currentRow.totalSeats += 1;
    currentRow.totalAbsAdjustment += Math.abs(result.totalAdjustment);

    if (result.marginToFlip <= closeSeatThreshold) {
      currentRow.closeSeats += 1;
    }

    if (result.flipped) {
      currentRow.flippedSeats += 1;
    }

    if (result.seat.baselineControlParty !== result.simulatedControlParty) {
      currentRow[result.simulatedControlParty === "democratic"
        ? "democraticDelta"
        : "republicanDelta"] += 1;
      currentRow[result.seat.baselineControlParty === "democratic"
        ? "democraticDelta"
        : "republicanDelta"] -= 1;
    }

    stateRows.set(result.seat.stateCode, currentRow);
  });

  return [...stateRows.values()].map((row) => {
    const averageAbsAdjustment = row.totalSeats === 0
      ? 0
      : row.totalAbsAdjustment / row.totalSeats;

    return {
      stateCode: row.stateCode,
      stateName: row.stateName,
      totalSeats: row.totalSeats,
      democraticDelta: row.democraticDelta,
      republicanDelta: row.republicanDelta,
      flippedSeats: row.flippedSeats,
      closeSeats: row.closeSeats,
      averageAbsAdjustment,
      volatilityScore:
        row.flippedSeats * 5 +
        row.closeSeats * 2 +
        Math.abs(row.democraticDelta) * 3 +
        averageAbsAdjustment,
    };
  });
}

function getStateGainLossRows(
  scenario: LegislativeScenarioResult,
): SensitivityListItem[] {
  return getStateDelegationRows(scenario)
    .filter(
      (row) => row.democraticDelta !== 0 || row.republicanDelta !== 0,
    )
    .sort(
      (left, right) =>
        Math.abs(right.democraticDelta) +
          Math.abs(right.republicanDelta) -
        (Math.abs(left.democraticDelta) + Math.abs(left.republicanDelta)) ||
        left.stateCode.localeCompare(right.stateCode),
    )
    .slice(0, 8)
    .map((row) => ({
      id: `${row.stateCode}-gain-loss`,
      label: row.stateName,
      subLabel: formatDistrictCount(row.totalSeats),
      detail: `D ${formatSeatDelta(row.democraticDelta)} / R ${formatSeatDelta(row.republicanDelta)}`,
    }));
}

function getVolatileDelegationRows(
  scenario: LegislativeScenarioResult,
): SensitivityListItem[] {
  return getStateDelegationRows(scenario)
    .filter(
      (row) =>
        row.volatilityScore > 0 ||
        row.closeSeats > 0 ||
        row.flippedSeats > 0,
    )
    .sort(
      (left, right) =>
        right.volatilityScore - left.volatilityScore ||
        right.closeSeats - left.closeSeats ||
        left.stateCode.localeCompare(right.stateCode),
    )
    .slice(0, 8)
    .map((row) => ({
      id: `${row.stateCode}-volatility`,
      label: row.stateName,
      subLabel: formatDistrictCount(row.totalSeats),
      detail: `${row.flippedSeats} flip / ${row.closeSeats} close`,
    }));
}

function getSenateCycleRows(
  scenario: LegislativeScenarioResult,
  upNextCycle: boolean,
): LegislativeSeatResult[] {
  return scenario.seats
    .filter(
      (result) => "upNextCycle" in result.seat && result.seat.upNextCycle === upNextCycle,
    )
    .sort((left, right) => left.marginToFlip - right.marginToFlip)
    .slice(0, upNextCycle ? 8 : 5);
}

function getSenateStatePressureRows(
  scenario: LegislativeScenarioResult,
): SensitivityListItem[] {
  const stateRows = new Map<
    string,
    {
      closeSeats: number;
      flippedSeats: number;
      stateCode: string;
      stateName: string;
      totalSeats: number;
    }
  >();

  scenario.seats.forEach((result) => {
    const currentRow = stateRows.get(result.seat.stateCode) ?? {
      closeSeats: 0,
      flippedSeats: 0,
      stateCode: result.seat.stateCode,
      stateName: result.seat.stateName,
      totalSeats: 0,
    };

    currentRow.totalSeats += 1;

    if (result.marginToFlip <= closeSeatThreshold) {
      currentRow.closeSeats += 1;
    }

    if (result.flipped) {
      currentRow.flippedSeats += 1;
    }

    stateRows.set(result.seat.stateCode, currentRow);
  });

  return [...stateRows.values()]
    .filter((row) => row.closeSeats > 0 || row.flippedSeats > 0)
    .sort(
      (left, right) =>
        right.flippedSeats - left.flippedSeats ||
        right.closeSeats - left.closeSeats ||
        left.stateCode.localeCompare(right.stateCode),
    )
    .slice(0, 8)
    .map((row) => ({
      id: `${row.stateCode}-senate-pressure`,
      label: row.stateName,
      subLabel: formatSeatCount(row.totalSeats),
      detail: `${row.flippedSeats} flip / ${row.closeSeats} close`,
    }));
}

function getSenateTippingPointRows(
  scenario: LegislativeScenarioResult,
): SensitivityListItem[] {
  const leader = getControlLeader(scenario);
  const activeSeats = scenario.seats.filter(
    (result) => result.seat.chamber === "senate" && result.seat.upNextCycle,
  );
  const seats = leader
    ? activeSeats.filter((result) => result.simulatedControlParty === leader)
    : activeSeats;

  return [...seats]
    .sort((left, right) => left.marginToFlip - right.marginToFlip)
    .slice(0, 8)
    .map((result) => ({
      id: `${result.seat.id}-senate-tipping`,
      label: getSeatName(result),
      subLabel: result.seat.stateName,
      detail: leader
        ? `${formatPartyShort(leader)} buffer ${result.marginToFlip.toFixed(1)} pts`
        : `Pivot ${result.marginToFlip.toFixed(1)} pts`,
    }));
}

function pickSenateComparisonSeat(results: LegislativeSeatResult[]) {
  return [...results].sort((left, right) => {
    const leftUpNext = "upNextCycle" in left.seat && left.seat.upNextCycle;
    const rightUpNext = "upNextCycle" in right.seat && right.seat.upNextCycle;

    if (leftUpNext !== rightUpNext) {
      return leftUpNext ? -1 : 1;
    }

    return left.marginToFlip - right.marginToFlip;
  })[0];
}

function getSenateDivergenceRows(
  scenario: LegislativeScenarioResult,
  presidentialScenario?: ScenarioResult,
): SensitivityListItem[] {
  if (!presidentialScenario) {
    return [];
  }

  const presidentialWinnerByState = new Map(
    presidentialScenario.states.map((result) => [
      result.state.code,
      result.simulatedWinner,
    ]),
  );
  const senateResultsByState = new Map<string, LegislativeSeatResult[]>();

  scenario.seats.forEach((result) => {
    const stateResults = senateResultsByState.get(result.seat.stateCode) ?? [];
    stateResults.push(result);
    senateResultsByState.set(result.seat.stateCode, stateResults);
  });

  return [...senateResultsByState.values()]
    .map((stateResults) => {
      const senateResult = pickSenateComparisonSeat(stateResults);
      const presidentialWinner = presidentialWinnerByState.get(
        senateResult.seat.stateCode,
      );

      if (!presidentialWinner || presidentialWinner === senateResult.simulatedControlParty) {
        return null;
      }

      return {
        id: `${senateResult.seat.stateCode}-presidential-divergence`,
        label: senateResult.seat.stateName,
        subLabel: `President ${formatPartyShort(presidentialWinner)}`,
        detail: `Senate ${formatPartyShort(senateResult.simulatedControlParty)} / Class ${
          "senateClass" in senateResult.seat ? senateResult.seat.senateClass : "-"
        }`,
      };
    })
    .filter((row): row is SensitivityListItem => row !== null)
    .sort((left, right) => left.label.localeCompare(right.label))
    .slice(0, 8);
}

function getSenateTieBreakRows(
  scenario: LegislativeScenarioResult,
): SensitivityListItem[] {
  const democraticSeats = scenario.controlTotals.democratic;
  const republicanSeats = scenario.controlTotals.republican;
  const outrightControl =
    democraticSeats >= scenario.majorityThreshold
      ? "Democratic control"
      : republicanSeats >= scenario.majorityThreshold
        ? "Republican control"
        : "No outright control";

  return [
    {
      id: "senate-outright-control",
      label: "Outright control",
      subLabel: `${scenario.majorityThreshold}-seat threshold`,
      detail: outrightControl,
    },
    {
      id: "senate-democratic-vp",
      label: "D vice-president",
      subLabel: "50 seats can organize",
      detail:
        democraticSeats >= 50
          ? "Democratic control"
          : `${50 - democraticSeats} short`,
    },
    {
      id: "senate-republican-vp",
      label: "R vice-president",
      subLabel: "50 seats can organize",
      detail:
        republicanSeats >= 50
          ? "Republican control"
          : `${50 - republicanSeats} short`,
    },
  ];
}

function RankedSeatList({
  emptyText,
  items,
  renderDetail,
}: {
  emptyText: string;
  items: LegislativeSeatResult[];
  renderDetail: (result: LegislativeSeatResult) => string;
}) {
  if (items.length === 0) {
    return <p className={styles.emptyState}>{emptyText}</p>;
  }

  return (
    <ol className={styles.sensitivityList}>
      {items.map((result) => (
        <li key={result.seat.id}>
          <span>
            <b>{getSeatName(result)}</b>
            <small>{result.seat.stateName}</small>
          </span>
          <strong>{renderDetail(result)}</strong>
        </li>
      ))}
    </ol>
  );
}

function RankedTextList({
  emptyText,
  items,
}: {
  emptyText: string;
  items: SensitivityListItem[];
}) {
  if (items.length === 0) {
    return <p className={styles.emptyState}>{emptyText}</p>;
  }

  return (
    <ol className={styles.sensitivityList}>
      {items.map((item) => (
        <li key={item.id}>
          <span>
            <b>{item.label}</b>
            <small>{item.subLabel}</small>
          </span>
          <strong>{item.detail}</strong>
        </li>
      ))}
    </ol>
  );
}

export function LegislativeSummary({
  presidentialScenario,
  scenario,
}: LegislativeSummaryProps) {
  const chamberLabel = getChamberLabel(scenario);
  const demShift =
    scenario.controlTotals.democratic - scenario.baselineControlTotals.democratic;
  const repShift =
    scenario.controlTotals.republican - scenario.baselineControlTotals.republican;
  const closestSeats = [...scenario.seats]
    .filter(
      (result) =>
        result.seat.chamber === "house" || result.seat.upNextCycle,
    )
    .sort((left, right) => left.marginToFlip - right.marginToFlip)
    .slice(0, 6);
  const lowDataSeats = scenario.lowDataSeats.slice(0, 8);
  const path = getPathSeats(scenario);
  const flippedSeats = scenario.flippedSeats.slice(0, 6);
  const majorityImportanceRows = getMajorityImportanceRows(scenario);
  const biggestAssumptionRows = getBiggestAssumptionRows(scenario);
  const stateGainLossRows = scenario.chamber === "house"
    ? getStateGainLossRows(scenario)
    : [];
  const volatileDelegationRows = scenario.chamber === "house"
    ? getVolatileDelegationRows(scenario)
    : [];
  const senateUpCycleSeats = scenario.chamber === "senate"
    ? getSenateCycleRows(scenario, true)
    : [];
  const senateStatePressureRows = scenario.chamber === "senate"
    ? getSenateStatePressureRows(scenario)
    : [];
  const senateTippingPointRows = scenario.chamber === "senate"
    ? getSenateTippingPointRows(scenario)
    : [];
  const senateDivergenceRows = scenario.chamber === "senate"
    ? getSenateDivergenceRows(scenario, presidentialScenario)
    : [];
  const senateTieBreakRows = scenario.chamber === "senate"
    ? getSenateTieBreakRows(scenario)
    : [];
  const closestLabel = scenario.chamber === "house"
    ? "Closest districts"
    : "Closest Senate seats";
  const pathLabel = scenario.chamber === "house"
    ? `Path to ${scenario.majorityThreshold}`
    : `Path to ${scenario.majorityThreshold}`;

  return (
    <section className={styles.panel} aria-label={`${chamberLabel} summary`}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>{chamberLabel} summary</p>
          <h2>Sensitivity view</h2>
        </div>
        <span className={styles.summaryPill}>
          {formatSwing(scenario.assumptions.nationalSwing)}
        </span>
      </div>

      <div className={styles.summaryMetrics}>
        <div className={styles.evShift}>
          <span>Seat change from baseline</span>
          <div className={styles.evDeltaStack}>
            <strong>D {formatSeatDelta(demShift)}</strong>
            <small>R {formatSeatDelta(repShift)}</small>
          </div>
        </div>
        <div className={styles.evShift}>
          <span>Flipped seats</span>
          <strong>{scenario.flippedSeats.length}</strong>
        </div>
      </div>

      <div className={styles.sensitivityGrid}>
        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>{closestLabel}</span>
            <strong>Margin</strong>
          </div>
          <RankedSeatList
            emptyText="No seat margins available."
            items={closestSeats}
            renderDetail={(result) => formatMargin(result.simulatedMargin)}
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Flip first</span>
            <strong>Current</strong>
          </div>
          <RankedSeatList
            emptyText="No seats flip in this scenario."
            items={flippedSeats}
            renderDetail={(result) =>
              `${formatPartyShort(result.seat.baselineControlParty)} to ${formatPartyShort(result.simulatedControlParty)}`
            }
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>{pathLabel}</span>
            <strong>
              {path.seatsNeeded === 0
                ? `${formatParty(path.party)} at control`
                : `${formatPartyShort(path.party)} needs ${path.seatsNeeded}`}
            </strong>
          </div>
          <RankedSeatList
            emptyText={`${formatParty(path.party)} already controls the chamber.`}
            items={path.seats}
            renderDetail={(result) => `${result.marginToFlip.toFixed(1)} pts`}
          />
        </div>

        <div className={styles.sensitivityBlock}>
          <div className={styles.sensitivityBlockHeader}>
            <span>Biggest assumption effect</span>
            <strong>Driver</strong>
          </div>
          <RankedTextList
            emptyText="No nonzero assumption effects in this scenario."
            items={biggestAssumptionRows}
          />
        </div>
      </div>

      <details className={styles.summaryDeepDive}>
        <summary>Deep dive: state patterns, control context, and data flags</summary>
        <div className={styles.sensitivityDeepDiveGrid}>
          {scenario.chamber === "house" ? (
            <>
              <div className={styles.sensitivityBlock}>
                <div className={styles.sensitivityBlockHeader}>
                  <span>Majority importance</span>
                  <strong>Ranked</strong>
                </div>
                <RankedTextList
                  emptyText="No majority-importance districts available."
                  items={majorityImportanceRows}
                />
              </div>
              <div className={styles.sensitivityBlock}>
                <div className={styles.sensitivityBlockHeader}>
                  <span>Seat gain/loss by state</span>
                  <strong>Net</strong>
                </div>
                <RankedTextList
                  emptyText="No state-level seat gains or losses in this scenario."
                  items={stateGainLossRows}
                />
              </div>
              <div className={styles.sensitivityBlock}>
                <div className={styles.sensitivityBlockHeader}>
                  <span>Delegation volatility</span>
                  <strong>Flags</strong>
                </div>
                <RankedTextList
                  emptyText="No volatile state delegations in this scenario."
                  items={volatileDelegationRows}
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles.sensitivityBlock}>
                <div className={styles.sensitivityBlockHeader}>
                  <span>Seats up this cycle</span>
                  <strong>Active</strong>
                </div>
                <RankedSeatList
                  emptyText="No Senate seats are marked up this cycle."
                  items={senateUpCycleSeats}
                  renderDetail={(result) => formatMargin(result.simulatedMargin)}
                />
              </div>
              <div className={styles.sensitivityBlock}>
                <div className={styles.sensitivityBlockHeader}>
                  <span>Tipping-point seats</span>
                  <strong>Control</strong>
                </div>
                <RankedTextList
                  emptyText="No Senate tipping-point seats available."
                  items={senateTippingPointRows}
                />
              </div>
              <div className={styles.sensitivityBlock}>
                <div className={styles.sensitivityBlockHeader}>
                  <span>President/Senate divergence</span>
                  <strong>State</strong>
                </div>
                <RankedTextList
                  emptyText="No simulated presidential and Senate divergences."
                  items={senateDivergenceRows}
                />
              </div>
              <div className={styles.sensitivityBlock}>
                <div className={styles.sensitivityBlockHeader}>
                  <span>VP tie-break context</span>
                  <strong>Control</strong>
                </div>
                <RankedTextList
                  emptyText="No Senate control context available."
                  items={senateTieBreakRows}
                />
              </div>
              <div className={styles.sensitivityBlock}>
                <div className={styles.sensitivityBlockHeader}>
                  <span>State pressure</span>
                  <strong>Flags</strong>
                </div>
                <RankedTextList
                  emptyText="No close or flipped Senate states in this scenario."
                  items={senateStatePressureRows}
                />
              </div>
            </>
          )}
          <div className={styles.sensitivityBlock}>
            <div className={styles.sensitivityBlockHeader}>
              <span>Data flags</span>
              <strong>{scenario.lowDataSeats.length}</strong>
            </div>
            <RankedSeatList
              emptyText="No low-data seats flagged."
              items={lowDataSeats}
              renderDetail={(result) => formatMargin(result.simulatedMargin)}
            />
          </div>
        </div>
      </details>
    </section>
  );
}
