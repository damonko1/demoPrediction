import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createWriteStream, existsSync } from "node:fs";
import https from "node:https";
import path from "node:path";

const sourceDir = ".tmp/election-sources";
const stateSourcePath = path.join(sourceDir, "mit-president-state.csv");
const countySourcePath = path.join(sourceDir, "mit-countypres-2000-2024.csv");
const generatedDataPath = "src/data/historicalElectionData.generated.ts";
const validationReportPath = "docs/historical-data-validation.generated.json";

const historicalYears = [2000, 2004, 2008, 2012, 2016, 2020, 2024];
const historicalYearSet = new Set(historicalYears.map(String));

const dataverseGuestbookResponse = {
  name: process.env.DATAVERSE_GUESTBOOK_NAME ?? "Codex Local Data Validation",
  email: process.env.DATAVERSE_GUESTBOOK_EMAIL ?? "codex@example.com",
  institution:
    process.env.DATAVERSE_GUESTBOOK_INSTITUTION ?? "Local development workspace",
  position: process.env.DATAVERSE_GUESTBOOK_POSITION ?? "Developer",
  answers: [],
};

const sourceFiles = [
  {
    path: stateSourcePath,
    id: 13887042,
    format: "original",
  },
  {
    path: countySourcePath,
    id: 13573089,
    format: "original",
  },
];

const electoralVotes2000 = {
  AL: 9, AK: 3, AZ: 8, AR: 6, CA: 54, CO: 8, CT: 8, DE: 3, DC: 3, FL: 25,
  GA: 13, HI: 4, ID: 4, IL: 22, IN: 12, IA: 7, KS: 6, KY: 8, LA: 9, ME: 4,
  MD: 10, MA: 12, MI: 18, MN: 10, MS: 7, MO: 11, MT: 3, NE: 5, NV: 4, NH: 4,
  NJ: 15, NM: 5, NY: 33, NC: 14, ND: 3, OH: 21, OK: 8, OR: 7, PA: 23, RI: 4,
  SC: 8, SD: 3, TN: 11, TX: 32, UT: 5, VT: 3, VA: 13, WA: 11, WV: 5, WI: 11,
  WY: 3,
};

const electoralVotes2004 = {
  AL: 9, AK: 3, AZ: 10, AR: 6, CA: 55, CO: 9, CT: 7, DE: 3, DC: 3, FL: 27,
  GA: 15, HI: 4, ID: 4, IL: 21, IN: 11, IA: 7, KS: 6, KY: 8, LA: 9, ME: 4,
  MD: 10, MA: 12, MI: 17, MN: 10, MS: 6, MO: 11, MT: 3, NE: 5, NV: 5, NH: 4,
  NJ: 15, NM: 5, NY: 31, NC: 15, ND: 3, OH: 20, OK: 7, OR: 7, PA: 21, RI: 4,
  SC: 8, SD: 3, TN: 11, TX: 34, UT: 5, VT: 3, VA: 13, WA: 11, WV: 5, WI: 10,
  WY: 3,
};

const electoralVotes2012 = {
  AL: 9, AK: 3, AZ: 11, AR: 6, CA: 55, CO: 9, CT: 7, DE: 3, DC: 3, FL: 29,
  GA: 16, HI: 4, ID: 4, IL: 20, IN: 11, IA: 6, KS: 6, KY: 8, LA: 8, ME: 4,
  MD: 10, MA: 11, MI: 16, MN: 10, MS: 6, MO: 10, MT: 3, NE: 5, NV: 6, NH: 4,
  NJ: 14, NM: 5, NY: 29, NC: 15, ND: 3, OH: 18, OK: 7, OR: 7, PA: 20, RI: 4,
  SC: 9, SD: 3, TN: 11, TX: 38, UT: 6, VT: 3, VA: 13, WA: 12, WV: 5, WI: 10,
  WY: 3,
};

