# Election Scenario Playground: Pre-Launch Product Requirements

Status: Draft for product review  
Owner: Product  
Last updated: 2026-08-26  
Target readiness window: Early October 2026  
Branch: `docs/prelaunch-product-prd`

## 1. Product Decision

Election Scenario Playground will launch as a focused, educational tool for exploring how political assumptions could change control of the U.S. House and Senate. Historical presidential scenarios remain available as a supporting mode, not as the lead product.

The launch experience must feel like one clear activity:

> Choose a chamber, adjust a small number of assumptions, and see which contests and control outcomes change.

The platform may retain sophisticated analysis, sharing, and local customization, but those capabilities must not compete with the primary simulation loop. Depth is revealed when a user asks for it.

## 2. Problem

The product has enough capability to be useful, but capability has previously been represented as interface volume. Multiple chamber summaries, model diagnostics, sharing tools, detailed metadata, local overrides, portraits, and display options appeared with similar visual importance.

This created four risks:

1. New users could not immediately identify what to do.
2. The map and election outcome—the product's strongest assets—were visually diluted.
3. Historical data and heuristic scenarios could be mistaken for a live forecast.
4. Mobile users had to pass secondary controls before reaching the core experience.

Pre-launch work must reduce these risks without deleting the expert capabilities that make the simulator credible and reusable.

## 3. Goals

### Primary goals

- Make the first useful interaction understandable without instructions.
- Make House and Senate midterm exploration the unmistakable product focus.
- Keep the map, active outcome, and primary assumptions above secondary analysis.
- Ensure users understand that outputs are scenarios rather than calibrated forecasts.
- Provide a complete, usable experience on desktop and mobile.
- Preserve advanced capabilities through progressive disclosure.
- Reach a stable release candidate early enough for testing before October 2026.

### Success definition

A first-time user should be able to land on the site, understand the selected chamber, change an assumption, see the map and chamber outcome respond, inspect a competitive contest, and reset or share the scenario without external guidance.

## 4. Non-Goals for Initial Launch

The initial launch will not attempt to become:

- A polling average or real-time election news service
- A calibrated probability forecast
- A complete 2026 candidate database
- A campaign-management or voter-targeting system
- A social network or public scenario marketplace
- An account-based cloud workspace
- A mobile-native application
- A replacement for primary election-data sources

Features that imply these promises must not be added before launch unless the product boundary is formally changed.

## 5. Target Users

### Primary: politically curious students and voters

They want to understand which assumptions matter and which seats could determine control. They need plain language, immediate feedback, and no requirement to understand modeling terminology.

### Secondary: educators, journalists, and election enthusiasts

They want to demonstrate scenarios, inspect individual races, compare outcomes, and share a reproducible state. They benefit from methodology and advanced analysis but do not need it permanently visible.

### Not targeted at launch: professional campaign analysts

The product does not provide the polling, fundraising, turnout-file, or continuously updated candidate infrastructure expected by professional campaign operations.

## 6. Core User Journey

The default journey must follow this order:

1. **Orient:** See the product name, scenario disclaimer, selected chamber, baseline, and current chamber balance.
2. **Explore:** View the map and identify competitive contests.
3. **Adjust:** Change national swing or a small set of clearly labeled assumptions.
4. **Understand:** See the chamber counter, map, and selected contest update together.
5. **Inspect:** Select a state, district, or Senate race for local context.
6. **Deepen if desired:** Open customization, comparison, methodology, or stress-testing disclosures.
7. **Keep or share:** Copy a validated URL, export a card, or save locally.

No optional feature may interrupt steps 1–4.

## 7. Information Architecture

### Primary navigation

The required order is:

1. House — `435 seats`
2. Senate — `100 seats`
3. History — `President`

“President” must not return as the default or first navigation item before launch. Historical presidential exploration must remain visibly distinct from current-cycle midterm scenarios.

### Page hierarchy

Each chamber workspace must use this hierarchy:

1. Chamber navigation and one theme action
2. Active scenario identity and active assumption summary
3. Essential outcome counter
4. Interactive map
5. Selected-contest context
6. Primary assumptions
7. Optional customization and analysis
8. Supporting data and methodology

On mobile, the map must appear before selected-contest detail and optional analysis. Secondary content must never create horizontal overflow.

## 8. Required Default Experience

### 8.1 Header and navigation

- Use the name **Election Scenario Playground**.
- State that the experience models scenarios rather than predicting results.
- Default to the House workspace on a bare URL.
- Preserve explicit and legacy scenario URLs.
- Present one theme toggle; do not present separate Light, Dark, and Focus Map choices.
- Do not restore Focus Map. The default workspace itself must prioritize the map.

