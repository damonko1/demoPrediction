# Legislative Data Foundation

Last updated: 2026-07-06

This document defines the public data needed for the House and Senate portions of Election Forecast Playground. The goal is a calculation-ready legislative layer: complete current rosters, clean election returns, stable geographic IDs, explicit incumbency and open-seat flags, transparent third-party handling, and source metadata that can be audited later.

The current app already has a first calculation baseline from MIT Election Data and Science Lab congressional results plus `unitedstates/congress-legislators` current roster data. The remaining work is mostly hardening: authoritative boundary ingestion, explicit tenure and incumbency fields, open-seat detection, presidential partisan baselines by district/state, and deeper historical comparison rules.

## Source Priority

Use the most official source that is still repeatable and machine-readable. When the official source is PDF-only, use a trusted machine-readable source for ingestion and validate against the official source.

| Area | Preferred source | Backup or validation source | Current repo status |
| --- | --- | --- | --- |
| Current House roster | Office of the Clerk member data, Congress.gov, Bioguide | `unitedstates/congress-legislators` | Uses `legislators-current.yaml`; validate counts against the Clerk |
| Current Senate roster | Senate current senators page, Congress.gov, Bioguide | `unitedstates/congress-legislators` | Uses `legislators-current.yaml`; validate counts against Senate party division |
| House election results | Clerk election statistics and state certifications | MIT House 1976-2024 | Uses MIT 2024 district returns |
| Senate election results | Clerk election statistics, FEC/state certifications | MIT Senate statewide 1976-2024 | Uses MIT latest completed races by seat class |
| House boundaries | Census cartographic boundary file for 119th Congressional Districts | Census TIGER/Line `cd119`, block equivalency, relationship files | Uses generated 1:20m 119th district map asset for all 435 voting districts |
| Senate boundaries | Census state boundaries | Existing state TopoJSON | Current Senate map uses local state shapes |
| District partisan baseline | The Downballot presidential-by-CD data or computed presidential returns by current CD | Cook PVI as a labeled external index | Not ingested yet |
| State partisan baseline | MIT presidential state returns, FEC certified presidential results | Cook PVI state index | Presidential state baselines exist elsewhere in app; not wired into Senate seats yet |
| Candidate ballot data | FEC congressional candidate ballot files | State election office files | Candidate names are currently derived from MIT result rows |

## Public Source Links

- Office of the Clerk election information: `https://clerk.house.gov/Members/ViewElectionInformation`
- Office of the Clerk member information and member data: `https://clerk.house.gov/Members`
- U.S. Senate current senators and party division: `https://www.senate.gov/senators/`
- Congress.gov API: `https://api.congress.gov/`
- Biographical Directory of the U.S. Congress: `https://bioguide.congress.gov/`
- Census congressional district files and maps: `https://www.census.gov/programs-surveys/decennial-census/about/rdo/congressional-districts.html`
- Census 2025 cartographic boundary file, 119th Congressional Districts, 1:20m: `https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_cd119_20m.zip`
- FEC election results and voting information: `https://www.fec.gov/introduction-campaign-finance/election-results-and-voting-information/`
- MIT House 1976-2024: `https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/IG0UN2`
- MIT Senate statewide 1976-2024: `https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/PEJ5QU`
- MIT President 1976-2024: `https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/42MVDX`
- `unitedstates/congress-legislators`: `https://github.com/unitedstates/congress-legislators`
- The Downballot data guide: `https://www.the-downballot.com/p/data`
- Cook PVI district list: `https://www.cookpolitical.com/pvi-map-and-district-list`

## Required Datasets

### 1. Current House District Boundaries

Required fields:

- `districtId`: stable app ID such as `CA-45` or `AK-AL`
- `stateCode`
- `districtNumber`: numeric district, with `0` for at-large states
- `districtLabel`: display label such as `CA-45` or `AK at-large`
- `congress`: for the current cycle, `119`
- `geometrySourceId`
- `geometryVintage`
- `shapeId`: source feature ID from Census geometry
- `relationshipNotes`: redistricting or block split notes where relevant