const electoralVotes2024 = {
  AL: 9, AK: 3, AZ: 11, AR: 6, CA: 54, CO: 10, CT: 7, DE: 3, DC: 3, FL: 30,
  GA: 16, HI: 4, ID: 4, IL: 19, IN: 11, IA: 6, KS: 6, KY: 8, LA: 8, ME: 4,
  MD: 10, MA: 11, MI: 15, MN: 10, MS: 6, MO: 10, MT: 4, NE: 5, NV: 6, NH: 4,
  NJ: 14, NM: 5, NY: 28, NC: 16, ND: 3, OH: 17, OK: 7, OR: 8, PA: 19, RI: 4,
  SC: 9, SD: 3, TN: 11, TX: 40, UT: 6, VT: 3, VA: 13, WA: 12, WV: 4, WI: 10,
  WY: 3,
};

const electoralVotesByYear = {
  2000: electoralVotes2000,
  2004: electoralVotes2004,
  2008: electoralVotes2004,
  2012: electoralVotes2012,
  2016: electoralVotes2012,
  2020: electoralVotes2012,
  2024: electoralVotes2024,
};

const splitDistrictMargins = {
  2000: {
    ME: { "ME-1": 7.93, "ME-2": 1.87 },
    NE: { "NE-1": -23.0, "NE-2": -18.0, "NE-3": -46.0 },
  },
  2004: {
    ME: { "ME-1": 12.0, "ME-2": 5.83 },
    NE: { "NE-1": -32.0, "NE-2": -20.0, "NE-3": -52.0 },
  },
  2008: {
    ME: { "ME-1": 23.0, "ME-2": 11.0 },
    NE: { "NE-1": -21.0, "NE-2": 1.21, "NE-3": -53.0 },
  },
  2012: {
    ME: { "ME-1": 21.0, "ME-2": 8.6 },
    NE: { "NE-1": -17.0, "NE-2": -7.1, "NE-3": -53.0 },
  },
  2016: {
    ME: { "ME-1": 14.8, "ME-2": -10.3 },
    NE: { "NE-1": -20.7, "NE-2": -2.2, "NE-3": -57.0 },
  },
  2020: {
    ME: { "ME-1": 23.09, "ME-2": -7.44 },
    NE: { "NE-1": -15.6, "NE-2": 6.5, "NE-3": -54.7 },
  },
  2024: {
    ME: { "ME-1": 21.6, "ME-2": -9.04 },
    NE: { "NE-1": -12.97, "NE-2": 4.59, "NE-3": -53.59 },
  },
};

function requestJson(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const request = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (response) => {
        let data = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`Dataverse request failed: ${response.statusCode} ${data}`));
            return;
          }

          resolve(JSON.parse(data));
        });
      },
    );

    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}

function download(url, destination) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (
        response.statusCode &&
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        download(new URL(response.headers.location, url).href, destination).then(
          resolve,
          reject,
        );
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Download failed: ${response.statusCode}`));
        return;
      }

      const stream = createWriteStream(destination);
      response.pipe(stream);
      stream.on("finish", () => {
        stream.close(resolve);
      });
      stream.on("error", reject);
    }).on("error", reject);
  });
}

async function ensureSourceFiles() {
  await mkdir(sourceDir, { recursive: true });

  for (const file of sourceFiles) {
    if (existsSync(file.path)) {
      continue;
    }

    const response = await requestJson(
      `https://dataverse.harvard.edu/api/access/datafile/${file.id}?format=${file.format}`,
      { guestbookResponse: dataverseGuestbookResponse },
    );

    await download(response.data.signedUrl, file.path);
  }
}

function parseCsvLine(line) {
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
    } else if (character === ",") {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

async function readCsv(filePath) {
  const text = (await readFile(filePath, "utf8")).replace(/^\uFEFF/, "");
  const lines = text.trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const fields = parseCsvLine(line);
    return Object.fromEntries(header.map((column, index) => [column, fields[index] ?? ""]));
  });
}

