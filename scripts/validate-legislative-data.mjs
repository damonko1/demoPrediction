import { readFile } from "node:fs/promises";

const generatedDataPath = "src/data/legislativeData.generated.ts";
const validationReportPath = "docs/legislative-data-validation.generated.json";

const requiredSourceFields = [
  "id",
  "sourceName",
  "sourcePublisher",
  "sourceUrl",
  "dataVintage",
  "retrievedAt",
  "trustLevel",
  "cleaningNotes",
  "validationSummary",
];

const requiredSeatFields = [
  "id",
  "chamber",
  "stateCode",
  "stateName",
  "districtLabel",
  "baselineWinner",
  "baselineControlParty",
  "latestElectionYear",
  "democraticVotes",
  "republicanVotes",
  "otherVotes",
  "totalVotes",
  "uncontested",
  "lowData",
  "specialElection",
  "runoff",
  "missingVoteTotal",
  "cancelledElection",
  "writeInVotes",
  "writeInCandidateCount",
  "candidateVoteTotalDifference",
  "candidates",
  "sourceId",
  "sourceNote",
  "overrideKeys",
];

const requiredIncumbentFields = [
  "name",
  "party",
  "partyLabel",
  "firstYear",
  "firstChamberServiceDate",
  "currentTermStart",
  "currentTermEnd",
  "tenureYears",
  "bioguideId",
];