Validation:

- Exactly 435 voting House district shapes.
- No duplicate `districtId`.
- All current House seats have a matching geometry.
- At-large states normalize to the same ID format used by election results and roster data.
- Redistricted states for the 119th Congress are documented separately from 118th Congress comparisons.

Current status:

- Complete for current 119th Congress rendering. `scripts/build-house-district-map.mjs` downloads the Census 2025 cartographic boundary shapefile, filters to the 435 voting districts, projects each district to SVG path data, and writes `public/us-house-districts-119-20m.json`.
- Non-voting delegate districts are not rendered in the House control map; the generated asset records DC-AL and PR-AL separately under `nonVotingDelegateDistricts`.
- `npm run validate:house-map` verifies source metadata, 435 voting paths, no duplicate IDs, no delegate districts in the voting map, finite path bounds/labels, and exact ID alignment with `houseDistrictBaselines`.
- Still incomplete for cross-cycle district comparison. Block equivalency and redistricting relationship files are required before comparing district results across district plans.

### 2. Current Senate State Boundaries

Required fields:

- `stateCode`
- `stateName`
- `mapShapeId`
- `geometrySourceId`
- `geometryVintage`

Validation:

- Exactly 50 states for Senate calculations.
- No District of Columbia or territories in Senate seat calculations.
- Every state maps to exactly two Senate seats.

Current status:

- Mostly complete for rendering through the app's existing state TopoJSON. Add explicit legislative source metadata if Senate map geometry becomes part of the generated legislative dataset.

### 3. Current Member Rosters

Required member fields:

- `bioguideId`
- `officialName`
- `displayName`
- `chamber`: `house` or `senate`
- `party`: `democratic`, `republican`, or `independent`
- `partyLabel`
- `caucusParty`: especially for independents
- `stateCode`
- `districtId` for House members
- `districtNumber` for House members
- `senateClass` for Senators
- `currentTermStart`
- `currentTermEnd`
- `firstChamberServiceDate`
- `firstChamberYear`
- `tenureYears`: computed from service start to data snapshot date
- `serviceSegments`: optional, for non-continuous service
- `sourceRosterId`
- `retrievedAt`

Validation:

- 435 voting House seats represented as either a current voting member or vacancy.
- 100 current Senate seats represented.
- Non-voting delegates may be stored for context, but they must not count toward House control or the 218 threshold.
- Party totals reconcile against official Clerk and Senate party-division pages.
- Every member has a Bioguide ID.

Current status:

- Mostly complete for names, chamber, party, caucus alignment, state/district/class IDs, Bioguide ID, first chamber year, current term dates, and computed tenure.
- Service segments and official-source cross-checks still need to be added.

### 4. Latest Completed House Election Results

Required race/result fields:

- `raceId`: same as district ID for regular general elections
- `stateCode`
- `districtId`
- `districtNumber`
- `electionYear`
- `electionDate` where available
- `office`
- `stage`: general, runoff, special general, etc.
- `specialElection`
- `winnerCandidateId`
- `winnerParty`
- `democraticVotes`
- `republicanVotes`
- `otherVotes`
- `totalVotes`
- `democraticShare`
- `republicanShare`
- `otherShare`
- `baselineMargin`: current app convention is `(Democratic votes - Republican votes) / total votes`
- `uncontested`
- `lowData`
- `sourceResultId`
- `certificationStatus`: certified, official compilation, trusted unofficial, or unknown

Candidate fields:

- `candidateId`: source candidate key if available, otherwise normalized race/name/party key
- `candidateName`
- `party`
- `partyLabel`
- `sourceParty`
- `votes`
- `voteShare`
- `isIncumbent`
- `isWinner`
- `isMajorParty`
- `ballotOrder`: optional

Validation:

- Exactly 435 regular House district baselines for a general-election baseline year.
- Candidate vote totals sum to `totalVotes`, allowing documented source quirks.
- District totals reconcile to a trusted publication or official compiled source.
- Uncontested, same-party, cancelled, and write-in-heavy races are flagged.
- Fusion/cross-endorsed votes are aggregated consistently by candidate, with source parties retained.