function getMargin(democraticVotes, republicanVotes, totalVotes) {
  return Number((((democraticVotes - republicanVotes) / totalVotes) * 100).toFixed(2));
}

function getStateResults(stateRows) {
  const groupedRows = new Map();

  stateRows
    .filter((row) => historicalYearSet.has(row.year))
    .forEach((row) => {
      const key = `${row.year}-${row.state_po}`;
      const result = groupedRows.get(key) ?? {
        code: row.state_po,
        year: Number(row.year),
        democraticVotes: 0,
        republicanVotes: 0,
        totalVotes: Number(row.totalvotes),
      };
      const candidateVotes = Number(row.candidatevotes);

      if (row.party_simplified === "DEMOCRAT") {
        result.democraticVotes += candidateVotes;
      } else if (row.party_simplified === "REPUBLICAN") {
        result.republicanVotes += candidateVotes;
      }

      groupedRows.set(key, result);
    });

  return historicalYears.reduce((resultsByYear, year) => {
    const yearResults = {};
    const electoralVotes = electoralVotesByYear[year];

    [...groupedRows.values()]
      .filter((result) => result.year === year)
      .sort((left, right) => left.code.localeCompare(right.code))
      .forEach((result) => {
        yearResults[result.code] = {
          code: result.code,
          democraticVotes: result.democraticVotes,
          republicanVotes: result.republicanVotes,
          otherVotes: result.totalVotes - result.democraticVotes - result.republicanVotes,
          totalVotes: result.totalVotes,
          baselineMargin: getMargin(
            result.democraticVotes,
            result.republicanVotes,
            result.totalVotes,
          ),
          electoralVotes: electoralVotes[result.code],
        };
      });

    resultsByYear[year] = yearResults;
    return resultsByYear;
  }, {});
}

function getSplitUnits(stateResultsByYear) {
  return historicalYears.reduce((unitsByYear, year) => {
    const stateResults = stateResultsByYear[year];
    const units = {};

    units.ME = [
      {
        id: "ME-AL",
        label: "Maine at-large",
        kind: "statewide",
        electoralVotes: 2,
        baselineMargin: stateResults.ME.baselineMargin,
        sourceNote: "Statewide popular vote winner receives Maine's two at-large electoral votes.",
      },
      {
        id: "ME-1",
        label: "Maine CD-1",
        kind: "congressional-district",
        electoralVotes: 1,
        baselineMargin: splitDistrictMargins[year].ME["ME-1"],
        sourceNote: "Congressional district method; district margins are tracked separately from statewide votes.",
      },
      {
        id: "ME-2",
        label: "Maine CD-2",
        kind: "congressional-district",
        electoralVotes: 1,
        baselineMargin: splitDistrictMargins[year].ME["ME-2"],
        sourceNote: "Congressional district method; district margins are tracked separately from statewide votes.",
      },
    ];

    units.NE = [
      {
        id: "NE-AL",
        label: "Nebraska at-large",
        kind: "statewide",
        electoralVotes: 2,
        baselineMargin: stateResults.NE.baselineMargin,
        sourceNote: "Statewide popular vote winner receives Nebraska's two at-large electoral votes.",
      },
      {
        id: "NE-1",
        label: "Nebraska CD-1",
        kind: "congressional-district",
        electoralVotes: 1,
        baselineMargin: splitDistrictMargins[year].NE["NE-1"],
        sourceNote: "Congressional district method; district margins are tracked separately from statewide votes.",
      },
      {
        id: "NE-2",
        label: "Nebraska CD-2",
        kind: "congressional-district",
        electoralVotes: 1,
        baselineMargin: splitDistrictMargins[year].NE["NE-2"],
        sourceNote: "Congressional district method; district margins are tracked separately from statewide votes.",
      },
      {
        id: "NE-3",
        label: "Nebraska CD-3",
        kind: "congressional-district",
        electoralVotes: 1,
        baselineMargin: splitDistrictMargins[year].NE["NE-3"],
        sourceNote: "Congressional district method; district margins are tracked separately from statewide votes.",
      },
    ];

    unitsByYear[year] = units;
    return unitsByYear;
  }, {});
}

