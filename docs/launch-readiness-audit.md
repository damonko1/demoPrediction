# Launch Readiness Audit

Last updated: 2026-08-26

## Decision

The application is ready for a public **scenario-lab launch** once the current changes are deployed. It must be positioned as an educational simulator built on completed election results, not as a polling average, candidate forecast, or prediction of the 2026 outcome.

The first-run experience now opens the 2026 House workspace, explicitly labels its 2024-result baseline, and retains Senate and historical presidential replay as adjacent workspaces. Existing shared presidential links remain compatible.

## Audit Scope and Evidence

| Area | Evidence | Status |
| --- | --- | --- |
| Build and type safety | `npm run typecheck`, `npm run lint`, and static `npm run build` pass | Ready |
| Automated behavior | 35 Vitest tests cover calculations, normalization, URLs, overrides, presets, and bookmarks | Ready |
| Data integrity | State, House-map, and legislative-data validators pass; 538 EV, 435 voting districts, and 100 Senate seats reconcile | Ready with documented limitations |
| Security | Next.js upgraded to 16.3.3; `npm audit --omit=dev` reports zero vulnerabilities | Ready |
| Deployment | GitHub Pages returns HTTP 200; base-path production export references `/demoPrediction/` assets correctly | Ready after deploying current commit |
| Desktop UX | Browser QA at 1440×1000: House opens by default, controls and map render, no console errors | Ready |
| Mobile UX | Browser QA at 390×844: no horizontal overflow (`scrollWidth === innerWidth`), navigation and content reflow correctly | Ready |
| Accessibility | Native tabs/buttons/inputs, keyboard map instructions, skip link, visible labels, semantic regions, and text equivalents are present | Ready for launch; continue periodic manual testing |
| Sharing and persistence | URL state is bounded and validated; old presidential links remain compatible; local bookmarks fail safely | Ready |
| Failure handling | Map fetch failures and top-level React failures have visible fallbacks | Ready |

## Issue Register

### Resolved launch blockers

1. **Known high-severity dependency advisories** — Upgraded Next.js and vulnerable transitive packages; production audit is clean.
2. **Wrong first-run emphasis for a midterm launch** — Bare visits previously opened the 2024 presidential workspace. They now open the 2026 House workspace.
3. **Misleading product naming** — User-facing branding and metadata no longer call the simulator a forecast.
4. **Ambiguous baseline** — The active settings now distinguish a 2024 House result baseline, latest-completed Senate race baselines, and presidential replay years.
5. **Shared-link compatibility risk** — New links always encode their active workspace; legacy stateful links without a tab still open as presidential scenarios.

### Accepted launch limitations

These are not hidden defects. They define what version 1 is allowed to claim.

1. **No comprehensive 2026 candidate/filing model.** Current legislators and completed results provide context; candidate-quality and open-seat controls are user assumptions. Do not market candidate-level predictions.
2. **No polling average or probabilistic forecast.** Monte Carlo output is an uncertainty stress test around user inputs, not a calibrated win probability.
3. **Some legislative baselines are low-data or uncontested.** They are visibly flagged and surfaced in validation reports.
4. **Demographic and structural sliders are heuristic.** They remain labeled as such and should not be described as measured voter behavior.
5. **County mode remains intentionally excluded.** Reconciliation, FIPS matching, and population-source work are incomplete; excluding it is safer and simpler than launching an unreliable layer.
6. **Bookmarks are browser-local.** This is an intentional no-account MVP tradeoff; shared URLs provide cross-device portability.

## Launch Checklist

- [x] Midterm-first, usable first-run flow
- [x] Clear simulation-only positioning
- [x] Responsive desktop and mobile layouts
- [x] Keyboard-accessible primary controls
- [x] Shareable, validated scenario URLs
- [x] Production build and automated test gate
- [x] Data and geometry validation gate
- [x] Zero known production dependency vulnerabilities
- [x] Public static deployment path
- [ ] Deploy the current audited revision and smoke-test the public URL

## Operational Recommendation

Freeze new feature work before launch. Until election day, prioritize only current-cycle roster/data refreshes, factual copy corrections, accessibility regressions, broken links/assets, and defects in saving, sharing, or calculations. Re-run the full quality gate and public smoke test for every release.