Current status:

- Complete for 2024 MIT result ingestion, candidate names, major-party votes, other votes, total votes, vote shares, uncontested flags, and low-data flags.
- Not complete for explicit `isIncumbent`, open-seat status, official certification labels, runoff handling, or per-candidate source IDs.

### 5. Latest Completed Senate Election Results

Required fields:

- `raceId`: `STATE-SCLASS`, such as `AZ-S1`
- `stateCode`
- `senateClass`
- `electionYear`
- `electionDate` where available
- `stage`
- `runoff`
- `specialElection`
- `regularTermElection`: true for the normal class cycle
- `appointedIncumbent`: true where the incumbent was appointed before election
- `winnerCandidateId`
- `winnerParty`
- `winnerControlParty`
- `democraticVotes`
- `republicanVotes`
- `otherVotes`
- `totalVotes`
- `baselineMargin`
- `uncontested`
- `lowData`
- `sourceResultId`
- `certificationStatus`

Validation:

- Exactly 100 Senate seat baselines.
- Every seat has class 1, 2, or 3.
- Latest completed race must match the current seat by state, class, term, special-election status, and winner where possible.
- Runoffs must supersede first-round general results when the runoff decides the seat.
- Special elections must not erase the normal class schedule unless the seat's term is actually reset by law.

Current status:

- Complete for 100 Senate seat baselines, class IDs, latest matched MIT races, candidate lists, votes, vote shares, and special-election flags.
- Needs stronger race matching metadata, official certification labels, appointment flags, and explicit regular-versus-special term fields.

### 6. Historical House Results

Required fields:

- Same fields as latest House results.
- `congress`
- `districtPlanVersion` or `redistrictingCycle`
- `boundaryComparableToCurrent`: true only when safe for current-boundary comparison
- `redistrictingNotes`

Validation:

- Never compare historical district results across redistricting without a documented plan relationship.
- Historical results may power trend views only after district IDs, state changes, at-large transitions, and missing districts are documented.

Current status:

- Source selected through MIT House 1976-2024.
- Not yet cleaned into an app-facing historical House dataset.

### 7. Historical Senate Results

Required fields:

- Same fields as latest Senate results.
- `classCycleYear`
- `seatContinuityNotes`
- `specialElectionTermNotes`

Validation:

- Senate historical results are easier to compare geographically because state boundaries are stable for this app, but seat class and special elections still need explicit handling.
- Runoffs and appointments must be separated from normal November general elections.

Current status:

- Source selected through MIT Senate statewide 1976-2024.
- Not yet exposed as a historical trend dataset.

### 8. Incumbency And Open-Seat Status

Required fields:

- `incumbentBioguideId`
- `incumbentName`
- `incumbentParty`
- `incumbentControlParty`
- `incumbentFirstYear`
- `incumbentTenureYears`
- `incumbentRunning`: true, false, or unknown
- `incumbentCandidateId`
- `incumbencyStatus`: incumbent-running, open-seat, appointed-incumbent-running, vacant-seat, challenger-incumbent-lost-primary, or unknown
- `openSeat`: boolean
- `vacancyAtElection`: boolean
- `vacancyReason`: optional

Validation:

- Incumbency should be based on the incumbent at the election, not only the current roster after the election.
- For current-cycle simulations, candidate filing and retirement data should remain unknown until sourced.
- Open-seat flags must cite the source: roster vacancy, official candidate list, retirement announcement source, or election result incumbent match.

Current status:

- Current incumbent fields exist for generated seats.
- Open-seat and incumbency status are not yet explicit and should not be inferred in UI copy beyond current member/vacancy.

### 9. Partisan Baselines

House district baseline fields:

- `districtId`
- `baselineType`: presidential-margin, PVI, composite, or custom
- `baselineYear`
- `democraticVotes`
- `republicanVotes`
- `otherVotes`
- `totalVotes`
- `democraticTwoPartyShare`
- `republicanTwoPartyShare`
- `margin`
- `sourceId`
- `boundaryPlan`
- `notes`

