# Pre-Launch Release Operations

Last updated: 2026-08-26

This runbook owns the operational decisions required by the pre-launch PRD. It applies to the release-candidate branch and to the eventual merge into `main`.

## Release Baseline

The simplified House-first interface is the release-candidate baseline. Pre-launch changes may fix correctness, accessibility, performance, content, or reliability issues. New permanent panels, navigation destinations, live-data dependencies, accounts, and additional display modes remain deferred.

## Data Freeze Decision

Launch does not require an unverified 2026 candidate dataset. House scenarios use the labeled 2024 result baseline; Senate scenarios use latest-completed race baselines; presidential results are historical replay. Generated data must pass all three repository validators.

A source refresh becomes release-blocking only if:

- an existing displayed source date or contest identity is false;
- a baseline record fails validation;
- a named candidate is described as current without a validated source and date; or
- the public product claim changes to include current polling or comprehensive 2026 candidates.

## Analytics Decision

Analytics are omitted from the initial launch. The static application collects no political preferences, scenario labels, or personally identifying scenario content. Early evaluation uses structured testing and repository issue reports. Analytics require a separate privacy review before introduction.

## Supported Browsers

The supported release matrix is:

| Platform | Support target |
| --- | --- |
| Chrome and Edge desktop | Current and previous stable major |
| Firefox desktop | Current and previous stable major |
| Safari on macOS | Current and previous major macOS release |
| Safari on iPhone/iPad | Current and previous major iOS/iPadOS release |
| Chrome on Android | Current stable major |

The minimum supported viewport is 320 CSS pixels. JavaScript, SVG, Canvas, `URLSearchParams`, and browser-local storage must be available. If clipboard access is denied, copy functions must use their provided fallback or report failure clearly.

Before merging a release candidate, run the primary House, Senate, and History journeys in Chromium plus at least one WebKit/Safari environment. Firefox-specific failures are release blockers when they affect the primary simulation loop.

## Ownership

- **Release decision:** repository maintainer
- **Data validation:** repository maintainer running the committed validators
- **Deployment:** GitHub Actions using the Pages environment
- **Production monitoring:** repository maintainer for the launch window
- **Rollback decision:** repository maintainer

No runtime API, database, scheduled ingestion job, or third-party analytics system requires a separate operator.

## Severity Policy

### Severity 1 — launch blocking

- Site unavailable or blank
- House, Senate, or History cannot load
- Scenario calculations fail or corrupt shared state
- Material baseline or result misrepresentation
- Keyboard or mobile users cannot complete the primary simulation loop
- High- or critical-severity production vulnerability

### Severity 2 — launch blocking unless explicitly accepted

- Sharing, reset, local overrides, or export fails in supported browsers
- Persistent horizontal overflow at a supported width
- Advanced analysis or methodology is inaccessible
- Serious contrast, focus, labeling, or navigation defect
- Repeated uncaught console error in a primary journey

### Severity 3 — may ship with documentation

- Cosmetic inconsistency
- Non-blocking secondary-copy issue
- Minor layout defect outside the primary journey
- Enhancement request or deferred analytical capability

No unresolved severity-one or severity-two issue may ship.

## Release Procedure

1. Confirm the release commit is on a feature branch and the worktree is clean.
2. Run `npm ci` from a clean checkout.
3. Run lint, type checking, all tests, all data validators, the launch validator, dependency audit, and both static builds.
4. Complete the browser acceptance matrix in `docs/prelaunch-release-evidence.md`.
5. Review public language, baseline dates, data flags, and export output.
6. Merge only the reviewed release candidate into `main`.
7. Watch both the Quality Gate and Deploy GitHub Pages workflows through completion.
8. Smoke-test the public URL without query parameters and with a known shared scenario URL.
9. Record the deployed commit and workflow links in the release evidence.

## Launch Monitoring

For the first hour after deployment:

- verify the public URL after GitHub Pages cache turnover;
- test House, Senate, and History once from production;
- inspect GitHub Actions and Pages deployment status;
- test one shared URL and both scenario-card formats; and
- review new repository reports for severity-one or severity-two failures.

Repeat the production smoke test after 24 hours. Because the application is static and has no telemetry or server, monitoring is availability- and report-based.

## Rollback

If a severity-one issue appears after merge:

1. Identify the last verified production commit from the release evidence.
2. Create a normal revert commit for the faulty release; do not rewrite `main` history.
3. Push the revert to `main` and watch both workflows.
4. Verify the public URL and known scenario link after deployment.
5. Document the issue before attempting a replacement release.

GitHub Pages retains workflow and deployment history, but the repository revert is the authoritative, reproducible rollback path.
