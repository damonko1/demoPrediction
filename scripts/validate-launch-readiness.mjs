import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function requireText(source, text, label) {
  if (!source.includes(text)) {
    throw new Error(`${label}: missing ${JSON.stringify(text)}`);
  }
}

function rejectText(source, text, label) {
  if (source.includes(text)) {
    throw new Error(`${label}: found forbidden ${JSON.stringify(text)}`);
  }
}

function requireOrder(source, values, label) {
  let previousIndex = -1;

  for (const value of values) {
    const index = source.indexOf(value, previousIndex + 1);
    if (index === -1 || index < previousIndex) {
      throw new Error(`${label}: expected ${values.map(JSON.stringify).join(" before ")}`);
    }
    previousIndex = index;
  }
}

const playground = read("src/components/Playground.tsx");
const unifiedSummary = read("src/components/UnifiedScenarioSummary.tsx");
const chamberCounter = read("src/components/ChamberCounter.tsx");
const electoralCounter = read("src/components/ElectoralCounter.tsx");
const houseMap = read("src/components/HouseDistrictMap.tsx");
const legislativeDetail = read("src/components/LegislativeDetailPanel.tsx");
const stateDetail = read("src/components/StateDetailPanel.tsx");
const legislativeWorkspace = read("src/components/LegislativeWorkspace.tsx");
const globalStyles = read("src/app/globals.css");
const playgroundStyles = read("src/components/Playground.module.css");
const metadata = read("src/app/layout.tsx");
const packageJson = JSON.parse(read("package.json"));
const ci = read(".github/workflows/ci.yml");
const deploy = read(".github/workflows/deploy-pages.yml");

requireText(playground, 'useState<SimulationTab>("house")', "House-first landing");
requireOrder(
  playground,
  [
    '{ id: "house", label: "House", detail: "435 seats"',
    '{ id: "senate", label: "Senate", detail: "100 seats"',
    '{ id: "president", label: "History", detail: "President"',
  ],
  "Primary navigation order",
);
requireText(playground, "Election Scenario Playground", "Product identity");
requireText(playground, "Scenario simulator — not a forecast", "Trust statement");
rejectText(playground, "isFocusMode", "Map-first layout");
rejectText(playground, "Focus map", "Map-first layout");

const disclosures = [
  [unifiedSummary, "Share, save, reset, and compare chambers"],
  [chamberCounter, "More chamber details"],
  [electoralCounter, "More electoral vote details"],
  [houseMap, "Map coverage and data flags"],
  [legislativeDetail, "Customize this"],
  [stateDetail, "Customize this state"],
  [legislativeDetail, "Member profile and seat context"],
  [legislativeWorkspace, "Advanced analysis and methodology"],
  [playground, "Advanced analysis and methodology"],
];

for (const [source, label] of disclosures) {
  requireText(source, label, "Progressive disclosure");
}

for (const source of [
  unifiedSummary,
  chamberCounter,
  electoralCounter,
  houseMap,
  legislativeDetail,
  stateDetail,
  legislativeWorkspace,
  playground,
]) {
  rejectText(source, "<details open", "Closed-by-default disclosures");
}

requireText(unifiedSummary, 'exportSnapshotCard("svg")', "SVG scenario-card export");
requireText(unifiedSummary, 'exportSnapshotCard("png")', "PNG scenario-card export");
requireText(globalStyles, "prefers-reduced-motion: reduce", "Reduced-motion support");
requireText(globalStyles, ":focus-visible", "Visible keyboard focus");
requireText(playgroundStyles, '.shell summary {', "Mobile disclosure targets");
requireText(playgroundStyles, "min-height: 44px", "Minimum touch targets");
requireText(playgroundStyles, '"tools-actions"', "Scenario tools row layout");
requireText(playgroundStyles, '"tools-results"', "Scenario results row layout");
requireText(playgroundStyles, '"tools-saved"', "Saved scenarios row layout");
requireText(metadata, 'applicationName: "Election Scenario Playground"', "Metadata identity");

if (packageJson.name !== "election-scenario-playground") {
  throw new Error("Package identity must use scenario rather than forecast");
}

for (const workflow of [ci, deploy]) {
  requireText(workflow, "actions/checkout@v6", "Supported checkout action");
  requireText(workflow, "actions/setup-node@v6", "Supported Node action");
}
requireText(deploy, "actions/configure-pages@v6", "Supported Pages configuration action");
requireText(deploy, "actions/upload-pages-artifact@v5", "Supported artifact action");
requireText(deploy, "actions/deploy-pages@v5", "Supported deploy action");

for (const documentationPath of [
  "docs/data-accuracy.md",
  "docs/launch-readiness-audit.md",
  "docs/prelaunch-product-requirements.md",
  "docs/release-operations.md",
]) {
  const documentation = read(documentationPath);
  if (documentation.trim().length < 200) {
    throw new Error(`${documentationPath} is missing or unexpectedly incomplete`);
  }
}

console.log("Launch-readiness contract validated.");
