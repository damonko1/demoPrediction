import { readFile } from "node:fs/promises";
import path from "node:path";

const assetPath = path.resolve("public/us-house-districts-119-20m.json");
const legislativeDataPath = path.resolve("src/data/legislativeData.generated.ts");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getHouseBaselineText(generatedText) {
  const start = generatedText.indexOf("export const houseDistrictBaselines = [");
  const end = generatedText.indexOf(
    "] as const satisfies readonly HouseDistrictBaseline[];",
    start,
  );

  assert(start >= 0, "Could not find houseDistrictBaselines export");
  assert(end > start, "Could not find end of houseDistrictBaselines export");

  return generatedText.slice(start, end);
}

function getHouseBaselineIds(generatedText) {
  return [
    ...getHouseBaselineText(generatedText).matchAll(/"id": "([A-Z]{2}-(?:AL|\d{2}))"/g),
  ].map((match) => match[1]);
}

function getDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();

  values.forEach((value) => {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  });

  return [...duplicates].sort();
}

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value)).sort();
}

const asset = JSON.parse(await readFile(assetPath, "utf8"));
const generatedText = await readFile(legislativeDataPath, "utf8");
const baselineIds = getHouseBaselineIds(generatedText);
const districtIds = asset.districts.map((district) => district.id);

assert(asset.source?.name, "Map asset is missing source name");
assert(asset.source?.url, "Map asset is missing source URL");
assert(asset.source?.retrievalDate, "Map asset is missing retrieval date");
assert(asset.source?.vintage, "Map asset is missing data vintage");
assert(asset.viewBox?.length === 4, "Map asset is missing a four-number viewBox");
assert(asset.districts.length === 435, `Expected 435 voting map districts, got ${asset.districts.length}`);
assert(baselineIds.length === 435, `Expected 435 House baselines, got ${baselineIds.length}`);
assert(getDuplicates(districtIds).length === 0, `Duplicate map district IDs: ${getDuplicates(districtIds).join(", ")}`);
assert(getDuplicates(baselineIds).length === 0, `Duplicate baseline district IDs: ${getDuplicates(baselineIds).join(", ")}`);
assert(
  difference(baselineIds, districtIds).length === 0,
  `Map is missing baseline IDs: ${difference(baselineIds, districtIds).join(", ")}`,
);
assert(
  difference(districtIds, baselineIds).length === 0,
  `Map has IDs not in baseline data: ${difference(districtIds, baselineIds).join(", ")}`,
);
assert(
  asset.nonVotingDelegateDistricts.length === 2,
  `Expected 2 separately labeled delegate districts, got ${asset.nonVotingDelegateDistricts.length}`,
);
assert(
  asset.nonVotingDelegateDistricts.every((district) => ["DC-AL", "PR-AL"].includes(district.id)),
  "Delegate records must be limited to DC-AL and PR-AL",
);
assert(
  asset.districts.every((district) => !["DC", "PR"].includes(district.stateCode)),
  "Voting district map must not include non-voting delegate districts",
);
assert(
  asset.districts.every((district) => typeof district.path === "string" && district.path.length > 0),
  "Every voting district needs a projected SVG path",
);
assert(
  asset.districts.every((district) =>
    [district.labelX, district.labelY, ...district.bounds].every(Number.isFinite),
  ),
  "Every voting district needs finite label and bounds coordinates",
);

console.log("House district map validation passed.");
