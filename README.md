# Election Scenario Playground

[![Quality gate](https://github.com/damonko1/demoPrediction/actions/workflows/ci.yml/badge.svg)](https://github.com/damonko1/demoPrediction/actions/workflows/ci.yml)
[![Live site](https://img.shields.io/badge/live-GitHub%20Pages-0969da)](https://damonko1.github.io/demoPrediction/)

[Open the live simulator](https://damonko1.github.io/demoPrediction/)

An interactive, browser-based lab for exploring how election assumptions can change the presidential, House, and Senate map.

Election Scenario Playground turns national swing and local race assumptions into immediate visual results. The default experience focuses on the 2026 House midterms, with Senate and historical presidential workspaces alongside it. Start from a sourced historical baseline, apply a preset or build a custom scenario, then inspect which states and seats move—and why. Scenarios are encoded in the URL, so an interesting map can be shared without creating an account.

> [!IMPORTANT]
> This is an educational scenario simulator, not a polling average, election forecast, or statement about voter behavior. Presets and demographic weights are transparent stress-test assumptions. Read the [data accuracy policy](docs/data-accuracy.md) before interpreting or extending the model.

## Highlights

- **Three connected workspaces:** Explore House and Senate midterm scenarios, with historical presidential replay available for context.
- **Historical replay:** Use calculation-ready state presidential baselines for every election from 2000 through 2024.
- **Interactive election maps:** Inspect all 538 electoral votes, 435 voting House districts, and 100 Senate seats with margin-based color intensity.
- **Real-time scenario controls:** Adjust national swing and demographic-style assumptions and see the map, counters, summaries, and pressure points update immediately.
- **One-click stress tests:** Try youth-turnout, suburban-shift, rural-surge, low-turnout, and popular-vote/Electoral College split scenarios.
- **Local overrides:** Apply state, district, or Senate-race adjustments to explore outcomes that a national model cannot capture.
- **Decision context:** Review flipped states, tipping-point rankings, paths to 270, largest assumption effects, and a deterministic Monte Carlo uncertainty stress test.
- **Save and share:** Copy a scenario URL, bookmark named scenarios locally, export a scenario card as SVG or PNG, or export the presidential map as PNG.
- **Progressive disclosure:** The map and essential outcome lead; customization, sharing, comparison, methodology, and stress testing remain available on demand.
- **Accessible controls:** Keyboard-friendly native inputs, visible focus states, descriptive labels, and light and dark themes.
- **Transparent data notes:** Model explanations and dataset readiness labels distinguish sourced baselines from illustrative assumptions.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20.9 or newer (required by Next.js 16)
- npm
- Python 3 only if you plan to use the included `npm run start` static-file server

### Install and run

```bash
git clone https://github.com/damonko1/demoPrediction.git
cd demoPrediction
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run typecheck
npm run lint
npm test
npm run validate:launch
npm run build
npm run start
```

The project uses Next.js static export. `npm run build` writes the deployable site to `out/`; `npm run start` serves that generated directory at [http://localhost:3000](http://localhost:3000). The `out/` directory can be deployed to a static host.

## User Guide

1. **Choose a chamber.** Use House, Senate, or History to switch workspaces. House is the launch default; History contains presidential replay rather than a current forecast.
2. **Pick a baseline.** House uses the 2024 result baseline, Senate uses the latest completed race baselines, and History supports presidential election years from 2000–2024.
3. **Set the broad environment.** Move the national swing control toward Democrats or Republicans. Results and margins update as you drag.
4. **Try a preset or tune the electorate.** Open the scenario presets for a quick stress test, or expand the demographic-style controls to adjust individual inputs. Vote-shift controls label their partisan direction; turnout controls show higher or lower participation and use the model's state-specific sensitivities.
5. **Inspect the map.** Select a state, House district, or Senate seat to see its baseline, simulated margin, major drivers, and available local overrides. Darker fills indicate larger modeled margins, not greater certainty.
6. **Read the analysis when needed.** Open **Advanced analysis and methodology** for summaries, pressure points, sensitivity, and Monte Carlo stress testing. Monte Carlo output is an uncertainty exercise—not a win-probability forecast.
7. **Save or share.** Open **Share, save, reset, and compare chambers** to copy the current link, save a named browser-local scenario, or export an SVG/PNG card. Anyone opening a shared URL receives the encoded scenario state.
8. **Reset when needed.** Reset controls return the relevant assumptions and overrides to their neutral baseline.

## How the Model Works

At a high level, the presidential simulation applies national and state-weighted adjustments to a selected historical margin:

```text
simulated margin = baseline margin
                 + national swing
                 + sum(demographic input × state sensitivity)
                 + local override
```

House and Senate workspaces use analogous chamber-specific swing, structural sliders, and state/seat overrides. Maine and Nebraska are modeled with separate statewide and congressional-district electoral-vote units.

The historical presidential baselines are generated from MIT Election Data and Science Lab state returns. Current legislative baselines use MIT Election Data and Science Lab House and Senate returns plus the `unitedstates/congress-legislators` roster. Map geometry comes from local state and Census congressional-district assets. See [data accuracy](docs/data-accuracy.md) and the [legislative data foundation](docs/legislative-data-foundation.md) for sources, readiness, and known limitations.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Application | Next.js 16 with static export |
| UI | React 19, TypeScript, CSS Modules, global CSS |
| Icons | Lucide React |
| Maps | React-rendered SVG using local state and congressional-district geometry |
| Data tooling | Node.js scripts, `d3-geo`, and `shapefile` for build-time map/data preparation |
| Quality | Vitest, ESLint, and TypeScript type checking |

The runtime has no API server or database. Scenario links use URL parameters, while named bookmarks are stored in the browser.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm test` | Run the Vitest suite once |
| `npm run build` | Create the static production export in `out/` |
| `npm run start` | Serve the built `out/` directory on port 3000 |
| `npm run build:historical-data` | Regenerate historical presidential data |
| `npm run build:house-map` | Regenerate the House district map asset |
| `npm run build:legislative-data` | Regenerate House and Senate baseline data |
| `npm run validate:state-map` | Validate state/DC map coverage and related records |
| `npm run validate:house-map` | Validate House district geometry coverage |
| `npm run validate:legislative-data` | Validate legislative records and source metadata |
| `npm run validate:launch` | Validate the pre-launch product contract and regression guardrails |

## Repository Guide

```text
src/app/          Next.js entry point and global styles
src/components/   Simulation workspaces, maps, controls, and analysis panels
src/data/         Generated baselines, presets, and data-readiness metadata
src/lib/          Scenario calculations, sensitivity, sharing, and persistence
public/           Static state and House map geometry plus brand assets
scripts/          Dataset/map build and validation tools
docs/             Methodology, accuracy, and implementation notes
```

## Data and Interpretation

- Treat large slider values as counterfactual stress tests, not plausible forecasts.
- A simulated margin measures the model output under selected assumptions; it does not express confidence.
- Demographic-style sliders use aggregate sensitivity assumptions and must not be interpreted as claims about individual voters.
- County-level and additional demographic datasets remain excluded from calculations until their source and reconciliation requirements are met.
- Before publishing analysis made with this tool, disclose the baseline year, assumptions, and any local overrides.

## Contributing

Issues and focused pull requests are welcome. For changes to source data or model behavior, include source metadata, validation notes, and tests. Before opening a pull request, run:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run validate:state-map
npm run validate:house-map
npm run validate:legislative-data
npm run validate:launch
```
