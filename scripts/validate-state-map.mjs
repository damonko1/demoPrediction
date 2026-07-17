import { readFile } from "node:fs/promises";

const stateMapPath = "public/us-states-albers-10m.json";
const generatedDataPath = "src/data/legislativeData.generated.ts";

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

const [mapText, generatedText] = await Promise.all([
  readFile(stateMapPath, "utf8"),
  readFile(generatedDataPath, "utf8"),
]);
const topology = JSON.parse(mapText);
const geometries = topology.objects?.states?.geometries ?? [];
const shapeIds = geometries.map((geometry) => String(geometry.id).padStart(2, "0"));
const senateShapes = shapeIds.filter((id) => id !== "11");
const senateSeats = extractGeneratedJson(generatedText, "senateSeatBaselines");
const senateStateCodes = new Set(senateSeats.map((seat) => seat.stateCode));

assert(topology.type === "Topology", "State map must be TopoJSON topology");
assert(geometries.length === 51, `Expected 50 states plus DC, got ${geometries.length}`);
assert(new Set(shapeIds).size === 51, "State map contains duplicate FIPS shape IDs");
assert(senateShapes.length === 50, `Expected 50 Senate state shapes, got ${senateShapes.length}`);
assert(senateStateCodes.size === 50, `Expected 50 Senate states, got ${senateStateCodes.size}`);
assert(
  [...senateStateCodes].every(
    (stateCode) => senateSeats.filter((seat) => seat.stateCode === stateCode).length === 2,
  ),
  "Every Senate map state must have exactly two seat records",
);

console.log("State and Senate map validation passed.");
