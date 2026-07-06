import {
  formatLegislativeParty,
  formatMargin,
  formatParty,
  formatSignedPoints,
} from "@/lib/format";
import type { LegislativeSeatResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeDetailPanelProps = {
  result: LegislativeSeatResult;
};

function getSeatKicker(result: LegislativeSeatResult) {
  return result.seat.chamber === "house" ? "Selected district" : "Selected seat";
}

function getSeatHeading(result: LegislativeSeatResult) {
  return result.seat.chamber === "house"
    ? result.seat.districtLabel
    : `${result.seat.stateName} Senate`;
}

function getIncumbentLabel(result: LegislativeSeatResult) {
  if (!result.seat.incumbent) {
    return "Vacant";
  }

  return result.seat.incumbent.name;
}

function getPartyDetail(result: LegislativeSeatResult) {
  const incumbent = result.seat.incumbent;

  if (!incumbent) {
    return "No current incumbent in roster snapshot";
  }

  if (incumbent.caucusParty) {
    return `${incumbent.partyLabel}, caucuses with ${formatParty(incumbent.caucusParty)}`;
  }

  return incumbent.partyLabel;
}

function getFlipLabel(result: LegislativeSeatResult) {
  if (result.flipped) {
    return `Flips to ${formatParty(result.simulatedControlParty)}`;
  }

  if (result.seat.lowData) {
    return "Low-data hold";
  }

  return "No flip";
}

export function LegislativeDetailPanel({ result }: LegislativeDetailPanelProps) {
  const seat = result.seat;

  return (
    <section className={styles.panel} aria-label="Selected legislative seat details">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>{getSeatKicker(result)}</p>
          <h2>{getSeatHeading(result)}</h2>
        </div>
        <span
          className={
            result.flipped || seat.lowData ? styles.flipBadge : styles.steadyBadge
          }
        >
          {getFlipLabel(result)}
        </span>
      </div>

      <div className={styles.detailGrid}>
        <div>
          <span>Current member</span>
          <strong>{getIncumbentLabel(result)}</strong>
        </div>
        <div>
          <span>Roster party</span>
          <strong>{getPartyDetail(result)}</strong>
        </div>
        <div>
          <span>First served</span>
          <strong>{seat.incumbent?.firstYear ?? "Open"}</strong>
        </div>
        <div>
          <span>Latest result</span>
          <strong>{seat.latestElectionYear}</strong>
        </div>
        <div>
          <span>Baseline winner</span>
          <strong>{formatLegislativeParty(seat.baselineWinner)}</strong>
        </div>
        <div>
          <span>Baseline margin</span>
          <strong>{formatMargin(seat.baselineMargin)}</strong>
        </div>
        <div>
          <span>Simulated control</span>
          <strong>{formatParty(result.simulatedControlParty)}</strong>
        </div>
        <div>
          <span>Simulated margin</span>
          <strong>{formatMargin(result.simulatedMargin)}</strong>
        </div>
      </div>

      <div className={styles.voteDetail}>
        <span>Recorded votes</span>
        <strong>
          D {seat.democraticVotes.toLocaleString()} / R{" "}
          {seat.republicanVotes.toLocaleString()}
        </strong>
        <small>
          {seat.totalVotes.toLocaleString()} total votes
          {seat.uncontested ? " / uncontested or same-party race flagged" : ""}
        </small>
      </div>

      <div className={styles.flipDistance}>
        <span>Distance from flipping</span>
        <strong>{result.marginToFlip.toFixed(1)} pts</strong>
      </div>

      <div className={styles.assumptionDrivers}>
        <div className={styles.assumptionDriversHeader}>
          <span>Applied assumption</span>
          <strong>{formatSignedPoints(result.totalAdjustment)}</strong>
        </div>
        <ol className={styles.driverList}>
          <li>
            <span>
              <b>National chamber swing</b>
              <small>Uniform adjustment to this seat baseline</small>
            </span>
            <strong>{formatSignedPoints(result.totalAdjustment)}</strong>
          </li>
          {Math.abs(result.overrideAdjustment) >= 0.05 ? (
            <li>
              <span>
                <b>Local override</b>
                <small>Seat-specific adjustment</small>
              </span>
              <strong>{formatSignedPoints(result.overrideAdjustment)}</strong>
            </li>
          ) : null}
        </ol>
      </div>

      <div className={styles.splitEvDetail}>
        <div className={styles.assumptionDriversHeader}>
          <span>Top candidates</span>
          <strong>{seat.candidates.length}</strong>
        </div>
        <ol className={styles.splitEvList}>
          {seat.candidates.map((candidate) => (
            <li key={`${candidate.name}-${candidate.partyLabel}`}>
              <span>
                <b>{candidate.name}</b>
                <small>
                  {candidate.partyLabel} / {candidate.voteShare.toFixed(1)}%
                </small>
              </span>
              <strong>{candidate.votes.toLocaleString()}</strong>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.voteDetail}>
        <span>Data source</span>
        <strong>{seat.sourceId}</strong>
        <small>{seat.sourceNote}</small>
      </div>
    </section>
  );
}
