import {
  formatLegislativeParty,
  formatMargin,
  formatParty,
  formatSignedPoints,
} from "@/lib/format";
import {
  SeatOverrideControls,
  StateOverrideControls,
} from "@/components/LocalOverrideControls";
import { hasSeatOverride, hasStateOverride } from "@/lib/localOverrides";
import {
  PoliticianPortrait,
  PoliticianPortraitGroup,
} from "@/components/PoliticianPortrait";
import { getBioguidePortrait } from "@/data/politicianPortraits";
import type {
  LegislativeCandidate,
  LegislativeSeatResult,
  SeatOverride,
  StateOverride,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

type LegislativeDetailPanelProps = {
  result: LegislativeSeatResult;
  stateOverride?: StateOverride;
  seatOverride?: SeatOverride;
  onStateOverrideChange: (value: StateOverride) => void;
  onStateOverrideReset: () => void;
  onSeatOverrideChange: (value: SeatOverride) => void;
  onSeatOverrideReset: () => void;
};

function getSeatKicker(result: LegislativeSeatResult) {
  return result.seat.chamber === "house"
    ? "Selected district"
    : "Selected Senate race";
}

function getSeatHeading(result: LegislativeSeatResult) {
  return result.seat.chamber === "house"
    ? result.seat.districtLabel
    : `${result.seat.stateName} Class ${result.seat.senateClass}`;
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

function getDistrictNumberLabel(result: LegislativeSeatResult) {
  if (!("district" in result.seat)) {
    return `Class ${result.seat.senateClass}`;
  }

  return result.seat.district === 0
    ? "At-large"
    : String(result.seat.district);
}

function getTenureLabel(result: LegislativeSeatResult) {
  const incumbent = result.seat.incumbent;

  if (!incumbent) {
    return {
      label: "Open",
      note: "No current incumbent in roster snapshot",
    };
  }

  return {
    label: `${incumbent.firstYear}`,
    note: `${incumbent.tenureYears.toFixed(1)} years served`,
  };
}

function formatProfileDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getServiceStartLabel(result: LegislativeSeatResult) {
  const incumbent = result.seat.incumbent;

  if (!incumbent) {
    return {
      label: "No incumbent",
      note: "No service profile in roster snapshot",
    };
  }

  return {
    label: formatProfileDate(incumbent.firstChamberServiceDate),
    note: "First chamber service date in roster source",
  };
}

function getCurrentTermLabel(result: LegislativeSeatResult) {
  const incumbent = result.seat.incumbent;

  if (!incumbent) {
    return {
      label: "No current term",
      note: "Seat is vacant in roster snapshot",
    };
  }

  return {
    label: `${formatProfileDate(incumbent.currentTermStart)} - ${formatProfileDate(
      incumbent.currentTermEnd,
    )}`,
    note: "Current term dates from roster source",
  };
}

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

function getIncumbentRunningStatus(result: LegislativeSeatResult) {
  const incumbent = result.seat.incumbent;

  if (!incumbent) {
    return {
      label: "No incumbent",
      note: "Seat is vacant in roster snapshot",
    };
  }

  const appearsInLatestResult = result.seat.candidates.some(
    (candidate) => normalizeName(candidate.name) === normalizeName(incumbent.name),
  );

  return {
    label: appearsInLatestResult ? "Latest ballot: yes" : "Not sourced",
    note: "Future filing or retirement status is not in the current dataset",
  };
}

function getMajorPartyCandidate(
  candidates: readonly LegislativeCandidate[],
  party: "democratic" | "republican",
) {
  return candidates.find((candidate) => candidate.party === party);
}

function getMajorPartyCandidateLabel(result: LegislativeSeatResult) {
  const democraticCandidate = getMajorPartyCandidate(
    result.seat.candidates,
    "democratic",
  );
  const republicanCandidate = getMajorPartyCandidate(
    result.seat.candidates,
    "republican",
  );
  const democraticLabel = democraticCandidate?.name ?? "No Democratic candidate";
  const republicanLabel = republicanCandidate?.name ?? "No Republican candidate";

  return `D: ${democraticLabel} / R: ${republicanLabel}`;
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

function getFlipDetail(result: LegislativeSeatResult) {
  if (result.flipped) {
    return `Flipped from ${formatParty(result.seat.baselineControlParty)} baseline`;
  }

  return "Held by baseline control party";
}

function getAssumptionDrivers(result: LegislativeSeatResult) {
  const activeDrivers = result.assumptionDrivers
    .filter((driver) => Math.abs(driver.delta) >= 0.05)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta));

  if (activeDrivers.length > 0) {
    return activeDrivers.slice(0, 5);
  }

  return result.assumptionDrivers
    .filter((driver) => driver.id === "nationalSwing")
    .slice(0, 1);
}

function getDriverNote(
  driver: LegislativeSeatResult["assumptionDrivers"][number],
  result: LegislativeSeatResult,
) {
  if (driver.id === "nationalSwing") {
    return `Uniform adjustment to this ${
      result.seat.chamber === "house" ? "district" : "Senate race"
    } baseline`;
  }

  if (driver.id.startsWith("state")) {
    return "Shared state override applied across President, House, and Senate";
  }

  if (driver.id.startsWith("local")) {
    return "Selected district or race override";
  }

  return `Heuristic ${
    result.seat.chamber === "house" ? "district" : "state"
  } weight ${driver.weight.toFixed(2)}`;
}

function getSeatCodeLabel(result: LegislativeSeatResult) {
  return result.seat.chamber === "house" ? "District code" : "Seat code";
}

function getSeatNumberLabel(result: LegislativeSeatResult) {
  return result.seat.chamber === "house" ? "District number" : "Senate class";
}

function getSeatNumberNote(result: LegislativeSeatResult) {
  if (result.seat.chamber === "house") {
    return "House district";
  }

  return `${result.seat.upNextCycle ? "Up this cycle" : "Not up this cycle"}${
    result.seat.specialElection ? " / special election" : ""
  }`;
}

function getRaceYearLabel(result: LegislativeSeatResult) {
  return result.seat.chamber === "house" ? "Latest result" : "Latest race year";
}

function getCandidateSourceNote(result: LegislativeSeatResult) {
  return `Latest completed ${
    result.seat.chamber === "house" ? "House" : "Senate"
  } result where candidate rows are available`;
}

function getBaselineLabel(result: LegislativeSeatResult) {
  return result.seat.chamber === "house"
    ? "District partisan baseline"
    : "State partisan baseline";
}

function getBaselineNote(result: LegislativeSeatResult) {
  return result.seat.chamber === "house"
    ? "Model baseline from latest House district D-R margin; presidential/PVI baseline is not yet ingested"
    : "Model baseline from latest Senate statewide D-R margin for this class; presidential/PVI baseline is not yet ingested";
}

export function LegislativeDetailPanel({
  onSeatOverrideChange,
  onSeatOverrideReset,
  onStateOverrideChange,
  onStateOverrideReset,
  result,
  seatOverride,
  stateOverride,
}: LegislativeDetailPanelProps) {
  const seat = result.seat;
  const tenure = getTenureLabel(result);
  const serviceStart = getServiceStartLabel(result);
  const currentTerm = getCurrentTermLabel(result);
  const incumbentRunningStatus = getIncumbentRunningStatus(result);
  const assumptionDrivers = getAssumptionDrivers(result);
  const hasCustomState = hasStateOverride(stateOverride);
  const hasCustomSeat = hasSeatOverride(seatOverride);
  const incumbentPortrait = seat.incumbent
    ? getBioguidePortrait(seat.incumbent.bioguideId)
    : null;
  const incumbentParty =
    seat.incumbent?.caucusParty ??
    (seat.incumbent?.party === "democratic" ||
    seat.incumbent?.party === "republican"
      ? seat.incumbent.party
      : null);

  return (
    <section className={styles.panel} aria-label="Selected legislative seat details">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>{getSeatKicker(result)}</p>
          <h2>{getSeatHeading(result)}</h2>
        </div>
        <div className={styles.panelActions}>
          {hasCustomState ? (
            <span className={styles.customOverrideBadge}>Custom state</span>
          ) : null}
          {hasCustomSeat ? (
            <span className={styles.customOverrideBadge}>
              Custom {seat.chamber === "house" ? "district" : "race"}
            </span>
          ) : null}
          <span
            className={
              result.flipped || seat.lowData ? styles.flipBadge : styles.steadyBadge
            }
          >
            {getFlipLabel(result)}
          </span>
        </div>
      </div>

      <PoliticianPortraitGroup label="Current member portrait">
        <PoliticianPortrait
          imageUrl={incumbentPortrait?.imageUrl}
          name={seat.incumbent?.name ?? "Vacant seat"}
          party={incumbentParty}
          role={
            seat.incumbent
              ? `${getPartyDetail(result)} / current ${
                  seat.chamber === "house" ? "representative" : "senator"
                }`
              : "No current incumbent in roster snapshot"
          }
          sourceLabel={incumbentPortrait?.sourceLabel}
          sourceUrl={incumbentPortrait?.sourceUrl}
        />
      </PoliticianPortraitGroup>

      <div className={styles.detailGrid}>
        <div>
          <span>Baseline</span>
          <strong>{formatMargin(seat.baselineMargin)}</strong>
          <small>{formatLegislativeParty(seat.baselineWinner)}</small>
        </div>
        <div>
          <span>Simulated</span>
          <strong>{formatLegislativeParty(result.simulatedWinner)}</strong>
          <small>{formatMargin(result.simulatedMargin)}</small>
        </div>
        <div>
          <span>Flip status</span>
          <strong>{result.flipped ? "Flipped" : "Held"}</strong>
          <small>{getFlipDetail(result)}</small>
        </div>
        <div>
          <span>{getRaceYearLabel(result)}</span>
          <strong>{seat.latestElectionYear}</strong>
          <small>{seat.specialElection ? "Special election" : "Regular general election"}</small>
        </div>
      </div>

      {seat.lowData || seat.missingVoteTotal ? (
        <div className={styles.dataCompletenessNote} role="note">
          <strong>Limited race data</strong>
          <span>
            {seat.missingVoteTotal
              ? "The source does not provide a complete vote total for this race. "
              : ""}
            This baseline is flagged as low confidence; treat local changes as a stress test.
          </span>
        </div>
      ) : null}

      {seat.chamber === "senate" && !seat.upNextCycle ? (
        <div className={styles.dataCompletenessNote} role="note">
          <strong>Held seat</strong>
          <span>This seat is not up in the modeled cycle, so scenario assumptions do not change it.</span>
        </div>
      ) : null}

      <div className={styles.flipDistance}>
        <span>Distance from flipping</span>
        <strong>{result.marginToFlip.toFixed(1)} pts</strong>
      </div>

      <StateOverrideControls
        stateName={seat.stateName}
        value={stateOverride}
        onChange={onStateOverrideChange}
        onReset={onStateOverrideReset}
      />

      {seat.chamber === "house" || seat.upNextCycle ? (
        <SeatOverrideControls
          kind={seat.chamber === "house" ? "district" : "race"}
          label={seat.districtLabel}
          value={seatOverride}
          onChange={onSeatOverrideChange}
          onReset={onSeatOverrideReset}
        />
      ) : null}

      <div className={styles.assumptionDrivers}>
        <div className={styles.assumptionDriversHeader}>
          <span>Applied assumption</span>
          <strong>{formatSignedPoints(result.totalAdjustment)}</strong>
        </div>
        <ol className={styles.driverList}>
          {assumptionDrivers.map((driver) => (
            <li key={driver.label}>
              <span>
                <b>{driver.label}</b>
                <small>{getDriverNote(driver, result)}</small>
              </span>
              <strong>{formatSignedPoints(driver.delta)}</strong>
            </li>
          ))}
        </ol>
      </div>

      <details className={styles.detailDisclosure}>
        <summary>Member profile and seat context</summary>
        <div className={styles.detailDisclosureBody}>
          <div className={styles.detailGrid}>
            <div>
              <span>{getSeatCodeLabel(result)}</span>
              <strong>{seat.districtLabel}</strong>
              <small>{seat.id}</small>
            </div>
            <div>
              <span>State</span>
              <strong>{seat.stateCode}</strong>
              <small>{seat.stateName}</small>
            </div>
            <div>
              <span>{getSeatNumberLabel(result)}</span>
              <strong>{getDistrictNumberLabel(result)}</strong>
              <small>{getSeatNumberNote(result)}</small>
            </div>
            <div>
              <span>Current member</span>
              <strong>{getIncumbentLabel(result)}</strong>
              <small>{seat.incumbent?.bioguideId ?? "No Bioguide ID"}</small>
            </div>
            <div>
              <span>Incumbent party</span>
              <strong>{getPartyDetail(result)}</strong>
            </div>
            <div>
              <span>First served / tenure</span>
              <strong>{tenure.label}</strong>
              <small>{tenure.note}</small>
            </div>
            <div>
              <span>Service start</span>
              <strong>{serviceStart.label}</strong>
              <small>{serviceStart.note}</small>
            </div>
            <div>
              <span>Current term</span>
              <strong>{currentTerm.label}</strong>
              <small>{currentTerm.note}</small>
            </div>
            <div>
              <span>Incumbent running</span>
              <strong>{incumbentRunningStatus.label}</strong>
              <small>{incumbentRunningStatus.note}</small>
            </div>
          </div>
        </div>
      </details>

      <details className={styles.detailDisclosure}>
        <summary>Vote history, candidates, and source</summary>
        <div className={styles.detailDisclosureBody}>
          <div className={styles.voteDetail}>
            <span>Recorded votes</span>
            <strong>
              D {seat.democraticVotes.toLocaleString()} / R{" "}
              {seat.republicanVotes.toLocaleString()}
            </strong>
            <small>
              {seat.otherVotes.toLocaleString()} other /{" "}
              {seat.totalVotes.toLocaleString()} total
              {seat.uncontested ? " / uncontested or same-party race flagged" : ""}
            </small>
          </div>
          <div className={styles.voteDetail}>
            <span>Major-party candidates</span>
            <strong>{getMajorPartyCandidateLabel(result)}</strong>
            <small>{getCandidateSourceNote(result)}</small>
          </div>
          <div className={styles.voteDetail}>
            <span>{getBaselineLabel(result)}</span>
            <strong>
              {formatParty(seat.baselineControlParty)} / {formatMargin(seat.baselineMargin)}
            </strong>
            <small>{getBaselineNote(result)}</small>
          </div>
          <div className={styles.splitEvDetail}>
            <div className={styles.assumptionDriversHeader}>
              <span>Latest vote totals</span>
              <strong>{seat.candidates.length}</strong>
            </div>
            <ol className={styles.splitEvList}>
              {seat.candidates.map((candidate) => (
                <li key={`${candidate.name}-${candidate.partyLabel}`}>
                  <span>
                    <b>{candidate.name}</b>
                    <small>{candidate.partyLabel} / {candidate.voteShare.toFixed(1)}%</small>
                  </span>
                  <strong>{candidate.votes.toLocaleString()}</strong>
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.voteDetail}>
            <span>Data source / freshness</span>
            <strong>{seat.sourceId}</strong>
            <small>{seat.latestElectionYear} result vintage / {seat.sourceNote}</small>
          </div>
        </div>
      </details>
    </section>
  );
}
