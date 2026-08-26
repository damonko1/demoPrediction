# Election Scenario Playground: Before and After

Last updated: 2026-08-26

This document records the complete launch-readiness and design-simplification pass.

## Product Positioning

| Prior state | Current state |
| --- | --- |
| Product was named **Election Forecast Playground**, despite not being a calibrated forecast. | Product is named **Election Scenario Playground** throughout the UI, metadata, embeds, exported cards, README, and social preview. |
| First visit opened the 2024 presidential workspace. | First visit opens the 2026 House midterm workspace. |
| President appeared as the first and primary mode. | Navigation leads with **House**, then **Senate**; presidential scenarios are labeled **History**. |
| Baseline language could look like a current prediction. | The UI distinguishes a 2024 House-result baseline, latest-completed Senate race baselines, and historical presidential result baselines. |
| A campaign-tagged URL could accidentally open President. | Unrelated query parameters preserve the House landing; legacy presidential scenario URLs remain compatible. |

## Default Interface

| Prior state | Current state |
| --- | --- |
| A large cockpit showed President, House, and Senate results simultaneously. | The compact scenario strip identifies only the active scenario and current assumptions. Cross-chamber comparison is available on demand. |
| Copy, export, reset, and saved scenarios were all visible at the top. | These tools live in one disclosure: **Share, save, reset, and compare chambers**. |
| Full chamber metadata appeared below every seat counter. | The essential D/R result, control threshold, and balance bar remain visible; vacancies, flags, cycle counts, and other metadata are under **More chamber details**. |
| House map coverage, delegate handling, flags, and source occupied a permanent four-card row. | These records are retained under **Map coverage and data flags**. |
| Detailed sensitivity analysis and methodology were always rendered as prominent panels. | They are grouped under **Advanced analysis and methodology**. |
| Local state controls and district/race controls were always expanded in the selected-seat panel. | They are grouped under **Customize this district/race**. |
| Current-member portraits occupied prominent selected-seat space. | Portraits remain available inside **Member profile and seat context**. |
| Presidential state overrides were always expanded. | They are grouped under **Customize this state**. |
| Light mode, dark mode, and Focus Map consumed three control choices. | One theme toggle remains; Focus Map was removed because the core layout is map-first by default. |

## Responsive Flow

| Prior state | Current state |
| --- | --- |
| Mobile began with branding, multiple display controls, a large three-chamber summary, settings, and a detailed counter before the map. | Mobile begins with a compact chamber switcher, single theme action, short scenario strip, compact control counter, and then the map-first workspace. |
| Secondary analysis competed visually with the selected contest and controls. | The visual order prioritizes map, selected contest, primary assumptions, then optional analysis. |
| Advanced functions looked equally important to the main simulation loop. | Progressive disclosure separates **Explore**, **Customize**, and **Analyze** behaviors without deleting capabilities. |

## Launch Engineering and Reliability

| Prior state | Current state |
| --- | --- |
| Production dependency audit reported four high-severity advisories. | Next.js and affected transitive packages were upgraded; production audit reports zero known vulnerabilities. |
| GitHub Pages actions emitted deprecated Node-runtime warnings. | Pages actions use the current official major releases. |
| Existing tests did not cover the midterm-first landing and compatibility rule. | URL tests cover bare landing, campaign-tagged landing, explicit tabs, and legacy presidential links. |
| Launch status was spread across older planning notes. | `docs/launch-readiness-audit.md` contains the decision, issue register, evidence, accepted limitations, checklist, and operational recommendation. |
| Social preview still used the old forecast branding. | SVG and PNG social cards use the scenario branding and were visually verified. |

## Preserved Capabilities

The simplification did not remove the underlying product depth. The following remain available:

- President, House, and Senate simulation engines
- National swing controls and scenario presets
- State, district, and active Senate-race overrides
- Historical presidential replay
- Monte Carlo stress testing
- Scenario comparison and sensitivity analysis
- Paths to chamber control and competitive-seat rankings
- Current-member and candidate context
- Data-quality flags, source metadata, and methodology
- Shareable validated URLs
- Named browser-local scenarios
- SVG/PNG export and embed tools
- Keyboard map navigation, semantic controls, light/dark themes, and responsive layouts

## Deliberate Product Boundary

The platform is launch-ready as an educational scenario simulator. It is not presented as a polling average, calibrated win-probability forecast, or complete 2026 candidate model. Heuristic inputs, low-data races, completed-result baselines, and current-cycle candidate limitations remain explicitly documented.

