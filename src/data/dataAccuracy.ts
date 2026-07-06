export type AccuracyRequirementId =
  | "election-return-reconciliation"
  | "county-historical-documentation"
  | "county-population-reconciliation"
  | "source-defined-demographics"
  | "geography-classification"
  | "split-electoral-vote-modeling"
  | "aggregate-demographic-labeling";

export type DatasetReadiness =
  | "illustrative-demo"
  | "blocked-until-documented"
  | "calculation-ready";

export type DataAccuracyRequirement = {
  id: AccuracyRequirementId;
  requirement: string;
  implementation: string;
};

export type DatasetAccuracyProfile = {
  id: string;
  label: string;
  readiness: DatasetReadiness;
  allowedUse: string;
  sourceName: string;
  sourceUrl: string | null;
  vintage: string;
  retrievedAt: string | null;
  validationSummary: string;
  requirements: AccuracyRequirementId[];
};

export const dataAccuracyRequirements: DataAccuracyRequirement[] = [
  {
    id: "election-return-reconciliation",
    requirement:
      "Election returns must reconcile to certified or widely trusted published totals before being used in calculations.",
    implementation:
      "Calculation-ready election datasets must record source name, source URL, data vintage, retrieval date, reconciliation method, and validation result. The current MVP baseline is explicitly marked illustrative-demo.",
  },
  {
    id: "county-historical-documentation",
    requirement:
      "County and historical presidential data must document county/FIPS changes, missing counties, third-party handling, and rounding.",
    implementation:
      "County or historical imports stay blocked until their cleaning notes explain FIPS changes, missing records, third-party vote treatment, and rounding.",
  },
  {
    id: "county-population-reconciliation",
    requirement:
      "County-level map data must reconcile county FIPS/name records against a population source before powering a county map.",
    implementation:
      "County map mode remains blocked until every county-year row has a documented FIPS/name match and a population source/vintage suitable for the map denominator.",
  },
  {
    id: "source-defined-demographics",
    requirement:
      "Age, education, race, and ethnicity data must use source-defined categories unless a recode is documented.",
    implementation:
      "Demographic datasets stay blocked unless their category definitions are copied from the source or every recode is listed with a reason.",
  },
  {
    id: "geography-classification",
    requirement:
      "Urban/suburban/rural data must name the classification method before it powers a slider or map layer.",
    implementation:
      "Geography datasets stay blocked until the classification method, vintage, and edge cases are recorded.",
  },
  {
    id: "split-electoral-vote-modeling",
    requirement:
      "Maine and Nebraska district data must model statewide electoral votes separately from congressional district electoral votes.",
    implementation:
      "Split-electoral-vote datasets must expose statewide and congressional-district units separately instead of flattening each state into one winner-take-all result.",
  },
  {
    id: "aggregate-demographic-labeling",
    requirement:
      "Race/ethnicity data must be labeled as aggregate demographic context, not individual voter behavior.",
    implementation:
      "Race and ethnicity views must use aggregate-context language and cannot imply individual vote choice from group membership.",
  },
];

export const currentDatasetAccuracyProfiles: DatasetAccuracyProfile[] = [
  {
    id: "historical-state-baselines",
    label: "Historical presidential state baselines",
    readiness: "calculation-ready",
    allowedUse:
      "Allowed for state-level historical baseline selection and scenario calculations.",
    sourceName: "MIT Election Data and Science Lab, U.S. President 1976-2024",
    sourceUrl:
      "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/42MVDX",
    vintage: "Version 10.0, released 2026-05-11",
    retrievedAt: "2026-07-02",
    validationSummary:
      "Generated baselines cover 51 state/DC records for each requested election year from 2000 through 2024; electoral vote sums validate to 538 for every baseline year.",
    requirements: ["election-return-reconciliation"],
  },
  {
    id: "historical-county-presidential-returns",
    label: "County presidential returns 2000-2024",
    readiness: "blocked-until-documented",
    allowedUse:
      "Not allowed for map mode or calculations until county totals reconcile and population/FIPS matching is complete.",
    sourceName:
      "MIT Election Data and Science Lab, County Presidential Election Returns 2000-2024",
    sourceUrl:
      "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/VOQCHQ",
    vintage: "Version 20.0, released 2026-02-25",
    retrievedAt: "2026-07-02",
    validationSummary:
      "Initial cleaning and validation report exists in docs/historical-data-validation.generated.json, but county-to-state reconciliation still has mismatches and county population matching is not complete.",
    requirements: [
      "election-return-reconciliation",
      "county-historical-documentation",
      "county-population-reconciliation",
    ],
  },
  {
    id: "mvp-state-baselines",
    label: "MVP state baseline margins",
    readiness: "illustrative-demo",
    allowedUse:
      "Allowed for the current simulation playground only; not a certified election-return baseline.",
    sourceName: "Internal rounded illustrative seed data",
    sourceUrl: null,
    vintage: "2024-style MVP placeholder",
    retrievedAt: null,
    validationSummary:
      "Not reconciled to certified or published election totals. Replace with a calculation-ready dataset before using real election returns.",
    requirements: ["election-return-reconciliation"],
  },
  {
    id: "state-map-shapes",
    label: "State and District of Columbia map shapes",
    readiness: "calculation-ready",
    allowedUse: "Allowed for rendering state-level map geometry.",
    sourceName: "Local TopoJSON state-boundary asset",
    sourceUrl: "/us-states-albers-10m.json",
    vintage: "Bundled MVP map asset",
    retrievedAt: null,
    validationSummary:
      "Validated locally against the 51 state/DC baseline records by map shape id coverage.",
    requirements: [],
  },
];