function cleanCountyRows(countyRows) {
  const groupedRows = new Map();

  countyRows
    .filter((row) => historicalYearSet.has(row.year))
    .filter((row) => row.candidate !== "TOTAL VOTES CAST")
    .forEach((row) => {
      const key = [
        row.year,
        row.state_po,
        row.county_fips,
        row.county_name,
        row.candidate,
        row.party,
      ].join("|");
      const rows = groupedRows.get(key) ?? [];
      rows.push(row);
      groupedRows.set(key, rows);
    });

  return [...groupedRows.values()].map((rows) => {
    const totalRows = rows.filter((row) => ["TOTAL", "TOTAL VOTES"].includes(row.mode));
    const selectedRows = totalRows.length > 0 ? totalRows : rows;

    if (selectedRows.length === 1) {
      return selectedRows[0];
    }

    return {
      ...selectedRows[0],
      candidatevotes: String(
        selectedRows.reduce((total, row) => total + Number(row.candidatevotes), 0),
      ),
      totalvotes: String(
        Math.max(...selectedRows.map((row) => Number(row.totalvotes))),
      ),
      mode: "SUMMED MODES",
    };
  });
}

function getCountyValidation(stateResultsByYear, countyRows) {
  const cleanedCountyRows = cleanCountyRows(countyRows);
  const countyAggregates = new Map();
  const countyKeysByYear = new Map();

  cleanedCountyRows.forEach((row) => {
    const key = `${row.year}-${row.state_po}`;
    const aggregate = countyAggregates.get(key) ?? {
      year: Number(row.year),
      state: row.state_po,
      democraticVotes: 0,
      republicanVotes: 0,
      otherVotes: 0,
      countyTotals: new Map(),
    };
    const candidateVotes = Number(row.candidatevotes);

    if (row.party === "DEMOCRAT") {
      aggregate.democraticVotes += candidateVotes;
    } else if (row.party === "REPUBLICAN") {
      aggregate.republicanVotes += candidateVotes;
    } else {
      aggregate.otherVotes += candidateVotes;
    }

    aggregate.countyTotals.set(
      `${row.county_fips}-${row.county_name}`,
      Number(row.totalvotes),
    );
    countyAggregates.set(key, aggregate);

    const yearCountyKeys = countyKeysByYear.get(row.year) ?? new Set();
    yearCountyKeys.add(`${row.state_po}-${row.county_fips}-${row.county_name}`);
    countyKeysByYear.set(row.year, yearCountyKeys);
  });

  const mismatches = [];

  historicalYears.forEach((year) => {
    Object.values(stateResultsByYear[year]).forEach((stateResult) => {
      const key = `${year}-${stateResult.code}`;
      const countyAggregate = countyAggregates.get(key);

      if (!countyAggregate) {
        mismatches.push({
          year,
          state: stateResult.code,
          field: "state",
          expected: "state aggregate",
          actual: "missing county aggregate",
          delta: null,
        });
        return;
      }

      const countyTotalVotes = [...countyAggregate.countyTotals.values()].reduce(
        (total, value) => total + value,
        0,
      );
      const fields = [
        ["democraticVotes", stateResult.democraticVotes, countyAggregate.democraticVotes],
        ["republicanVotes", stateResult.republicanVotes, countyAggregate.republicanVotes],
        ["otherVotes", stateResult.otherVotes, countyAggregate.otherVotes],
        ["totalVotes", stateResult.totalVotes, countyTotalVotes],
      ];

      fields.forEach(([field, expected, actual]) => {
        if (expected !== actual) {
          mismatches.push({
            year,
            state: stateResult.code,
            field,
            expected,
            actual,
            delta: actual - expected,
          });
        }
      });
    });
  });

  return {
    cleanedCountyRows: cleanedCountyRows.length,
    countyYearRecords: Object.fromEntries(
      historicalYears.map((year) => [
        year,
        countyKeysByYear.get(String(year))?.size ?? 0,
      ]),
    ),
    mismatches,
    mismatchSummaryByYear: Object.fromEntries(
      historicalYears.map((year) => {
        const yearMismatches = mismatches.filter((mismatch) => mismatch.year === year);
        return [
          year,
          {
            mismatchCount: yearMismatches.length,
            maxAbsVoteDelta: yearMismatches.reduce(
              (maxDelta, mismatch) => {
                const delta = Number(mismatch.delta);
                return Number.isFinite(delta)
                  ? Math.max(maxDelta, Math.abs(delta))
                  : maxDelta;
              },
              0,
            ),
          },
        ];
      }),
    ),
  };
}

