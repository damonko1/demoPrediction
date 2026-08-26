# Pre-Launch Release Evidence

Status: Release-candidate evidence  
Branch: `docs/prelaunch-product-prd`  
Last updated: 2026-08-26

Verified commit: `b314e39`

Clean-checkout quality gate: [GitHub Actions run 32997013552](https://github.com/damonko1/demoPrediction/actions/runs/32997013552) — passed

This matrix maps the pre-launch PRD to authoritative source, automated, build, and runtime evidence. Production deployment remains intentionally gated on review and merge into `main`.

## Acceptance Matrix

| PRD acceptance requirement | Status | Evidence |
| --- | --- | --- |
| Bare URL opens House with a clear first action | Pass | Browser opened `/` into the House tab; active strip identified the 2024 result baseline and the House swing control was available. URL parser tests cover the bare landing. |
| House and Senate primary; History secondary | Pass | Navigation and cross-chamber export order are House, Senate, History. `npm run validate:launch` enforces the order. |
| Map and essential outcome before optional analysis | Pass | At 320px, House map top was 749px, selected detail 2122px, controls 2601px, and optional analysis 3029px. No disclosure was open. |
| No permanent cross-chamber cockpit or expert analysis | Pass | Cross-chamber tools and analysis are closed native disclosures. Runtime audit found zero open disclosures on House, Senate, and History defaults. |
| Advanced capabilities discoverable and functional | Pass | Runtime accessibility snapshots exposed every named disclosure. SVG and PNG card downloads both completed successfully. Existing controls expose local overrides, sources, saved scenarios, comparison, sensitivity, Monte Carlo, and methodology. |
| Scenario language and source dates accurate | Pass | Header explicitly says “Scenario simulator — not a forecast.” House identifies the 2024 result baseline, Senate identifies latest-completed race baselines, and History identifies the selected result year. Data validators pass. |
| Keyboard, mobile, light, and dark review | Pass in Chromium | Tabs support arrow-key selection and focus. House-map ArrowRight moved focus and selection from PA-7 to PA-8. Light/dark toggle updated its accessible label. At 320px all non-SVG interactive targets reached 44px in both dimensions and the page had zero horizontal overflow. |
| Quality, data, build, and security gates | Pass | ESLint, TypeScript, 37 tests, state/Senate map validation, House map validation, legislative data validation, launch-contract validation, local static build, base-path build, and production dependency audit all passed. Audit reported zero vulnerabilities. |
| Production deployment and public smoke test | Pending merge | The branch is intentionally isolated and has not replaced the public `main` deployment. The Pages workflow uses supported actions and the base-path artifact builds successfully. |
| Known limitations consistent with public claims | Pass | `docs/data-accuracy.md`, `docs/launch-readiness-audit.md`, the PRD, and release runbook define completed-result baselines, heuristic limits, and non-goals. |
| No unresolved severity-one or severity-two issue | Pass for audited branch | No blocking issue remains from source, automated, data, build, security, or Chromium runtime review. Cross-browser production checks remain a release-procedure gate. |

## Functional Capability Matrix

| Required capability | Evidence |
| --- | --- |
| House simulation | House loaded by default; swing update changed active settings and chamber totals. |
| Senate simulation | Senate tab loaded with its 100-seat counter, state map, assumptions, selected race, and advanced disclosure. |
| Historical presidential simulation | History loaded with electoral counter, map, state selection, historical baseline controls, and advanced disclosure. |
| National swing and presets | Native sliders and closed preset disclosures are present in every relevant workspace. |
| State, district, and Senate-race overrides | URL round-trip tests and local-override tests pass; customization disclosures remain available. |
| Responsive maps and counters | 320px House, Senate, and History audits produced zero horizontal overflow. |
| Competitive contests and paths to control | Legislative and presidential summary components remain under advanced analysis. |
| Validated share URLs | URL tests cover round trips, malformed values, bounded values, legacy links, and malformed-tab House fallback. |
| Local named scenarios | Bookmark persistence tests pass; browser UI exposes save, load, and delete states. |
| Local and global reset | Chamber reset controls and consolidated Reset all remain available; default state correctly disables reset. |
| SVG/PNG card export | Both files downloaded through the browser from the consolidated tools disclosure. |
| Light and dark themes | Runtime toggle moved from `light` to `dark` and changed its label to “Use light mode.” |
| Keyboard maps and semantic controls | Tab semantics, named controls, visible focus CSS, and map arrow navigation verified. |
| Sources, limitations, and methodology | Data flags and advanced methodology disclosures are present in every workspace. |
| Invalid and outdated URL handling | New malformed-link tests pass; a malformed runtime URL returned to House, neutral assumptions, PA-7, and the labeled baseline without errors. |

## Runtime Measurements

| Measurement | Result |
| --- | --- |
| Chromium viewport | 320 × 800 CSS pixels |
| Horizontal overflow | 0px in House, Senate, and History |
| Closed disclosures on default load | 0 open |
| House swing visible-update latency | 30.6ms over two animation frames |
| Browser console | 0 errors, 0 warnings in audited journeys |
| Non-SVG mobile target minimum | 44 × 44 CSS pixels after remediation |
| Export output | 1200 × 630 SVG and PNG downloads |

## Automated Gate

The CI quality gate runs:

1. dependency installation from the lockfile;
2. lint;
3. TypeScript;
4. all Vitest tests;
5. all map and legislative-data validators;
6. the pre-launch product-contract validator; and
7. the production static build.

The quality workflow also supports manual dispatch so the feature branch can be tested from a clean GitHub checkout before a pull request or merge. Run `32997013552` passed every job for the verified implementation commit.

## Remaining Release Actions

These are deployment controls, not missing branch implementation:

1. Review and merge the release-candidate branch.
2. Complete native Safari/WebKit confirmation on a supported environment; Playwright WebKit and Firefox are unavailable on the current macOS 12 ARM runtime.
3. Watch the clean-checkout Quality Gate and GitHub Pages deployment.
4. Smoke-test the deployed commit at the public URL and record its workflow links here.
5. Run the recommended moderated tasks with first-time users before the early-October launch window.
