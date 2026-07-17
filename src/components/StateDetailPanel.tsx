import {
  formatMargin,
  formatParty,
  formatPartyShort,
  formatSignedPoints,
} from "@/lib/format";
import { StateOverrideControls } from "@/components/LocalOverrideControls";
import { hasStateOverride } from "@/lib/localOverrides";
import type {
  ScenarioAssumptionDriver,
  StateOverride,
  StateScenarioResult,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type StateDetailPanelProps = {
  result: StateScenarioResult;
  stateOverride?: StateOverride;
  onStateOverrideChange: (value: StateOverride) => void;
  onStateOverrideReset: () => void;
};

function formatDriverDelta(delta: number) {
  if (Math.abs(delta) < 0.05) {
    return "0.0 pts";
  }

  return `${delta > 0 ? "D" : "R"} +${Math.abs(delta).toFixed(1)}`;
}

function formatDriverDetail(driver: ScenarioAssumptionDriver) {
  const direction = driver.delta >= 0 ? "toward Democrats" : "toward Republicans";
  const weight = `${driver.weight > 0 ? "+" : ""}${driver.weight.toFixed(2)}x`;

  return `${direction}, ${weight} state weight`;
}

export function StateDetailPanel({
  onStateOverrideChange,
  onStateOverrideReset,
  result,
  stateOverride,
}: StateDetailPanelProps) {
  const flippedLabel = result.flipped
    ? `Flipped to ${formatParty(result.simulatedWinner)}`
    : "No flip";
  const activeDrivers = result.assumptionDrivers
    .filter((driver) => Math.abs(driver.delta) >= 0.05)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3);
  const hasSplitElectoralVotes = result.splitElectoralVotes.length > 1;
  const isCustom = hasStateOverride(stateOverride);

  return (
    <section className={styles.panel} aria-label="Selected state details">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Selected state</p>
          <h2>{result.state.name}</h2>
        </div>
        <div className={styles.panelActions}>
          {isCustom ? (
            <span className={styles.customOverrideBadge}>Custom state</span>
          ) : null}
          <span className={result.flipped ? styles.flipBadge : styles.steadyBadge}>
            {flippedLabel}
          </span>
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div>
          <span>Baseline year</span>
          <strong>{result.state.baselineYear}</strong>
        </div>
        <div>
          <span>Electoral votes</span>
          <strong>{result.state.electoralVotes}</strong>
        </div>
        <div>
          <span>Baseline winner</span>
          <strong>{formatParty(result.baselineWinner)}</strong>
        </div>
        <div>
          <span>Baseline margin</span>
          <strong>{formatMargin(result.state.baselineMargin)}</strong>
        </div>
        <div>
          <span>Simulated winner</span>
          <strong>{formatParty(result.simulatedWinner)}</strong>
        </div>
        <div>
          <span>Simulated margin</span>
          <strong>{formatMargin(result.simulatedMargin)}</strong>
        </div>
        <div>
          <span>Flip status</span>
          <strong>{result.flipped ? "Flipped" : "Held"}</strong>
        </div>
      </div>

      <div className={styles.voteDetail}>
        <span>Recorded votes</span>
        <strong>
          D {result.state.democraticVotes.toLocaleString()} / R{" "}
          {result.state.republicanVotes.toLocaleString()}
        </strong>
        <small>{result.state.totalVotes.toLocaleString()} total votes</small>
      </div>

      <div className={styles.flipDistance}>
        <span>Distance from flipping</span>
        <strong>{result.marginToFlip.toFixed(1)} pts</strong>
      </div>

      <StateOverrideControls
        stateName={result.state.name}
        value={stateOverride}
        onChange={onStateOverrideChange}
        onReset={onStateOverrideReset}
      />

      {hasSplitElectoralVotes ? (
        <div className={styles.splitEvDetail}>
          <div className={styles.assumptionDriversHeader}>
            <span>Split electoral votes</span>
            <strong>{result.state.electoralVotes} EV</strong>
          </div>
          <ol className={styles.splitEvList}>
            {result.splitElectoralVotes.map((unit) => (
              <li key={unit.id}>
                <span>
                  <b>{unit.label}</b>
                  <small>{formatMargin(unit.simulatedMargin)}</small>
                </span>
                <strong>
                  {formatPartyShort(unit.simulatedWinner)} {unit.electoralVotes}
                </strong>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className={styles.assumptionDrivers}>
        <div className={styles.assumptionDriversHeader}>
          <span>Largest assumption effects</span>
          <strong>{formatSignedPoints(result.totalAdjustment)}</strong>
        </div>

        {activeDrivers.length === 0 ? (
          <p className={styles.driverEmpty}>
            Baseline only until a scenario slider moves.
          </p>
        ) : (
          <ol className={styles.driverList}>
            {activeDrivers.map((driver) => (
              <li key={driver.id}>
                <span>
                  <b>{driver.label}</b>
                  <small>{formatDriverDetail(driver)}</small>
                </span>
                <strong>{formatDriverDelta(driver.delta)}</strong>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