function formatAsConstObject(value) {
  return `${JSON.stringify(value, null, 2)} as const`;
}

async function main() {
  await ensureSourceFiles();

  const [stateRows, countyRows] = await Promise.all([
    readCsv(stateSourcePath),
    readCsv(countySourcePath),
  ]);
  const stateResultsByYear = getStateResults(stateRows);
  const splitUnitsByYear = getSplitUnits(stateResultsByYear);
  const countyValidation = getCountyValidation(stateResultsByYear, countyRows);

  const generatedData = `import type { HistoricalElectionYear } from "@/types/election";

export const historicalElectionYears = ${JSON.stringify(historicalYears)} as const;

export const defaultHistoricalElectionYear: HistoricalElectionYear = 2024;

export const historicalStateResultsByYear = ${formatAsConstObject(stateResultsByYear)};

export const splitElectoralVoteUnitsByYear = ${formatAsConstObject(splitUnitsByYear)};

export const historicalStateDataSource = {
  sourceName: "MIT Election Data and Science Lab, U.S. President 1976-2024",
  sourceUrl: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/42MVDX",
  retrievedAt: "2026-07-02",
  version: "10.0, released 2026-05-11",
} as const;
`;

  const validationReport = {
    generatedAt: "2026-07-02",
    stateBaselines: {
      sourceName: "MIT Election Data and Science Lab, U.S. President 1976-2024",
      sourceUrl: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/42MVDX",
      status: "calculation-ready",
      checks: {
        historicalYears,
        stateYearRecords: historicalYears.reduce((counts, year) => {
          counts[year] = Object.keys(stateResultsByYear[year]).length;
          return counts;
        }, {}),
        electoralVoteSums: historicalYears.reduce((sums, year) => {
          sums[year] = Object.values(stateResultsByYear[year]).reduce(
            (total, result) => total + result.electoralVotes,
            0,
          );
          return sums;
        }, {}),
      },
    },
    splitElectoralVotes: {
      status: "calculation-ready-for-ev-allocation",
      sourceNotes: [
        "Maine and Nebraska are modeled as two statewide at-large electoral votes plus one electoral vote per congressional district.",
        "2024 split outcome cross-checked against FEC official 2024 results and National Archives Electoral College notes.",
        "District margins are explicit per unit so future official district data can replace or refine any historical margin value without changing calculator shape.",
      ],
    },
    countyResults: {
      sourceName: "MIT Election Data and Science Lab, County Presidential Election Returns 2000-2024",
      sourceUrl: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/VOQCHQ",
      status: countyValidation.mismatches.length === 0
        ? "calculation-ready"
        : "blocked-until-reconciled",
      cleaningRules: [
        "Excluded TOTAL VOTES CAST pseudo-candidate rows.",
        "Preferred TOTAL/TOTAL VOTES mode rows when present.",
        "Summed ballot modes only when no total mode was present.",
      ],
      cleanedCountyRows: countyValidation.cleanedCountyRows,
      countyYearRecords: countyValidation.countyYearRecords,
      mismatchSummaryByYear: countyValidation.mismatchSummaryByYear,
      sampleMismatches: countyValidation.mismatches.slice(0, 40),
      totalMismatches: countyValidation.mismatches.length,
    },
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
