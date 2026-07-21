import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { geoAlbersUsa, geoPath } from "d3-geo";
import shapefile from "shapefile";

const execFileAsync = promisify(execFile);

const sourceUrl =
  "https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_cd119_20m.zip";
const outputPath = path.resolve("public/us-house-districts-119-20m.json");
const mapWidth = 1040;
const mapHeight = 640;

const stateFipsToCode = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "11": "DC",
  "12": "FL",
  "13": "GA",
  "15": "HI",
  "16": "ID",
  "17": "IL",
  "18": "IN",
  "19": "IA",
  "20": "KS",
  "21": "KY",
  "22": "LA",
  "23": "ME",
  "24": "MD",
  "25": "MA",
  "26": "MI",
  "27": "MN",
  "28": "MS",
  "29": "MO",
  "30": "MT",
  "31": "NE",
  "32": "NV",
  "33": "NH",
  "34": "NJ",
  "35": "NM",
  "36": "NY",
  "37": "NC",
  "38": "ND",
  "39": "OH",
  "40": "OK",
  "41": "OR",
  "42": "PA",
  "44": "RI",
  "45": "SC",
  "46": "SD",
  "47": "TN",
  "48": "TX",
  "49": "UT",
  "50": "VT",
  "51": "VA",
  "53": "WA",
  "54": "WV",
  "55": "WI",
  "56": "WY",
  "72": "PR",
};

const stateNames = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
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
  PR: "Puerto Rico",
};

const nonVotingStateCodes = new Set(["DC", "PR"]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function round(value) {
  return Number(value.toFixed(1));
}

function districtCodeFromCensusCode(censusCode) {
  return censusCode === "00" ? "AL" : String(Number(censusCode)).padStart(2, "0");
}

function districtNumberFromCensusCode(censusCode) {
  return censusCode === "00" ? 0 : Number(censusCode);
}

function districtIdForFeature(feature) {
  const stateCode = stateFipsToCode[feature.properties.STATEFP];
  const districtCode = districtCodeFromCensusCode(feature.properties.CD119FP);

  return `${stateCode}-${districtCode}`;
}

function districtLabelForFeature(feature) {
  const stateCode = stateFipsToCode[feature.properties.STATEFP];
  const districtNumber = districtNumberFromCensusCode(feature.properties.CD119FP);

  return districtNumber === 0
    ? `${stateCode} at-large`
    : `${stateCode}-${districtNumber}`;
}

async function downloadFile(url, destination) {
  const response = await fetch(url);

  assert(response.ok, `Failed to download ${url}: ${response.status}`);

  const arrayBuffer = await response.arrayBuffer();
  await writeFile(destination, Buffer.from(arrayBuffer));
}

async function readShapefile(shpPath, dbfPath) {
  const source = await shapefile.open(shpPath, dbfPath);
  const features = [];

  while (true) {
    const next = await source.read();

    if (next.done) {
      break;
    }

    features.push(next.value);
  }

  return features;
}

function buildProjectedDistricts(features) {
  const collection = {
    type: "FeatureCollection",
    features,
  };
  const projection = geoAlbersUsa().fitSize([mapWidth, mapHeight], collection);
  const pathBuilder = geoPath(projection).digits(1);

  return features.map((feature) => {
    const projectedPath = pathBuilder(feature);
    const bounds = pathBuilder.bounds(feature);
    const centroid = pathBuilder.centroid(feature);
    const id = districtIdForFeature(feature);
    const stateCode = stateFipsToCode[feature.properties.STATEFP];
    const district = districtNumberFromCensusCode(feature.properties.CD119FP);

    assert(projectedPath, `${id} has no projected path`);
    assert(
      bounds.flat().every(Number.isFinite),
      `${id} has invalid projected bounds`,
    );
    assert(
      centroid.every(Number.isFinite),
      `${id} has invalid projected centroid`,
    );

    return {
      id,
      stateCode,
      stateName: stateNames[stateCode],
      district,
      districtLabel: districtLabelForFeature(feature),
      censusGeoid: feature.properties.GEOID,
      censusName: feature.properties.NAMELSAD,
      path: projectedPath,
      labelX: round(centroid[0]),
      labelY: round(centroid[1]),
      bounds: [
        round(bounds[0][0]),
        round(bounds[0][1]),
        round(bounds[1][0]),
        round(bounds[1][1]),
      ],
    };
  });
}

function buildDelegateRecords(features) {
  return features.map((feature) => {
    const stateCode = stateFipsToCode[feature.properties.STATEFP];

    return {
      id: `${stateCode}-AL`,
      stateCode,
      stateName: stateNames[stateCode],
      districtLabel: `${stateCode} delegate`,
      censusGeoid: feature.properties.GEOID,
      censusName: feature.properties.NAMELSAD,
    };
  });
}

function sortDistricts(left, right) {
  if (left.stateCode !== right.stateCode) {
    return left.stateCode.localeCompare(right.stateCode);
  }

  return left.district - right.district;
}

async function main() {
  const tempDir = await mkdtemp(path.join(tmpdir(), "house-district-map-"));
  const zipPath = path.join(tempDir, "cb_2025_us_cd119_20m.zip");

  try {
    await downloadFile(sourceUrl, zipPath);
    await execFileAsync("unzip", ["-o", zipPath, "-d", tempDir]);

    const shpPath = path.join(tempDir, "cb_2025_us_cd119_20m.shp");
    const dbfPath = path.join(tempDir, "cb_2025_us_cd119_20m.dbf");

    assert(existsSync(shpPath), "Downloaded archive did not include SHP file");
    assert(existsSync(dbfPath), "Downloaded archive did not include DBF file");

    const features = await readShapefile(shpPath, dbfPath);
    const votingFeatures = features.filter((feature) => {
      const stateCode = stateFipsToCode[feature.properties.STATEFP];
      return stateCode && !nonVotingStateCodes.has(stateCode);
    });
    const delegateFeatures = features.filter((feature) => {
      const stateCode = stateFipsToCode[feature.properties.STATEFP];
      return stateCode && nonVotingStateCodes.has(stateCode);
    });
    const districts = buildProjectedDistricts(votingFeatures).sort(sortDistricts);

    assert(features.length === 437, `Expected 437 Census features, got ${features.length}`);
    assert(districts.length === 435, `Expected 435 voting districts, got ${districts.length}`);
    assert(delegateFeatures.length === 2, `Expected 2 delegate districts, got ${delegateFeatures.length}`);

    const asset = {
      source: {
        name: "U.S. Census Bureau 2025 Cartographic Boundary File, 119th Congressional Districts, 1:20m",
        url: sourceUrl,
        retrievalDate: new Date().toISOString().slice(0, 10),
        vintage: "2025 cartographic boundary file for the 119th Congress",
      },
      viewBox: [0, 0, mapWidth, mapHeight],
      districts,
      nonVotingDelegateDistricts: buildDelegateRecords(delegateFeatures),
    };

    await writeFile(outputPath, `${JSON.stringify(asset, null, 2)}\n`);
    console.log(`Wrote ${outputPath} with ${districts.length} voting districts.`);
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
