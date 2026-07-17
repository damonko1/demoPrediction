# Data Accuracy Requirements

This project now has calculation-ready state-level historical presidential baselines for 2000, 2004, 2008, 2012, 2016, 2020, and 2024. Demographic slider weights remain illustrative simulation inputs, and county-level results remain blocked until reconciliation and population matching are complete.

Before a real election, county, historical, demographic, geography, or split-electoral-vote dataset powers calculations, the dataset must include source metadata and validation notes.

## Required Source Metadata

Every calculation-ready dataset must record:

- Source name
- Source URL or local source file path
- Data vintage or election year
- Retrieval date
- Cleaning or transformation notes
- Validation summary

## Accuracy Gates

- Election returns must reconcile to certified or widely trusted published totals before they power calculations.
- County and historical presidential data must document county/FIPS changes, missing counties, third-party handling, and rounding.
- County-level map data must reconcile county FIPS/name records against a documented population source before it powers a county map.
- Age, education, race, and ethnicity data must use source-defined categories unless every recode is documented.
- Urban/suburban/rural data must name the classification method before it powers a slider or map layer.
- Maine and Nebraska district data must model statewide electoral votes separately from congressional district electoral votes.
- Race/ethnicity data must be labeled as aggregate demographic context, not individual voter behavior.

## Current MVP Data Status

| Dataset | Status | Allowed use | Validation note |
| --- | --- | --- | --- |
| Historical presidential state baselines, 2000-2024 | Calculation-ready | State-level historical baseline selection and scenario calculations | MIT state-level source covers 51 state/DC records per requested year; EV sums validate to 538 |
| Maine/Nebraska split EV units | Calculation-ready for EV allocation | Electoral-vote allocation in state scenarios | Statewide at-large EVs are modeled separately from congressional district EVs |
| County presidential returns, 2000-2024 | Blocked until reconciled | Source exploration and validation only | Initial validation found county-to-state mismatches; county population/FIPS matching is not complete |
| MVP state baseline margins | Illustrative demo | Current simulation playground only | Not reconciled to certified or published election totals |
| State map shapes | Calculation-ready for rendering | State-level map geometry | Local validation confirms 51 state/DC map IDs match the 51 baseline records |

See `docs/historical-data-validation.generated.json` for the generated validation report.

## Legislative Data Status

The legislative simulator has a separate data foundation inventory in `docs/legislative-data-foundation.md`. Current generated legislative baselines cover 435 House voting districts and 100 Senate seats using MIT congressional election returns and a `unitedstates/congress-legislators` roster snapshot. The House map also has a Census 2025 119th Congressional District cartographic boundary asset for all 435 voting districts. These datasets are suitable for the current sourced-result simulation baseline, and `npm run validate:legislative-data` plus `npm run validate:house-map` validate seat counts, source metadata, stable IDs, Senate classes, party totals, House geometry IDs, delegate separation, edge-case flags, and missing required fields. The legislative layer should not be called complete until incumbency/open-seat fields, official cross-source reconciliation, cross-cycle redistricting relationship files, and district/state partisan baselines are added and validated.

See `docs/legislative-data-validation.generated.json` for the current legislative validation report.

## Later Data Checklist Rule

Do not check off a Later Data item in `feature-checklist.md` until the cleaned data exists in the project, source metadata is recorded, and a validation pass confirms the dataset against its stated source.
