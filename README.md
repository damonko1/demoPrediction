# Election Forecast Playground

Election Forecast Playground is an interactive Electoral College simulation tool. It lets users adjust a national swing assumption, watch state colors and electoral vote totals update instantly, and inspect individual state results.

This is a simulation playground, not a prediction model. The goal is to make electoral mechanics easier to explore by turning assumptions into a visual, clickable map.

## Features

- State-level U.S. electoral map with margin-based color intensity
- Electoral vote counter with the 270 threshold
- National swing slider with instant recalculation
- Clickable and hoverable state details
- Small-state selector for compact Northeast states and DC
- Light aero mode and dark tactical mode
- Scenario summary showing flipped states and EV shifts

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

## Model Note

The current MVP uses a uniform national swing model:

```text
simulated_margin = baseline_margin + national_swing
```

Starter margins are rounded and illustrative. Maine and Nebraska are modeled as winner-take-all in this build.