### 8.2 Active scenario strip

The always-visible summary must contain only:

- Active chamber or historical mode
- Baseline identity
- Active preset, if applicable
- Material assumptions that differ from the baseline

It must not permanently show all three chamber outcomes, save controls, export controls, or comparison tools.

### 8.3 Outcome counter

The default counter must show:

- Democratic and Republican totals
- Control threshold
- Clear balance visualization
- Control or tie status in plain language

Vacancies, cycle counts, special handling, and similar metadata belong under **More chamber details** or **More electoral vote details**.

### 8.4 Map

- The map is the primary visualization and must receive the largest useful workspace area.
- Hover, focus, and selection states must be distinguishable.
- Keyboard navigation must remain supported.
- Competitive and data-limited contests must not be represented with misleading precision.
- House coverage and data-quality records belong under **Map coverage and data flags**.

### 8.5 Primary assumptions

- Show only inputs that create an understandable, material change in the active scenario.
- Use plain-language labels and brief contextual help.
- Provide safe defaults and a visible reset path.
- Updating an input must produce timely feedback in the map and outcome counter.
- Avoid duplicating the same assumption in multiple permanent panels.

### 8.6 Selected-contest detail

The default selected-contest view must prioritize:

- Contest identity
- Baseline result or margin
- Current scenario result or margin
- Competitiveness or control relevance
- Important data-quality caveats

Local overrides belong under **Customize this district/race** or **Customize this state**. Portraits and biographical information belong under **Member profile and seat context**.

## 9. Progressive Disclosure Requirements

The following capabilities must remain available but closed by default:

| Disclosure | Contents |
| --- | --- |
| Share, save, reset, and compare chambers | Copy URL, export card, reset all, cross-chamber comparison, named local scenarios |
| More chamber details | Vacancies, seats in cycle, flags, threshold detail, and supporting totals |
| More electoral vote details | Supporting electoral-vote totals and special handling |
| Map coverage and data flags | Coverage, source, delegate handling, and known limitations |
| Customize this district/race | Local assumptions and district or active-race overrides |
| Customize this state | Presidential state override controls |
| Member profile and seat context | Portrait and secondary member information |
| Advanced analysis and methodology | Comparison, Monte Carlo, sensitivity, share preview, and methodology |

Rules for disclosures:

- Labels must describe the result of opening them, not use generic “More” or “Advanced” alone.
- Closed disclosures must not reserve large blank areas.
- Core status and blocking warnings must never be hidden.
- Disclosure state does not need to persist between visits for launch.
- Opening advanced analysis must not move or resize the map unpredictably on desktop.

## 10. Content and Trust Requirements

- Use “scenario,” “baseline,” “estimate,” or “simulation” instead of “forecast” when no calibrated forecast exists.
- Clearly identify the source year and type of every baseline.
- Distinguish completed results from current-cycle information.
- Surface low-data and heuristic limitations near the affected contest.
- Keep methodology accessible from every chamber mode.
- Avoid probability language unless the displayed value is supported by a documented probabilistic model.
- Do not imply that a named candidate is current without a validated source and date.

## 11. Functional Requirements

### Required for launch

- Working House, Senate, and historical presidential simulations
- National swing controls and curated presets
- State, district, and active Senate-race overrides
- Responsive chamber maps and counters
- Competitive-contest lists and paths to control
- Validated, shareable scenario URLs
- Local named scenarios
- Reset behavior at local and global levels
- SVG/PNG scenario-card export
- Light and dark themes
- Keyboard-operable maps and semantic controls
- Data-source, limitation, and methodology access
- Graceful handling of invalid or outdated URL parameters

### Optional only if stable before release freeze

- Additional curated presets
- Editorial examples or classroom prompts
- Minor export-card styling enhancements
- Additional non-blocking explanatory copy

### Deferred until after launch

- Accounts and cloud synchronization
- Public scenario galleries
- Comments, reactions, or other social features
- Live polling ingestion
- Automated news feeds
- Notifications
- Additional display modes
- More permanent dashboard panels
- New model controls without validated explanatory value

## 12. Usability and Visual Requirements

- One visually dominant object per viewport section.
- No more than one primary action per component group.
- Secondary actions must be visually quieter than simulation inputs.
- Color cannot be the sole indicator of party, control, selection, or warning state.
- Labels and values must remain legible at 200% browser zoom.
- Mobile layouts must work at 320 CSS pixels without horizontal page scrolling.
- Interactive targets should be at least 44 by 44 CSS pixels where practical.
- Motion must respect reduced-motion preferences.
- Empty, loading, and invalid-data states must explain what the user can do next.

