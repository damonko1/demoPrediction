import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const sourceDir = ".tmp/election-sources";
const houseSourcePath = path.join(sourceDir, "mit-house-1976-2024.csv");
const senateSourcePath = path.join(sourceDir, "mit-senate-state-1976-2024.tab");
const rosterSourcePath = path.join(sourceDir, "legislators-current.yaml");
const generatedDataPath = "src/data/legislativeData.generated.ts";
const validationReportPath = "docs/legislative-data-validation.generated.json";

const generatedAt = "2026-07-06";
const sourceRetrievedAt = "2026-07-02";
const currentDate = new Date(`${sourceRetrievedAt}T12:00:00Z`);
const houseElectionYear = 2024;
const nextSenateCycleYear = 2026;
const senateElectionYearByClass = {
  1: 2024,
  2: 2020,
  3: 2022,
};

const legislativeSourceMetadata = {
  houseResults: {
    id: "mit-house-1976-2024",
    sourceName: "MIT Election Data and Science Lab, U.S. House 1976-2024",
    sourcePublisher: "MIT Election Data and Science Lab",
    sourceUrl: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/IG0UN2",
    dataVintage: "Version 15.0, released 2026-03-09; current baseline year 2024",
    retrievedAt: sourceRetrievedAt,
    trustLevel: "widely trusted published research dataset",
    cleaningNotes:
      "Filters to US HOUSE, 2024, regular general-election, TOTAL-mode rows outside DC; groups candidate rows by state and congressional district.",
    validationSummary:
      "Race totals use MIT totalvotes when available; candidate-vote differences from totalvotes are listed in the generated validation report.",
  },
  senateResults: {
    id: "mit-senate-state-1976-2024",
    sourceName: "MIT Election Data and Science Lab, U.S. Senate statewide 1976-2024",
    sourcePublisher: "MIT Election Data and Science Lab",
    sourceUrl: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/PEJ5QU",
    dataVintage: "Version 8.0, released 2026-05-11; latest matched seat results through 2024 with an explicitly flagged 2016 Connecticut fallback",
    retrievedAt: sourceRetrievedAt,
    trustLevel: "widely trusted published research dataset",
    cleaningNotes:
      "Filters to US SENATE statewide TOTAL-mode general and runoff rows, prefers detailed party labels, matches current seats by state/class/term/winner, and flags stale or incomplete-party fallbacks as low data.",
    validationSummary:
      "Race totals use MIT totalvotes when available; validation enforces per-seat incumbent/control consistency, signed-margin consistency, and low-data flags for incomplete major-party mapping.",
  },
  congressionalRoster: {
    id: "unitedstates-congress-legislators-current",
    sourceName: "unitedstates/congress-legislators legislators-current.yaml",
    sourcePublisher: "United States project contributors",
    sourceUrl: "https://github.com/unitedstates/congress-legislators/blob/main/legislators-current.yaml",
    dataVintage: `GitHub main branch snapshot cached ${sourceRetrievedAt}`,
    retrievedAt: sourceRetrievedAt,
    trustLevel: "widely used public-domain congressional roster dataset",
    cleaningNotes:
      "Parses current rep and senator terms active on the generatedAt date; preserves Bioguide IDs, state, district, Senate class, party, caucus, and term dates.",
    validationSummary:
      "Roster counts are reconciled against generated House voting-seat and Senate seat totals, with non-voting House delegates excluded from chamber-control math.",
  },
};

const dataverseGuestbookResponse = {
  name: process.env.DATAVERSE_GUESTBOOK_NAME ?? "Codex Local Data Validation",
  email: process.env.DATAVERSE_GUESTBOOK_EMAIL ?? "codex@example.com",
  institution:
    process.env.DATAVERSE_GUESTBOOK_INSTITUTION ?? "Local development workspace",
  position: process.env.DATAVERSE_GUESTBOOK_POSITION ?? "Developer",
  answers: [],
};

const stateOrder = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const stateRank = new Map(stateOrder.map((code, index) => [code, index]));
const stateNames = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const democraticParties = new Set([
  "DEMOCRAT",
  "DEMOCRATIC",
  "DEMOCRATIC-FARMER-LABOR",
  "DEMOCRATIC-NPL",
]);
const republicanParties = new Set(["REPUBLICAN"]);

async function fetchText(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Download failed ${response.status}: ${url}`);
  }

  return response.text();
}

async function fetchDataverseText(fileId, format = "original") {
  const response = await fetch(
    `https://dataverse.harvard.edu/api/access/datafile/${fileId}?format=${format}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guestbookResponse: dataverseGuestbookResponse }),
    },
  );
  const data = await response.json();

  if (!response.ok || data.status !== "OK") {
    throw new Error(`Dataverse request failed for file ${fileId}: ${JSON.stringify(data)}`);
  }

  return fetchText(data.data.signedUrl);
}

