# Election Forecast Playground

Election Forecast Playground is an interactive election simulation tool. It lets users adjust national swing and demographic-style assumptions, watch state colors and electoral vote totals update instantly, and inspect individual state results.

This is a simulation playground, not a prediction model. The goal is to make electoral mechanics easier to explore by turning assumptions into visual, clickable maps. President, House, and Senate are full simulation workspaces powered by public-result baselines, transparent stress-test assumptions, and shareable local overrides.

## Features

- State-level U.S. electoral map with margin-based color intensity
- Electoral vote counter with the 270 threshold
- National swing slider with instant recalculation
- Seven demographic-style sliders with state-specific sensitivity weights
- Scenario presets for youth turnout, suburban shift, rural surge, low turnout, and split-style stress tests
- Visible selected-preset state plus a compact active-settings overview
- Complete cross-chamber reset for national, state, district, and Senate-race assumptions
- Clickable and hoverable state details
- State detail panel showing the largest assumption effects for the selected state
- Small-state selector for compact Northeast states and DC
- Light aero mode and dark tactical mode
- Scenario summary showing flipped states and EV shifts
- Current-vs-baseline scenario comparison
- Deterministic Monte Carlo uncertainty stress test
- Sensitivity view for closest states, tipping points, and path-to-270 pressure
- Exportable state map PNG
- Embed/share card preview with copyable iframe markup
- Named local scenario bookmarks backed by shareable URLs
- Official-source presidential and congressional portraits with accessible fallbacks
- Split electoral vote handling for Maine and Nebraska
- Full House and Senate simulation tabs with chamber counters, maps, local overrides, focused presets, member details, and control-path summaries

## Tech Stack

- Next.js
- React
- TypeScript
- CSS Modules
- SVG map rendering from local state boundary data

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev
npm run typecheck
npm run build
npm run start
```

## Public Deployment

The app is configured for static export. `npm run build` writes the deployable site to `out/`, and `npm run start` serves that static folder locally after a build. Deploy the `out/` directory to any static host.

## Model Note

The current model combines national swing with illustrative state-weighted demographic assumptions:

```text
simulated_margin = baseline_margin + national_swing + sum(demographic_slider_value * state_weight)
```

Starter margins and demographic weights are rounded and illustrative. The +/-15 controls and presets are stress tests, not real forecast claims. Maine and Nebraska now allocate statewide and congressional-district electoral votes as separate units.

## Data Accuracy

The data accuracy rules are documented in [docs/data-accuracy.md](docs/data-accuracy.md). Historical presidential and current legislative baselines record source metadata and validation status; demographic weights and preset values remain clearly labeled illustrative stress-test assumptions.