const requiredCandidateFields = [
  "name",
  "party",
  "partyLabel",
  "votes",
  "voteShare",
  "sourceParties",
  "writeIn",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function extractGeneratedJson(text, exportName) {
  const match = text.match(
    new RegExp(`export const ${exportName} = ([\\s\\S]*?) as const(?: satisfies [^;]+)?;`),
  );

  assert(match, `Missing generated export: ${exportName}`);
  return JSON.parse(match[1]);
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function validateRequiredFields(records, fields, context) {
  const missing = [];

  records.forEach((record) => {
    fields.forEach((field) => {
      if (!hasValue(record[field])) {
        missing.push(`${record.id ?? record.name ?? context}.${field}`);
      }
    });
  });

  assert(missing.length === 0, `${context} missing required fields: ${missing.join(", ")}`);
}

function validateSources(report) {
  const sourceMetadata = report.sourceMetadata ?? {};
  const sourceIds = Object.keys(sourceMetadata);

  assert(sourceIds.length >= 3, "Expected source metadata for House results, Senate results, and roster");

  sourceIds.forEach((sourceId) => {
    requiredSourceFields.forEach((field) => {
      assert(
        hasValue(sourceMetadata[sourceId][field]),
        `Source ${sourceId} is missing ${field}`,
      );
    });
  });
}

function validateHouseSeats(houseSeats) {
  assert(houseSeats.length === 435, `Expected 435 House seats, got ${houseSeats.length}`);
  validateRequiredFields(houseSeats, requiredSeatFields, "House seats");

  const invalidIds = houseSeats
    .filter((seat) => !/^[A-Z]{2}-(?:AL|\d{2})$/.test(seat.id))
    .map((seat) => seat.id);

  assert(invalidIds.length === 0, `Invalid House district IDs: ${invalidIds.join(", ")}`);

  const duplicateIds = houseSeats
    .map((seat) => seat.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);

  assert(duplicateIds.length === 0, `Duplicate House district IDs: ${duplicateIds.join(", ")}`);
}

function validateSenateSeats(senateSeats) {
  assert(senateSeats.length === 100, `Expected 100 Senate seats, got ${senateSeats.length}`);
  validateRequiredFields(senateSeats, requiredSeatFields, "Senate seats");

  const invalidClasses = senateSeats
    .filter((seat) => ![1, 2, 3].includes(seat.senateClass))
    .map((seat) => seat.id);

  assert(invalidClasses.length === 0, `Invalid Senate classes: ${invalidClasses.join(", ")}`);

  const stateCounts = senateSeats.reduce((counts, seat) => {
    counts[seat.stateCode] = (counts[seat.stateCode] ?? 0) + 1;
    return counts;
  }, {});
  const invalidStateCounts = Object.entries(stateCounts)
    .filter(([, count]) => count !== 2)
    .map(([stateCode, count]) => `${stateCode}:${count}`);

  assert(Object.keys(stateCounts).length === 50, `Expected 50 Senate states, got ${Object.keys(stateCounts).length}`);
  assert(
    invalidStateCounts.length === 0,
    `Expected two Senate seats per state; invalid counts: ${invalidStateCounts.join(", ")}`,
  );

  const controlMismatches = senateSeats
    .filter((seat) => {
      const incumbentControl =
        seat.incumbent?.caucusParty ??
        (seat.incumbent?.party === "democratic" || seat.incumbent?.party === "republican"
          ? seat.incumbent.party
          : null);
      return incumbentControl && incumbentControl !== seat.baselineControlParty;
    })
    .map((seat) => seat.id);
  assert(
    controlMismatches.length === 0,
    `Senate incumbent/control mismatches: ${controlMismatches.join(", ")}`,
  );

  const signedMarginMismatches = senateSeats
    .filter(
      (seat) =>
        Math.abs(seat.baselineMargin) >= 0.05 &&
        ((seat.baselineMargin > 0) !== (seat.baselineControlParty === "democratic")),
    )
    .map((seat) => seat.id);
  assert(
    signedMarginMismatches.length === 0,
    `Senate signed-margin/control mismatches: ${signedMarginMismatches.join(", ")}`,
  );

  const unflaggedPartyCoverageGaps = senateSeats
    .filter(
      (seat) =>
        (seat.democraticVotes === 0 || seat.republicanVotes === 0) && !seat.lowData,
    )
    .map((seat) => seat.id);
  assert(
    unflaggedPartyCoverageGaps.length === 0,
    `Senate incomplete party mapping must be low data: ${unflaggedPartyCoverageGaps.join(", ")}`,
  );

  const activeCycleSeats = senateSeats.filter((seat) => seat.upNextCycle);
  assert(
    activeCycleSeats.length === 33,
    `Expected 33 Class 2 seats up in 2026, got ${activeCycleSeats.length}`,
  );
}

function validateNestedRecords(seats) {
  const incumbents = seats.flatMap((seat) => (seat.incumbent ? [seat.incumbent] : []));
  const candidates = seats.flatMap((seat) => seat.candidates);

  validateRequiredFields(incumbents, requiredIncumbentFields, "Incumbents");
  validateRequiredFields(candidates, requiredCandidateFields, "Candidates");

  const candidatePartyIssues = candidates
    .filter((candidate) => !["democratic", "republican", "independent", "vacant"].includes(candidate.party))
    .map((candidate) => `${candidate.name}:${candidate.party}`);

  assert(candidatePartyIssues.length === 0, `Unexpected candidate parties: ${candidatePartyIssues.join(", ")}`);
}

function validateReport(report) {
  const checks = report.checks ?? {};

  assert(checks.houseVotingDistricts === 435, "Validation report House voting district count must be 435");
  assert(checks.senateSeats === 100, "Validation report Senate seat count must be 100");
  assert(checks.senateStatesRepresented === 50, "Validation report Senate state count must be 50");
  assert(checks.invalidHouseDistrictIds?.length === 0, "Validation report contains invalid House IDs");
  assert(checks.invalidSenateClassSeats?.length === 0, "Validation report contains invalid Senate classes");
  assert(Array.isArray(checks.houseVoteTotalMismatches), "House candidate-vote difference list must be present");
  assert(Array.isArray(checks.senateVoteTotalMismatches), "Senate candidate-vote difference list must be present");
  assert(checks.missingRequiredFields?.length === 0, "Validation report contains missing required fields");
  assert(
    checks.houseSpecialElectionSeatsInBaseline?.length === 0,
    "Regular House baseline should not include special-election seats",
  );
}

async function main() {
  const [generatedText, validationText] = await Promise.all([
    readFile(generatedDataPath, "utf8"),
    readFile(validationReportPath, "utf8"),
  ]);
  const houseSeats = extractGeneratedJson(generatedText, "houseDistrictBaselines");
  const senateSeats = extractGeneratedJson(generatedText, "senateSeatBaselines");
  const report = JSON.parse(validationText);

  validateSources(report);
  validateHouseSeats(houseSeats);
  validateSenateSeats(senateSeats);
  validateNestedRecords([...houseSeats, ...senateSeats]);
  validateReport(report);

  console.log("Legislative data validation passed.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