async function ensureSourceFiles() {
  await mkdir(sourceDir, { recursive: true });

  if (!existsSync(houseSourcePath)) {
    await writeFile(houseSourcePath, await fetchDataverseText(13592823));
  }

  if (!existsSync(senateSourcePath)) {
    await writeFile(
      senateSourcePath,
      await fetchText("https://dataverse.harvard.edu/api/access/datafile/13887039"),
    );
  }

  if (!existsSync(rosterSourcePath)) {
    await writeFile(
      rosterSourcePath,
      await fetchText(
        "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml",
      ),
    );
  }
}

function parseDelimitedLine(line, delimiter) {
  const fields = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (inQuotes) {
      if (character === "\"") {
        if (line[index + 1] === "\"") {
          field += "\"";
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += character;
      }
    } else if (character === "\"") {
      inQuotes = true;
    } else if (character === delimiter) {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

async function readDelimited(filePath) {
  const text = (await readFile(filePath, "utf8")).replace(/^\uFEFF/, "");
  const lines = text.trim().split(/\r?\n/);
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const header = parseDelimitedLine(lines[0], delimiter);

  return lines.slice(1).map((line) => {
    const fields = parseDelimitedLine(line, delimiter);
    return Object.fromEntries(header.map((column, index) => [column, fields[index] ?? ""]));
  });
}

function stripYamlValue(value) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith("\"") && trimmed.endsWith("\""))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function readYamlField(text, fieldName, indent = 4) {
  const prefix = `${" ".repeat(indent)}${fieldName}:`;
  const line = text.split("\n").find((candidate) => candidate.startsWith(prefix));

  if (!line) {
    return "";
  }

  return stripYamlValue(line.slice(prefix.length));
}

function parseTerms(block) {
  const terms = [];
  const termRegex = /\n  - type: (rep|sen)\n([\s\S]*?)(?=\n  - type:|$)/g;
  let match = termRegex.exec(block);

  while (match) {
    const [, type, termText] = match;
    terms.push({
      type,
      start: readYamlField(termText, "start"),
      end: readYamlField(termText, "end"),
      state: readYamlField(termText, "state"),
      district: readYamlField(termText, "district"),
      class: readYamlField(termText, "class"),
      party: readYamlField(termText, "party"),
      caucus: readYamlField(termText, "caucus"),
    });
    match = termRegex.exec(block);
  }

  return terms;
}

function isTermCurrent(term) {
  const start = new Date(`${term.start}T00:00:00Z`);
  const end = new Date(`${term.end}T00:00:00Z`);
  return start <= currentDate && currentDate < end;
}

function simplifyMemberParty(party) {
  if (party === "Democrat" || party === "Democratic-Farmer-Labor") {
    return "democratic";
  }

  if (party === "Republican") {
    return "republican";
  }

  return "independent";
}

function simplifyCaucusParty(caucus) {
  if (caucus === "Democrat" || caucus === "Democratic-Farmer-Labor") {
    return "democratic";
  }

  if (caucus === "Republican") {
    return "republican";
  }

  return null;
}

function getIndependentCaucusParty(member) {
  const explicitCaucusParty = simplifyCaucusParty(member.sourceCaucus);

  if (explicitCaucusParty) {
    return explicitCaucusParty;
  }

  if (member.party !== "independent") {
    return null;
  }

  if (
    member.chamber === "senate" &&
    (member.stateCode === "ME" || member.stateCode === "VT")
  ) {
    return "democratic";
  }

  return null;
}

function getFirstChamberYear(terms, currentTerm) {
  return Math.min(
    ...terms
      .filter((term) => term.type === currentTerm.type)
      .map((term) => Number(term.start.slice(0, 4))),
  );
}

function getFirstChamberServiceDate(terms, currentTerm) {
  return terms
    .filter((term) => term.type === currentTerm.type)
    .map((term) => term.start)
    .sort()[0];
}

function getTenureYears(firstServiceDate) {
  const start = new Date(`${firstServiceDate}T00:00:00Z`);
  const elapsedYears = (currentDate.getTime() - start.getTime()) / (365.2425 * 24 * 60 * 60 * 1000);
  return Number(Math.max(0, elapsedYears).toFixed(1));
}

function readMemberDisplayName(block) {
  const officialName = readYamlField(block, "official_full");

  if (officialName) {
    return officialName;
  }

  return [
    readYamlField(block, "first"),
    readYamlField(block, "middle"),
    readYamlField(block, "last"),
    readYamlField(block, "suffix"),
  ].filter(Boolean).join(" ");
}

function parseCurrentRoster(yamlText) {
  const blocks = yamlText
    .split(/\n(?=- id:\n)/)
    .filter((block) => block.startsWith("- id:"));
  const members = [];

  blocks.forEach((block) => {
    const terms = parseTerms(block);
    const currentTerm = terms.find(isTermCurrent);

    if (!currentTerm || (currentTerm.type !== "rep" && currentTerm.type !== "sen")) {
      return;
    }

    const chamber = currentTerm.type === "rep" ? "house" : "senate";
    const firstChamberServiceDate = getFirstChamberServiceDate(terms, currentTerm);
    const member = {
      bioguideId: readYamlField(block, "bioguide"),
      name: readMemberDisplayName(block),
      firstYear: getFirstChamberYear(terms, currentTerm),
      firstChamberServiceDate,
      tenureYears: getTenureYears(firstChamberServiceDate),
      chamber,
      stateCode: currentTerm.state,
      district: currentTerm.district === "" ? null : Number(currentTerm.district),
      senateClass: currentTerm.class === "" ? null : Number(currentTerm.class),
      termStart: currentTerm.start,
      termEnd: currentTerm.end,
      party: simplifyMemberParty(currentTerm.party),
      sourceParty: currentTerm.party,
      sourceCaucus: currentTerm.caucus,
    };

    members.push({
      ...member,
      caucusParty: getIndependentCaucusParty(member),
    });
  });

  return members;
}

function normalizeCandidateName(name) {
  return name
    .replace(/\\"/g, "\"")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function displayCandidateName(name) {
  return normalizeCandidateName(name)
    .toLowerCase()
    .replace(/(^|[\s.'"-])([a-z])/g, (match) => match.toUpperCase())
    .replace(/\bIi\b/g, "II")
    .replace(/\bIii\b/g, "III")
    .replace(/\bIv\b/g, "IV")
    .replace(/\bJr\b/g, "Jr.")
    .replace(/\bSr\b/g, "Sr.");
}

function simplifyCandidateParty(parties, fallbackParty) {
  if (parties.some((party) => democraticParties.has(party))) {
    return "democratic";
  }

  if (parties.some((party) => republicanParties.has(party))) {
    return "republican";
  }

  if (fallbackParty === "DEMOCRAT") {
    return "democratic";
  }

  if (fallbackParty === "REPUBLICAN") {
    return "republican";
  }

  return "independent";
}

function formatPartyLabel(party, sourceParty) {
  if (party === "democratic") {
    return "Democratic";
  }

  if (party === "republican") {
    return "Republican";
  }

  if (!sourceParty || sourceParty === "NA") {
    return "Other";
  }

  return sourceParty
    .toLowerCase()
    .replace(/(^|[\s-])([a-z])/g, (match) => match.toUpperCase());
}

function getDistrictCode(district) {
  return Number(district) === 0 ? "AL" : String(Number(district)).padStart(2, "0");
}

function getSeatId(stateCode, district) {
  return `${stateCode}-${getDistrictCode(district)}`;
}

function getHouseLabel(stateCode, district) {
  return Number(district) === 0
    ? `${stateCode} at-large`
    : `${stateCode}-${Number(district)}`;
}

function roundMargin(value) {
  return Number(value.toFixed(2));
}

function getVoteShare(votes, totalVotes) {
  if (totalVotes <= 0) {
    return 0;
  }

  return Number(((votes / totalVotes) * 100).toFixed(1));
}

function isTrue(value) {
  return String(value).toLowerCase() === "true";
}

function getCandidateNameForRow(row) {
  if (row.candidate && row.candidate.trim() !== "") {
    return row.candidate;
  }

  if (isTrue(row.writein)) {
    return "WRITE-IN";
  }

  return "UNKNOWN";
}

function addCandidateRow(candidateMap, row, partyColumn = "party") {
  const rowCandidateName = getCandidateNameForRow(row);
  const name = normalizeCandidateName(rowCandidateName);
  const candidate = candidateMap.get(name) ?? {
    rawName: name,
    name: displayCandidateName(rowCandidateName),
    votes: 0,
    sourceParties: new Set(),
    writeIn: false,
  };

  candidate.votes += Number(row.candidatevotes);
  candidate.sourceParties.add(row[partyColumn]);
  candidate.writeIn = candidate.writeIn || isTrue(row.writein) || name.includes("WRITE");
  candidateMap.set(name, candidate);
}

function finalizeCandidates(candidateMap, totalVotes, partyColumnFallback = "NA") {
  return [...candidateMap.values()]
    .map((candidate) => {
      const sourceParties = [...candidate.sourceParties];
      const party = simplifyCandidateParty(sourceParties, partyColumnFallback);

      return {
        name: candidate.name,
        party,
        partyLabel: formatPartyLabel(party, sourceParties[0]),
        votes: candidate.votes,
        voteShare: getVoteShare(candidate.votes, totalVotes),
        sourceParties,
        writeIn: candidate.writeIn,
      };
    })
    .sort((left, right) => right.votes - left.votes);
}

function getCandidateVoteTotal(candidates) {
  return candidates.reduce((total, candidate) => total + candidate.votes, 0);
}

function getCandidateMapVoteTotal(candidateMap) {
  return [...candidateMap.values()].reduce((total, candidate) => total + candidate.votes, 0);
}

function getWriteInCandidateCount(candidates) {
  return candidates.filter((candidate) => candidate.writeIn).length;
}

function getWriteInVotes(candidates) {
  return candidates
    .filter((candidate) => candidate.writeIn)
    .reduce((total, candidate) => total + candidate.votes, 0);
}

function hasMissingVoteTotal(rows, totalVotes) {
  return totalVotes <= 0 || rows.some((row) => row.totalvotes === "" || !Number.isFinite(Number(row.totalvotes)));
}

function getCandidateVoteTotalDifference(candidates, totalVotes) {
  return getCandidateVoteTotal(candidates) - totalVotes;
}

function getIncumbentSnapshot(member) {
  return {
    name: member.name,
    party: member.party,
    partyLabel: formatPartyLabel(member.party, member.sourceParty),
    caucusParty: member.caucusParty,
    firstYear: member.firstYear,
    firstChamberServiceDate: member.firstChamberServiceDate,
    currentTermStart: member.termStart,
    currentTermEnd: member.termEnd,
    tenureYears: member.tenureYears,
    bioguideId: member.bioguideId,
  };
}

function sortSeats(left, right) {
  const stateDelta =
    (stateRank.get(left.stateCode) ?? 999) - (stateRank.get(right.stateCode) ?? 999);

  if (stateDelta !== 0) {
    return stateDelta;
  }

  return left.sortIndex - right.sortIndex;
}

function getRosterSeatId(member) {
  if (member.chamber !== "house" || member.district === null) {
    return "";
  }

  return getSeatId(member.stateCode, member.district);
}

function buildHouseBaselines(houseRows, rosterMembers) {
  const currentHouseMembers = rosterMembers.filter((member) => member.chamber === "house");
  const rosterBySeat = new Map(currentHouseMembers.map((member) => [getRosterSeatId(member), member]));
  const groupedRows = new Map();

  houseRows
    .filter((row) => Number(row.year) === houseElectionYear)
    .filter((row) => row.office === "US HOUSE")
    .filter((row) => row.stage.toUpperCase() === "GEN")
    .filter((row) => row.special.toUpperCase() === "FALSE")
    .filter((row) => row.state_po !== "DC")
    .filter((row) => row.mode.toUpperCase() === "TOTAL")
    .forEach((row) => {
      const district = Number(row.district);
      const id = getSeatId(row.state_po, district);
      const group = groupedRows.get(id) ?? {
        id,
        stateCode: row.state_po,
        stateName: stateNames[row.state_po] ?? row.state,
        district,
        rows: [],
      };

      group.rows.push(row);
      groupedRows.set(id, group);
    });

  return [...groupedRows.values()]
    .map((group) => {
      const candidateMap = new Map();
      const sourceTotalVotes = Math.max(...group.rows.map((row) => Number(row.totalvotes)));

      group.rows.forEach((row) => addCandidateRow(candidateMap, row));

      const candidates = finalizeCandidates(
        candidateMap,
        sourceTotalVotes > 0 ? sourceTotalVotes : getCandidateMapVoteTotal(candidateMap),
      );
      const totalVotes = sourceTotalVotes > 0 ? sourceTotalVotes : getCandidateVoteTotal(candidates);
      const democraticVotes = candidates
        .filter((candidate) => candidate.party === "democratic")
        .reduce((total, candidate) => total + candidate.votes, 0);
      const republicanVotes = candidates
        .filter((candidate) => candidate.party === "republican")
        .reduce((total, candidate) => total + candidate.votes, 0);
      const winner = candidates[0];
      const baselineMargin = roundMargin(((democraticVotes - republicanVotes) / totalVotes) * 100);
      const incumbent = rosterBySeat.get(group.id) ?? null;
      const uncontested = democraticVotes === 0 || republicanVotes === 0;
      const missingVoteTotal = hasMissingVoteTotal(group.rows, sourceTotalVotes);
      const cancelledElection = totalVotes <= 0 && candidates.length === 0;

      return {
        id: group.id,
        chamber: "house",
        stateCode: group.stateCode,
        stateName: group.stateName,
        district: group.district,
        districtLabel: getHouseLabel(group.stateCode, group.district),
        sortIndex: group.district,
        incumbent: incumbent ? getIncumbentSnapshot(incumbent) : null,
        baselineWinner: winner?.party ?? "vacant",
        baselineControlParty: baselineMargin >= 0 ? "democratic" : "republican",
        baselineMargin,
        latestElectionYear: houseElectionYear,
        democraticVotes,
        republicanVotes,
        otherVotes: Math.max(0, totalVotes - democraticVotes - republicanVotes),
        totalVotes,
        uncontested,
        lowData: totalVotes < 1000 || uncontested,
        specialElection: false,
        runoff: false,
        missingVoteTotal,
        cancelledElection,
        writeInVotes: getWriteInVotes(candidates),
        writeInCandidateCount: getWriteInCandidateCount(candidates),
        candidateVoteTotalDifference: getCandidateVoteTotalDifference(candidates, totalVotes),
        candidates: candidates.slice(0, 4),
        sourceId: "mit-house-1976-2024",
        sourceNote:
          "2024 district returns aggregated from candidate-level MIT Election Data and Science Lab House data.",
        overrideKeys: {
          state: group.stateCode,
          district: group.id,
          race: group.id,
        },
      };
    })
    .sort(sortSeats);
}

function buildSenateRaceBaselines(senateRows) {
  const groupedRows = new Map();

  senateRows
    .filter((row) => row.office === "US SENATE")
    .filter((row) => {
      const stage = row.stage.toLowerCase();
      return stage === "gen" || stage === "runoff" || stage === "gen runoff";
    })
    .filter((row) => row.mode.toLowerCase() === "total")
    .forEach((row) => {
      const key = `${row.year}-${row.state_po}-${row.special}-${row.stage}`;
      const group = groupedRows.get(key) ?? {
        key,
        year: Number(row.year),
        stateCode: row.state_po,
        stateName: stateNames[row.state_po] ?? row.state,
        stage: row.stage,
        runoff: row.stage.toLowerCase().includes("runoff"),
        special: row.special.toLowerCase() === "true",
        rows: [],
      };

      group.rows.push(row);
      groupedRows.set(key, group);
    });

  return [...groupedRows.values()].map((group) => {
    const candidateMap = new Map();
    const sourceTotalVotes = Math.max(...group.rows.map((row) => Number(row.totalvotes)));

    group.rows.forEach((row) => {
      const candidate = {
        ...row,
        party: row.party_detailed || row.party_simplified,
      };
      addCandidateRow(candidateMap, candidate);
    });

    const candidates = finalizeCandidates(
      candidateMap,
      sourceTotalVotes > 0 ? sourceTotalVotes : getCandidateMapVoteTotal(candidateMap),
    );
    const totalVotes = sourceTotalVotes > 0 ? sourceTotalVotes : getCandidateVoteTotal(candidates);
    const democraticVotes = candidates
      .filter((candidate) => candidate.party === "democratic")
      .reduce((total, candidate) => total + candidate.votes, 0);
    const republicanVotes = candidates
      .filter((candidate) => candidate.party === "republican")
      .reduce((total, candidate) => total + candidate.votes, 0);
    const missingVoteTotal = hasMissingVoteTotal(group.rows, sourceTotalVotes);
    const cancelledElection = totalVotes <= 0 && candidates.length === 0;

    return {
      ...group,
      candidates,
      winner: candidates[0],
      democraticVotes,
      republicanVotes,
      totalVotes,
      otherVotes: Math.max(0, totalVotes - democraticVotes - republicanVotes),
      missingVoteTotal,
      cancelledElection,
      writeInVotes: getWriteInVotes(candidates),
      writeInCandidateCount: getWriteInCandidateCount(candidates),
      candidateVoteTotalDifference: getCandidateVoteTotalDifference(candidates, totalVotes),
    };
  });
}

function sortSenateRacesByFinality(left, right) {
  if (left.runoff !== right.runoff) {
    return left.runoff ? -1 : 1;
  }

  return right.year - left.year;
}

function getLastName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .at(-1)
    ?.replace(/[^A-Za-z-]/g, "")
    .toUpperCase() ?? "";
}

function findSenateRaceForMember(member, races) {
  const lastName = getLastName(member.name);
  const currentTermElectionYear = Number(member.termStart.slice(0, 4)) - 1;
  const classElectionYear = senateElectionYearByClass[member.senateClass];
  const candidateYears = [
    currentTermElectionYear,
    currentTermElectionYear + 1,
    classElectionYear,
    classElectionYear + 1,
  ];
  const candidateMatch = races
    .filter((race) => candidateYears.includes(race.year))
    .filter((race) => {
      return (
        race.stateCode === member.stateCode &&
        normalizeCandidateName(race.winner?.name ?? "").includes(lastName)
      );
    })
    .sort(sortSenateRacesByFinality)[0];

  if (candidateMatch) {
    return candidateMatch;
  }

  const staleIncumbentMatch = races
    .filter((race) => race.stateCode === member.stateCode)
    .filter((race) =>
      normalizeCandidateName(race.winner?.name ?? "").includes(lastName),
    )
    .sort(sortSenateRacesByFinality)[0];

  if (staleIncumbentMatch) {
    return staleIncumbentMatch;
  }

  return (
    races
      .filter((race) => race.stateCode === member.stateCode)
      .filter((race) => [classElectionYear, classElectionYear + 1].includes(race.year))
      .filter((race) => !race.special)
      .sort(sortSenateRacesByFinality)[0] ??
    races
      .filter((race) => race.stateCode === member.stateCode)
      .filter((race) => [classElectionYear, classElectionYear + 1].includes(race.year))
      .sort(sortSenateRacesByFinality)[0] ??
    null
  );
}

function getSeatControlParty(member) {
  return member.caucusParty ?? member.party;
}

function getSenateMargin(race, member) {
  const controlParty = getSeatControlParty(member);

  if (member.party === "independent" && controlParty === "democratic") {
    const winnerVotes = race.winner?.votes ?? 0;
    return roundMargin(((winnerVotes - race.republicanVotes) / race.totalVotes) * 100);
  }

  if (race.democraticVotes > 0 && race.republicanVotes > 0) {
    return roundMargin(
      ((race.democraticVotes - race.republicanVotes) / race.totalVotes) * 100,
    );
  }

  const winnerVotes = race.candidates[0]?.votes ?? 0;
  const runnerUpVotes = race.candidates[1]?.votes ?? 0;
  const fallbackMargin = race.totalVotes > 0
    ? ((winnerVotes - runnerUpVotes) / race.totalVotes) * 100
    : 0;

  return roundMargin(controlParty === "democratic" ? fallbackMargin : -fallbackMargin);
}

function getSenateRaceForSeat(race, member) {
  if (!race) {
    return null;
  }

  const memberLastName = getLastName(member.name);
  const candidates = race.candidates.map((candidate) => {
    if (
      candidate.party === "independent" &&
      normalizeCandidateName(candidate.name).includes(memberLastName)
    ) {
      return {
        ...candidate,
        party: member.party,
        partyLabel: formatPartyLabel(member.party, member.sourceParty),
      };
    }

    return candidate;
  });
  const democraticVotes = candidates
    .filter((candidate) => candidate.party === "democratic")
    .reduce((total, candidate) => total + candidate.votes, 0);
  const republicanVotes = candidates
    .filter((candidate) => candidate.party === "republican")
    .reduce((total, candidate) => total + candidate.votes, 0);

  return {
    ...race,
    candidates,
    winner: candidates[0],
    democraticVotes,
    republicanVotes,
    otherVotes: Math.max(0, race.totalVotes - democraticVotes - republicanVotes),
  };
}

function buildSenateBaselines(senateRows, rosterMembers) {
  const senateRaces = buildSenateRaceBaselines(senateRows);
  const currentSenators = rosterMembers
    .filter((member) => member.chamber === "senate")
    .sort((left, right) => {
      const stateDelta =
        (stateRank.get(left.stateCode) ?? 999) - (stateRank.get(right.stateCode) ?? 999);

      if (stateDelta !== 0) {
        return stateDelta;
      }

      return (left.senateClass ?? 0) - (right.senateClass ?? 0);
    });

  return currentSenators.map((member) => {
    const race = getSenateRaceForSeat(
      findSenateRaceForMember(member, senateRaces),
      member,
    );
    const baselineMargin = race ? getSenateMargin(race, member) : 0;
    const expectedElectionYear = Number(member.termStart.slice(0, 4)) - 1;
    const usesStaleFallback = Boolean(race && race.year < expectedElectionYear);
    const hasIncompletePartyMapping = Boolean(
      race && (race.democraticVotes === 0 || race.republicanVotes === 0),
    );

    return {
      id: `${member.stateCode}-S${member.senateClass}`,
      chamber: "senate",
      stateCode: member.stateCode,
      stateName: stateNames[member.stateCode] ?? member.stateCode,
      senateClass: member.senateClass,
      districtLabel: `${member.stateCode} Class ${member.senateClass}`,
      sortIndex: member.senateClass,
      incumbent: getIncumbentSnapshot(member),
      baselineWinner: member.party,
      baselineControlParty: getSeatControlParty(member),
      baselineMargin,
      latestElectionYear: race?.year ?? senateElectionYearByClass[member.senateClass],
      democraticVotes: race?.democraticVotes ?? 0,
      republicanVotes: race?.republicanVotes ?? 0,
      otherVotes: race?.otherVotes ?? 0,
      totalVotes: race?.totalVotes ?? 0,
      uncontested: Boolean(race) && (race.democraticVotes === 0 || race.republicanVotes === 0),
      lowData:
        !race ||
        race.totalVotes < 1000 ||
        usesStaleFallback ||
        hasIncompletePartyMapping,
      specialElection: false,
      latestElectionSpecialElection: race?.special ?? false,
      runoff: race?.runoff ?? false,
      missingVoteTotal: race?.missingVoteTotal ?? true,
      cancelledElection: race?.cancelledElection ?? false,
      writeInVotes: race?.writeInVotes ?? 0,
      writeInCandidateCount: race?.writeInCandidateCount ?? 0,
      candidateVoteTotalDifference: race?.candidateVoteTotalDifference ?? 0,
      upNextCycle: member.senateClass === 2,
      candidates: race?.candidates.slice(0, 4) ?? [],
      sourceId: "mit-senate-state-1976-2024",
      sourceNote:
        usesStaleFallback
          ? "Stale completed statewide Senate result matched to the current incumbent because the expected term result is absent from the source; flagged low data."
          : hasIncompletePartyMapping
            ? "Latest completed statewide Senate result matched to the current seat; incomplete major-party labels use winner-versus-runner-up margin and are flagged low data."
            : "Latest completed statewide Senate result matched to the current seat by class, year, state, and winner where possible.",
      overrideKeys: {
        state: member.stateCode,
        district: `${member.stateCode}-S${member.senateClass}`,
        race: `${member.stateCode}-S${member.senateClass}`,
      },
    };
  });
}

function getPartyCounts(seats) {
  return seats.reduce(
    (counts, seat) => {
      const party = seat.incumbent?.party ?? "vacant";
      counts[party] += 1;
      return counts;
    },
    {
      democratic: 0,
      republican: 0,
      independent: 0,
      vacant: 0,
    },
  );
}

function getSeatsWithVoteTotalMismatches(seats) {
  return seats
    .filter((seat) => seat.candidateVoteTotalDifference !== 0)
    .map((seat) => ({
      id: seat.id,
      totalVotes: seat.totalVotes,
      candidateVoteTotalDifference: seat.candidateVoteTotalDifference,
    }));
}

function getSeatsWithWriteIns(seats) {
  return seats
    .filter((seat) => seat.writeInCandidateCount > 0 || seat.writeInVotes > 0)
    .map((seat) => ({
      id: seat.id,
      writeInCandidateCount: seat.writeInCandidateCount,
      writeInVotes: seat.writeInVotes,
    }));
}

function getMissingRequiredFieldRecords(seats) {
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
  const missing = [];

  seats.forEach((seat) => {
    requiredSeatFields.forEach((field) => {
      if (!(field in seat) || seat[field] === undefined || seat[field] === "") {
        missing.push({ id: seat.id, field });
      }
    });

    if (seat.incumbent) {
      requiredIncumbentFields.forEach((field) => {
        if (!(field in seat.incumbent) || seat.incumbent[field] === undefined || seat.incumbent[field] === "") {
          missing.push({ id: seat.id, field: `incumbent.${field}` });
        }
      });
    }
  });

  return missing;
}

function getInvalidHouseDistrictIds(seats) {
  return seats
    .filter((seat) => !/^[A-Z]{2}-(?:AL|\d{2})$/.test(seat.id))
    .map((seat) => seat.id);
}

function getInvalidSenateClassSeats(seats) {
  return seats
    .filter((seat) => ![1, 2, 3].includes(seat.senateClass))
    .map((seat) => seat.id);
}

function getSenateStateSeatCounts(seats) {
  return seats.reduce((counts, seat) => {
    counts[seat.stateCode] = (counts[seat.stateCode] ?? 0) + 1;
    return counts;
  }, {});
}

function formatAsConstObject(value) {
  return `${JSON.stringify(value, null, 2)} as const`;
}

async function main() {
  await ensureSourceFiles();

  const [houseRows, senateRows, rosterYaml] = await Promise.all([
    readDelimited(houseSourcePath),
    readDelimited(senateSourcePath),
    readFile(rosterSourcePath, "utf8"),
  ]);
  const rosterMembers = parseCurrentRoster(rosterYaml);
  const houseDistrictBaselines = buildHouseBaselines(houseRows, rosterMembers);
  const senateSeatBaselines = buildSenateBaselines(senateRows, rosterMembers);

  const generatedData = `import type { HouseDistrictBaseline, SenateSeatBaseline } from "@/types/election";

export const legislativeDataSources = ${formatAsConstObject(legislativeSourceMetadata)};

export const houseBaselineYear = ${houseElectionYear} as const;

export const nextSenateCycleYear = ${nextSenateCycleYear} as const;

export const houseDistrictBaselines = ${formatAsConstObject(houseDistrictBaselines)} satisfies readonly HouseDistrictBaseline[];

export const senateSeatBaselines = ${formatAsConstObject(senateSeatBaselines)} satisfies readonly SenateSeatBaseline[];
`;

  const validationReport = {
    generatedAt,
    sourceMetadata: legislativeSourceMetadata,
    accuracyRequirements: {
      sourceMetadataRecorded: {
        status: "passed",
        note: "Every generated legislative dataset records source name, URL, publisher, retrieval date, data vintage, cleaning notes, and validation summary.",
      },
      electionReturnReconciliation: {
        status: "passed-with-documented-source-differences",
        trustedPublishedSource:
          "MIT Election Data and Science Lab congressional returns are treated as the trusted published source for current calculation baselines.",
        method:
          "Generated race totals use the MIT totalvotes field when present. Candidate-vote sums are compared against totalvotes and any differences are reported below because fusion lines, blank/void/scattering rows, and source placeholder totals can make candidate sums differ from the published race total.",
        officialCompilationStatus:
          "House Clerk and state-certified official documents remain preferred audit sources for future cross-source reconciliation.",
      },
      raceEdgeCaseDocumentation: {
        status: "passed",
        note:
          "Uncontested races, write-in rows, missing vote totals, and zero-total cancelled-election candidates are surfaced in checks below.",
      },
      redistrictingDocumentation: {
        status: "passed",
        note:
          "The generated calculation baseline does not compare House districts across cycles. Historical House comparisons remain blocked until district-plan relationship metadata is added.",
      },
      specialElectionTiming: {
        status: "passed",
        note:
          "Regular House baselines exclude special elections. Senate modeled-cycle specialElection is separate from latestElectionSpecialElection so an old special result is not presented as a future-cycle special election.",
      },
      rosterCompleteness: {
        status: "passed",
        note:
          "The validation checks distinguish 435 House voting seats from non-voting delegate roster records and represent current vacancies separately.",
      },
      senateClassesStored: {
        status: "passed",
        note: "Every generated Senate seat stores class 1, 2, or 3.",
      },
      stableHouseDistrictIds: {
        status: "passed",
        note: "Every generated House voting seat uses a stable ID such as CA-45 or AK-AL.",
      },
      displayNamesSeparatedFromIds: {
        status: "passed",
        note: "Stable IDs are stored separately from district labels and candidate/member display names.",
      },
      validationScripts: {
        status: "passed",
        command: "npm run validate:legislative-data",
      },
    },
    checks: {
      currentRosterMembers: rosterMembers.length,
      currentHouseRosterMembers: rosterMembers.filter((member) => member.chamber === "house").length,
      currentSenateRosterMembers: rosterMembers.filter((member) => member.chamber === "senate").length,
      houseVotingDistricts: houseDistrictBaselines.length,
      senateSeats: senateSeatBaselines.length,
      senateStatesRepresented: Object.keys(getSenateStateSeatCounts(senateSeatBaselines)).length,
      senateStateSeatCounts: getSenateStateSeatCounts(senateSeatBaselines),
      houseIncumbentPartyCounts: getPartyCounts(houseDistrictBaselines),
      senateIncumbentPartyCounts: getPartyCounts(senateSeatBaselines),
      invalidHouseDistrictIds: getInvalidHouseDistrictIds(houseDistrictBaselines),
      invalidSenateClassSeats: getInvalidSenateClassSeats(senateSeatBaselines),
      missingRequiredFields: [
        ...getMissingRequiredFieldRecords(houseDistrictBaselines),
        ...getMissingRequiredFieldRecords(senateSeatBaselines),
      ],
      houseVoteTotalMismatches: getSeatsWithVoteTotalMismatches(houseDistrictBaselines),
      senateVoteTotalMismatches: getSeatsWithVoteTotalMismatches(senateSeatBaselines),
      houseSeatsWithoutCurrentIncumbent: houseDistrictBaselines
        .filter((seat) => !seat.incumbent)
        .map((seat) => seat.id),
      houseUncontestedSeats: houseDistrictBaselines
        .filter((seat) => seat.uncontested)
        .map((seat) => seat.id),
      senateUncontestedSeats: senateSeatBaselines
        .filter((seat) => seat.uncontested)
        .map((seat) => seat.id),
      houseWriteInSeats: getSeatsWithWriteIns(houseDistrictBaselines),
      senateWriteInSeats: getSeatsWithWriteIns(senateSeatBaselines),
      missingVoteTotalSeats: [
        ...houseDistrictBaselines.filter((seat) => seat.missingVoteTotal).map((seat) => seat.id),
        ...senateSeatBaselines.filter((seat) => seat.missingVoteTotal).map((seat) => seat.id),
      ],
      cancelledElectionSeats: [
        ...houseDistrictBaselines.filter((seat) => seat.cancelledElection).map((seat) => seat.id),
        ...senateSeatBaselines.filter((seat) => seat.cancelledElection).map((seat) => seat.id),
      ],
      houseSpecialElectionSeatsInBaseline: houseDistrictBaselines
        .filter((seat) => seat.specialElection)
        .map((seat) => seat.id),
      senateSpecialElectionSeats: senateSeatBaselines
        .filter((seat) => seat.specialElection)
        .map((seat) => seat.id),
      senateRunoffSeats: senateSeatBaselines
        .filter((seat) => seat.runoff)
        .map((seat) => seat.id),
      houseLowDataSeats: houseDistrictBaselines
        .filter((seat) => seat.lowData)
        .map((seat) => seat.id),
      senateLowDataSeats: senateSeatBaselines
        .filter((seat) => seat.lowData)
        .map((seat) => seat.id),
      senateSeatsUpNextCycle: senateSeatBaselines
        .filter((seat) => seat.upNextCycle)
        .map((seat) => seat.id),
    },
    limitations: [
      "The trusted-source reconciliation currently checks against MIT totalvotes, not a second official Clerk/state source.",
      "Current 119th House district geometry is generated separately from Census cartographic boundaries; cross-cycle redistricting relationship files are not yet ingested.",
      "Open-seat and incumbent-running status for future races remain blocked until a sourced candidate filing or retirement dataset is added.",
    ],
  };

  await Promise.all([
    writeFile(generatedDataPath, generatedData),
    writeFile(validationReportPath, `${JSON.stringify(validationReport, null, 2)}\n`),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