## 13. Performance and Reliability Requirements

- Production dependency audit must report no known high- or critical-severity vulnerabilities.
- Type checking, linting, automated tests, and all data validators must pass.
- Static production build and configured base-path build must pass.
- No uncaught browser-console errors in the primary House, Senate, and History journeys.
- No horizontal overflow on supported mobile widths.
- Input-to-visible-update latency should feel immediate for standard controls; target under 100 ms on a typical laptop after initial load.
- Maps must remain usable during rapid slider interaction.
- Shared URLs must restore the represented scenario or fall back safely with a clear baseline.
- Deployment must use supported GitHub Pages actions and complete from a clean checkout.

## 14. Accessibility Requirements

- All functionality must be reachable by keyboard.
- Focus order must follow the visual and task hierarchy.
- Visible focus indicators are required.
- Tabs, disclosures, sliders, buttons, and maps must expose meaningful accessible names and state.
- Results that change after input must be understandable without relying only on color.
- Heading structure and landmark regions must remain logical.
- Light and dark themes must maintain readable contrast.

## 15. Analytics and Pre-Launch Evaluation

If privacy-respecting product analytics are added, measure only what informs simplification:

- Chamber selected
- First assumption changed
- Contest selected
- Disclosure opened by type
- Scenario shared or exported
- Reset used
- Client error category

Do not block launch on analytics. Do not collect political preferences, entered labels, or personally identifying scenario content without a separate privacy review.

Recommended moderated test tasks:

1. “Make a scenario where control of the House changes.”
2. “Find a district that becomes competitive and explain why.”
3. “Switch to the Senate and change one race.”
4. “Send someone a link to your scenario.”
5. “Find out what data the simulator is based on.”

Target: at least 4 of 5 first-time participants complete tasks 1–4 without intervention, and all participants can correctly explain that the result is a scenario rather than a forecast.

## 16. Launch Acceptance Criteria

The release candidate is approved only when all of the following are true:

- [ ] Bare URL opens House and presents a clear first action.
- [ ] House and Senate are visually primary; History is visibly secondary.
- [ ] Map and essential outcome appear before optional analysis on desktop and mobile.
- [ ] No cross-chamber cockpit or expanded expert analysis appears by default.
- [ ] Every advanced capability listed in Section 9 remains discoverable and functional.
- [ ] Scenario language and baseline dates are accurate throughout the interface and exports.
- [ ] Primary journeys pass keyboard, mobile, light-theme, and dark-theme review.
- [ ] Type checking, linting, tests, data validation, build, and dependency audit pass.
- [ ] Production deployment succeeds and public smoke testing passes.
- [ ] Known limitations are documented and none contradict the product's public claims.
- [ ] No unresolved severity-one or severity-two launch issue remains.

## 17. Release Guardrails

Before launch, reject or defer a proposed addition when any of these are true:

- It introduces a new permanent panel for a secondary task.
- It duplicates information already visible elsewhere.
- It makes President appear like the current-cycle primary mode.
- It adds model precision that the underlying data cannot support.
- It pushes the map or core assumptions farther down the mobile experience.
- It requires an account for a journey that currently works locally.
- It increases operational dependence without a documented owner and fallback.
- It cannot be explained in one sentence to the primary user.

When a useful feature fails only the hierarchy test, place it behind an existing disclosure before creating a new navigation destination.

## 18. Proposed Timeline

### By September 4: requirements freeze

- Approve this PRD and product boundary.
- Convert acceptance criteria into an issue backlog.
- Identify data updates that are truly required for launch.

### September 5–18: release-candidate implementation

- Complete remaining functional and content issues.
- Avoid adding new product surface area.
- Keep all application work on feature branches.

### September 19–25: structured validation

- Run moderated usability tasks.
- Complete accessibility, mobile, performance, and data review.
- Fix only launch blockers and high-value clarity problems.

### September 26–October 2: release freeze and launch candidate

- Complete regression testing and production rehearsal.
- Finalize source dates, limitation language, and operational checklist.
- Tag the approved release candidate.

### Early October: controlled launch

- Deploy the approved release.
- Perform production smoke tests.
- Monitor errors and collect structured feedback before midterm usage increases.

## 19. Open Product Decisions for the Next Goal

The next implementation goal should begin only after deciding:

1. Whether the current simplified build is the release-candidate baseline or needs another visual reduction pass.
2. Whether any 2026 candidate or race data must be refreshed before October.
3. Whether launch requires lightweight analytics or will use moderated feedback only.
4. Which browsers and devices form the official support matrix.
5. Who owns data review and production monitoring during the launch window.

These decisions should create a bounded pre-launch goal rather than reopen the entire product surface.