Senate state baseline fields:

- `stateCode`
- `baselineType`
- `baselineYear`
- `margin`
- `democraticVotes`
- `republicanVotes`
- `otherVotes`
- `totalVotes`
- `sourceId`

Validation:

- District presidential margins must be calculated on the same district boundaries being simulated.
- If Cook PVI is used, label it as an external index rather than raw election returns.
- If The Downballot presidential-by-CD data is used, cite the dataset and do not reproduce entire external spreadsheets in docs.
- State partisan baselines can reuse validated presidential state baselines already in the app, but Senate seat data should store the link explicitly.

Current status:

- Presidential state baselines exist elsewhere in the app.
- District presidential margins and Senate state partisan baseline links are not yet wired into the legislative dataset.

## Third-Party And Independent Handling

Rules for calculations:

- Keep candidate-level records for all candidates present in the source.
- Aggregate parties into `democratic`, `republican`, and `independent`/`other` for seat simulations.
- Store source party labels separately from normalized party labels.
- Include write-ins in `otherVotes` unless the source identifies the write-in candidate as a named major-party nominee.
- Aggregate multiple rows for the same candidate across vote modes or fusion party lines before computing shares.
- Treat independents who win seats as `independent` for party totals and use `caucusParty` only for chamber control totals.
- For independent Senate incumbents who caucus with Democrats, compute control alignment separately from ballot party.
- Do not silently drop third-party votes from total vote denominator. If a two-party margin is added later, store it in a separate field.

Current app convention:

- `baselineMargin = (Democratic votes - Republican votes) / total votes * 100`
- Positive margins favor Democratic control; negative margins favor Republican control.
- `otherVotes = totalVotes - democraticVotes - republicanVotes`
- `lowData` is true for missing/small totals and currently flags uncontested House races.

## Source Metadata Required For Every Dataset

Every generated dataset should include:

- `sourceId`
- `sourceName`
- `sourceUrl`
- `sourcePublisher`
- `dataVintage`
- `retrievedAt`
- `generatedAt`
- `license`
- `cleaningNotes`
- `validationSummary`
- `knownLimitations`
- `fieldsDerivedByApp`

## Validation Gates

A legislative dataset is calculation-ready only after these checks pass:

- House voting seats equal 435.
- Senate seats equal 100.
- Senate states equal 50 and each has two seats.
- Every voting seat has state, district/class, party/control, baseline result, and source metadata.
- Party totals reconcile to official House Clerk and Senate party-division summaries for the same snapshot date.
- Results reconcile to official or widely trusted source totals.
- Candidate vote totals reconcile to race totals.
- No current House district lacks a boundary once true district geography is enabled.
- Non-voting delegates are not included in chamber control math.
- Special elections and runoffs are identified separately from regular general elections.
- Historical district comparisons are blocked unless redistricting notes are present.
- Third-party, independent, write-in, and fusion handling rules are documented.

## Implementation Backlog

Highest priority:

- Add Census block equivalency and district-plan relationship files for cross-cycle House comparisons.
- Add explicit `incumbencyStatus`, `openSeat`, `incumbentRunning`, and `isIncumbent` candidate flags.
- Add official-source validation against House Clerk and Senate party totals.
- Add House `specialElection` fields instead of filtering specials out without downstream metadata.
- Add district presidential margins or external PVI fields with clear source labeling.
- Add Senate state partisan baseline links from existing presidential baseline data.

Second priority:

- Build historical House and Senate trend datasets from the existing MIT source files.
- Add redistricting relationship metadata for historical House districts.
- Add candidate ballot source ingestion from FEC or state election offices.
- Add result certification status and official compilation references.
- Expand validation reports with missing-field counts, party total reconciliation, and source vintage.

Do not mark the legislative data foundation complete until the current roster, latest results, true boundaries, incumbency/open-seat flags, and partisan baselines are all present with source metadata and validation reports.
