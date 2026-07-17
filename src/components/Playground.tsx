"use client";

import {
  Building2,
  Landmark,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Vote,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ElectoralCounter } from "@/components/ElectoralCounter";
import { ElectoralMap } from "@/components/ElectoralMap";
import { LegislativeWorkspace } from "@/components/LegislativeWorkspace";
import { ModelExplanation } from "@/components/ModelExplanation";
import { MonteCarloPanel } from "@/components/MonteCarloPanel";
import { ScenarioComparison } from "@/components/ScenarioComparison";
import { ScenarioControls } from "@/components/ScenarioControls";
import { ScenarioSummary } from "@/components/ScenarioSummary";
import { SensitivityView } from "@/components/SensitivityView";
import { ShareCardPreview } from "@/components/ShareCardPreview";
import { StateDetailPanel } from "@/components/StateDetailPanel";
import { UnifiedScenarioSummary } from "@/components/UnifiedScenarioSummary";
import { defaultDemographicAssumptions } from "@/data/demographicSliders";
import { defaultHistoricalElectionYear } from "@/data/historicalElectionData.generated";
import { getLegislativeAssumptionsFromPresident } from "@/data/legislativeSliders";
import {
  houseDistrictBaselines,
  senateSeatBaselines,
} from "@/data/legislativeData.generated";
import { getStateBaselinesForYear } from "@/data/states";
import { calculateScenario } from "@/lib/calculateScenario";
import {
  calculateLegislativeScenario,
  getDefaultLegislativeAssumptions,
} from "@/lib/calculateLegislativeScenario";
import {
  appScenarioToUrl,
  baselineYearFromSearchParams,
  legislativeOverridesFromSearchParams,
  legislativeSeatFromSearchParams,
  legislativeSlidersFromSearchParams,
  legislativeSwingFromSearchParams,
  scenarioFromSearchParams,
  selectedStateFromSearchParams,
  simulationTabFromSearchParams,
} from "@/lib/scenarioUrl";
import { hasSeatOverride, hasStateOverride } from "@/lib/localOverrides";
import { resetBaselinePresetId } from "@/data/scenarioPresets";
import type {
  DemographicAssumptions,
  DemographicSliderId,
  HistoricalElectionYear,
  LegislativeAssumptions,
  LegislativeSliderId,
  SeatOverride,
  ScenarioPreset,
  SimulationTab,
  StateOverride,
  StateOverrides,
} from "@/types/election";
import styles from "@/components/Playground.module.css";

const initialSelectedState = "PA";
const initialSelectedHouseSeat = "PA-07";
const initialSelectedSenateSeat = "GA-S2";
type ThemeMode = "light" | "dark";

const tabs = [
  { id: "president", label: "President", detail: "538 EV", Icon: Vote },
  { id: "house", label: "House", detail: "435 seats", Icon: Building2 },
  { id: "senate", label: "Senate", detail: "100 seats", Icon: Landmark },
] as const;

export function Playground() {
  const [activeTab, setActiveTab] = useState<SimulationTab>("president");
  const [nationalSwing, setNationalSwing] = useState(0);
  const [demographicAssumptions, setDemographicAssumptions] =
    useState<DemographicAssumptions>({ ...defaultDemographicAssumptions });
  const [houseAssumptions, setHouseAssumptions] =
    useState<LegislativeAssumptions>(() => getDefaultLegislativeAssumptions());
  const [senateAssumptions, setSenateAssumptions] =
    useState<LegislativeAssumptions>(() => getDefaultLegislativeAssumptions());
  const [stateOverrides, setStateOverrides] = useState<StateOverrides>({});
  const [baselineYear, setBaselineYear] = useState<HistoricalElectionYear>(
    defaultHistoricalElectionYear,
  );
  const [selectedStateCode, setSelectedStateCode] = useState(initialSelectedState);
  const [selectedHouseSeatId, setSelectedHouseSeatId] = useState(
    initialSelectedHouseSeat,
  );
  const [selectedSenateSeatId, setSelectedSenateSeatId] = useState(
    initialSelectedSenateSeat,
  );
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [urlReady, setUrlReady] = useState(false);

  const scenarioAssumptions = useMemo(
    () => ({
      nationalSwing,
      demographics: demographicAssumptions,
      stateOverrides,
      adjustments: [],
    }),
    [demographicAssumptions, nationalSwing, stateOverrides],
  );

  const houseScenarioAssumptions = useMemo<LegislativeAssumptions>(
    () => ({
      ...houseAssumptions,
      overrides: {
        states: stateOverrides,
        districts: houseAssumptions.overrides.districts,
        races: {},
      },
    }),
    [houseAssumptions, stateOverrides],
  );

  const senateScenarioAssumptions = useMemo<LegislativeAssumptions>(
    () => ({
      ...senateAssumptions,
      overrides: {
        states: stateOverrides,
        districts: {},
        races: senateAssumptions.overrides.races,
      },
    }),
    [senateAssumptions, stateOverrides],
  );

  const historicalStateBaselines = useMemo(
    () => getStateBaselinesForYear(baselineYear),
    [baselineYear],
  );

  const scenario = useMemo(
    () => calculateScenario(historicalStateBaselines, scenarioAssumptions),
    [historicalStateBaselines, scenarioAssumptions],
  );
  const houseScenario = useMemo(
    () =>
      calculateLegislativeScenario(
        "house",
        houseDistrictBaselines,
        houseScenarioAssumptions,
      ),
    [houseScenarioAssumptions],
  );
  const senateScenario = useMemo(
    () =>
      calculateLegislativeScenario(
        "senate",
        senateSeatBaselines,
        senateScenarioAssumptions,
      ),
    [senateScenarioAssumptions],
  );

  const selectedState = useMemo(() => {
    return (
      scenario.states.find((state) => state.state.code === selectedStateCode) ??
      scenario.states[0]
    );
  }, [scenario.states, selectedStateCode]);

  useEffect(() => {
    function restoreScenarioFromUrl() {
      const searchParams = new URLSearchParams(window.location.search);
      const restoredAssumptions = scenarioFromSearchParams(
        searchParams,
      );
      const restoredBaselineYear = baselineYearFromSearchParams(
        searchParams,
      );
      const restoredState = selectedStateFromSearchParams(searchParams);
      const restoredHouseSeat = legislativeSeatFromSearchParams(searchParams, "house");
      const restoredSenateSeat = legislativeSeatFromSearchParams(searchParams, "senate");
      const restoredHouseOverrides = legislativeOverridesFromSearchParams(
        searchParams,
        "house",
      );
      const restoredSenateOverrides = legislativeOverridesFromSearchParams(
        searchParams,
        "senate",
      );

      setActiveTab(simulationTabFromSearchParams(searchParams));
      setNationalSwing(restoredAssumptions.nationalSwing);
      setDemographicAssumptions(restoredAssumptions.demographics);
      setStateOverrides(restoredAssumptions.stateOverrides ?? {});
      setBaselineYear(restoredBaselineYear);
      setHouseAssumptions({
        ...getDefaultLegislativeAssumptions(),
        nationalSwing: legislativeSwingFromSearchParams(searchParams, "house"),
        sliders: legislativeSlidersFromSearchParams(searchParams, "house"),
        overrides: restoredHouseOverrides,
      });
      setSenateAssumptions({
        ...getDefaultLegislativeAssumptions(),
        nationalSwing: legislativeSwingFromSearchParams(searchParams, "senate"),
        sliders: legislativeSlidersFromSearchParams(searchParams, "senate"),
        overrides: restoredSenateOverrides,
      });

      if (
        restoredState &&
        getStateBaselinesForYear(restoredBaselineYear).some(
          (state) => state.code === restoredState,
        )
      ) {
        setSelectedStateCode(restoredState);
      }

      if (
        restoredHouseSeat &&
        houseDistrictBaselines.some((seat) => seat.id === restoredHouseSeat)
      ) {
        setSelectedHouseSeatId(restoredHouseSeat);
      }

      if (
        restoredSenateSeat &&
        senateSeatBaselines.some((seat) => seat.id === restoredSenateSeat)
      ) {
        setSelectedSenateSeatId(restoredSenateSeat);
      }
    }

    restoreScenarioFromUrl();
    setUrlReady(true);
    window.addEventListener("popstate", restoreScenarioFromUrl);

    return () => {
      window.removeEventListener("popstate", restoreScenarioFromUrl);
    };
  }, []);

  useEffect(() => {
    if (!urlReady) {
      return;
    }

    const updateUrlTimeout = window.setTimeout(() => {
      const scenarioUrl = appScenarioToUrl({
        activeTab,
        basePath: window.location.pathname,
        baselineYear,
        presidentialAssumptions: scenarioAssumptions,
        selectedStateCode,
        houseSwing: houseAssumptions.nationalSwing,
        houseSliders: houseAssumptions.sliders,
        houseOverrides: houseScenarioAssumptions.overrides,
        senateSwing: senateAssumptions.nationalSwing,
        senateSliders: senateAssumptions.sliders,
        senateOverrides: senateScenarioAssumptions.overrides,
        houseSeatId: selectedHouseSeatId,
        senateSeatId: selectedSenateSeatId,
      });
      window.history.replaceState(null, "", scenarioUrl);
    }, 120);

    return () => window.clearTimeout(updateUrlTimeout);
  }, [
    activeTab,
    baselineYear,
    houseAssumptions,
    houseScenarioAssumptions.overrides,
    scenarioAssumptions,
    selectedStateCode,
    selectedHouseSeatId,
    selectedSenateSeatId,
    senateAssumptions,
    senateScenarioAssumptions.overrides,
    urlReady,
  ]);

  const currentShareUrl = useMemo(() => {
    if (!urlReady || typeof window === "undefined") {
      return "";
    }

    const relativeUrl = appScenarioToUrl({
      activeTab,
      basePath: window.location.pathname,
      baselineYear,
      presidentialAssumptions: scenarioAssumptions,
      selectedStateCode,
      houseSwing: houseAssumptions.nationalSwing,
      houseSliders: houseAssumptions.sliders,
      houseOverrides: houseScenarioAssumptions.overrides,
      senateSwing: senateAssumptions.nationalSwing,
      senateSliders: senateAssumptions.sliders,
      senateOverrides: senateScenarioAssumptions.overrides,
      houseSeatId: selectedHouseSeatId,
      senateSeatId: selectedSenateSeatId,
    });

    return new URL(relativeUrl, window.location.origin).href;
  }, [
    activeTab,
    baselineYear,
    houseAssumptions,
    houseScenarioAssumptions.overrides,
    scenarioAssumptions,
    selectedStateCode,
    selectedHouseSeatId,
    selectedSenateSeatId,
    senateAssumptions,
    senateScenarioAssumptions.overrides,
    urlReady,
  ]);

  const copyScenarioLink = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    const relativeUrl = appScenarioToUrl({
      activeTab,
      basePath: window.location.pathname,
      baselineYear,
      presidentialAssumptions: scenarioAssumptions,
      selectedStateCode,
      houseSwing: houseAssumptions.nationalSwing,
      houseSliders: houseAssumptions.sliders,
      houseOverrides: houseScenarioAssumptions.overrides,
      senateSwing: senateAssumptions.nationalSwing,
      senateSliders: senateAssumptions.sliders,
      senateOverrides: senateScenarioAssumptions.overrides,
      houseSeatId: selectedHouseSeatId,
      senateSeatId: selectedSenateSeatId,
    });
    const shareUrl = new URL(relativeUrl, window.location.origin).href;

    const textArea = document.createElement("textarea");
    textArea.value = shareUrl;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    function copyWithFallback() {
      document.body.append(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      textArea.remove();

      if (!copied) {
        throw new Error("Scenario link could not be copied");
      }
    }

    if (!navigator.clipboard?.writeText) {
      copyWithFallback();
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      copyWithFallback();
    }
  }, [
    activeTab,
    baselineYear,
    houseAssumptions,
    houseScenarioAssumptions.overrides,
    scenarioAssumptions,
    selectedStateCode,
    selectedHouseSeatId,
    selectedSenateSeatId,
    senateAssumptions,
    senateScenarioAssumptions.overrides,
  ]);

  function updateDemographicAssumption(
    id: DemographicSliderId,
    value: number,
  ) {
    setDemographicAssumptions((currentAssumptions) => ({
      ...currentAssumptions,
      [id]: value,
    }));
  }

  function applyScenarioPreset(preset: ScenarioPreset) {
    setNationalSwing(preset.assumptions.nationalSwing);
    setDemographicAssumptions({
      ...defaultDemographicAssumptions,
      ...preset.assumptions.demographics,
    });

    if (preset.id === resetBaselinePresetId) {
      setBaselineYear(defaultHistoricalElectionYear);
      setSelectedStateCode(initialSelectedState);
    }
  }

  function updateHouseSwing(value: number) {
    setHouseAssumptions((currentAssumptions) => ({
      ...currentAssumptions,
      nationalSwing: value,
    }));
  }

  function updateHouseSlider(id: LegislativeSliderId, value: number) {
    setHouseAssumptions((currentAssumptions) => ({
      ...currentAssumptions,
      sliders: {
        ...currentAssumptions.sliders,
        [id]: value,
      },
    }));
  }

  function applyPresidentAssumptionsToHouse() {
    setHouseAssumptions((currentAssumptions) => ({
      ...currentAssumptions,
      sliders: getLegislativeAssumptionsFromPresident(
        demographicAssumptions,
        nationalSwing,
      ),
    }));
  }

  function updateSenateSwing(value: number) {
    setSenateAssumptions((currentAssumptions) => ({
      ...currentAssumptions,
      nationalSwing: value,
    }));
  }

  function updateSenateSlider(id: LegislativeSliderId, value: number) {
    setSenateAssumptions((currentAssumptions) => ({
      ...currentAssumptions,
      sliders: {
        ...currentAssumptions.sliders,
        [id]: value,
      },
    }));
  }

  function applyPresidentAssumptionsToSenate() {
    setSenateAssumptions((currentAssumptions) => ({
      ...currentAssumptions,
      sliders: getLegislativeAssumptionsFromPresident(
        demographicAssumptions,
        nationalSwing,
      ),
    }));
  }

  function updateStateOverride(stateCode: string, value: StateOverride) {
    setStateOverrides((currentOverrides) => {
      const nextOverrides = { ...currentOverrides };
      if (hasStateOverride(value)) {
        nextOverrides[stateCode] = value;
      } else {
        delete nextOverrides[stateCode];
      }
      return nextOverrides;
    });
  }

  function resetStateOverride(stateCode: string) {
    setStateOverrides((currentOverrides) => {
      const nextOverrides = { ...currentOverrides };
      delete nextOverrides[stateCode];
      return nextOverrides;
    });
  }

  function updateHouseSeatOverride(seatId: string, value: SeatOverride) {
    setHouseAssumptions((currentAssumptions) => {
      const districts = { ...currentAssumptions.overrides.districts };
      if (hasSeatOverride(value)) {
        districts[seatId] = value;
      } else {
        delete districts[seatId];
      }
      return {
        ...currentAssumptions,
        overrides: { ...currentAssumptions.overrides, districts },
      };
    });
  }

  function resetHouseSeatOverride(seatId: string) {
    setHouseAssumptions((currentAssumptions) => {
      const districts = { ...currentAssumptions.overrides.districts };
      delete districts[seatId];
      return {
        ...currentAssumptions,
        overrides: { ...currentAssumptions.overrides, districts },
      };
    });
  }

  function updateSenateRaceOverride(seatId: string, value: SeatOverride) {
    setSenateAssumptions((currentAssumptions) => {
      const races = { ...currentAssumptions.overrides.races };
      if (hasSeatOverride(value)) {
        races[seatId] = value;
      } else {
        delete races[seatId];
      }
      return {
        ...currentAssumptions,
        overrides: { ...currentAssumptions.overrides, races },
      };
    });
  }

  function resetSenateRaceOverride(seatId: string) {
    setSenateAssumptions((currentAssumptions) => {
      const races = { ...currentAssumptions.overrides.races };
      delete races[seatId];
      return {
        ...currentAssumptions,
        overrides: { ...currentAssumptions.overrides, races },
      };
    });
  }

  function resetPresidentTab() {
    setBaselineYear(defaultHistoricalElectionYear);
    setNationalSwing(0);
    setDemographicAssumptions({ ...defaultDemographicAssumptions });
    setSelectedStateCode(initialSelectedState);
  }

  function resetAllSimulations() {
    setBaselineYear(defaultHistoricalElectionYear);
    setNationalSwing(0);
    setDemographicAssumptions({ ...defaultDemographicAssumptions });
    setStateOverrides({});
    setHouseAssumptions(getDefaultLegislativeAssumptions());
    setSenateAssumptions(getDefaultLegislativeAssumptions());
    setSelectedStateCode(initialSelectedState);
    setSelectedHouseSeatId(initialSelectedHouseSeat);
    setSelectedSenateSeatId(initialSelectedSenateSeat);
  }

  const isEverythingAtDefault =
    baselineYear === defaultHistoricalElectionYear &&
    Math.abs(nationalSwing) < 0.05 &&
    Object.values(demographicAssumptions).every((value) => Math.abs(value) < 0.05) &&
    Object.keys(stateOverrides).length === 0 &&
    Math.abs(houseAssumptions.nationalSwing) < 0.05 &&
    Object.values(houseAssumptions.sliders).every((value) => Math.abs(value) < 0.05) &&
    Object.keys(houseAssumptions.overrides.districts).length === 0 &&
    Math.abs(senateAssumptions.nationalSwing) < 0.05 &&
    Object.values(senateAssumptions.sliders).every((value) => Math.abs(value) < 0.05) &&
    Object.keys(senateAssumptions.overrides.races).length === 0;

  return (
    <main
      className={`${styles.shell} ${isFocusMode ? styles.focusShell : ""}`}
      data-theme={themeMode}
    >
      <div className={styles.appFrame}>
        <aside className={styles.appSidebar} aria-label="Application controls">
          <div className={styles.brandLockup}>
            <div className={styles.brandMark} aria-hidden="true">
              <Vote size={20} strokeWidth={2.4} />
            </div>
            <div className={styles.brandText}>
              <p className={styles.eyebrow}>Scenario Lab</p>
              <h1>Election Forecast Playground</h1>
            </div>
          </div>

          <nav className={styles.tabBar} aria-label="Simulation modes" role="tablist">
            {tabs.map(({ Icon, detail, id, label }) => (
              <button
                aria-current={activeTab === id ? "page" : undefined}
                aria-controls={`${id}-panel`}
                aria-selected={activeTab === id}
                className={activeTab === id ? styles.activeTab : ""}
                id={`${id}-tab`}
                key={id}
                onClick={() => setActiveTab(id)}
                role="tab"
                type="button"
              >
                <Icon size={18} strokeWidth={2.2} />
                <span>{label}</span>
                <small>{detail}</small>
              </button>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.themeSwitch} aria-label="Display mode">
              <button
                aria-label="Use light mode"
                aria-pressed={themeMode === "light"}
                className={themeMode === "light" ? styles.activeThemeButton : ""}
                onClick={() => setThemeMode("light")}
                title="Light mode"
                type="button"
              >
                <Sun size={15} strokeWidth={2.2} />
                <span>Light</span>
              </button>
              <button
                aria-label="Use dark mode"
                aria-pressed={themeMode === "dark"}
                className={themeMode === "dark" ? styles.activeThemeButton : ""}
                onClick={() => setThemeMode("dark")}
                title="Dark mode"
                type="button"
              >
                <Moon size={15} strokeWidth={2.2} />
                <span>Dark</span>
              </button>
            </div>

            <button
              aria-pressed={isFocusMode}
              className={`${styles.focusToggle} ${
                isFocusMode ? styles.activeFocusToggle : ""
              }`}
              onClick={() => setIsFocusMode((currentValue) => !currentValue)}
              title={isFocusMode ? "Return to balanced view" : "Focus map"}
              type="button"
            >
              {isFocusMode ? (
                <Minimize2 size={16} strokeWidth={2.3} />
              ) : (
                <Maximize2 size={16} strokeWidth={2.3} />
              )}
              <span>{isFocusMode ? "Balanced view" : "Focus map"}</span>
            </button>
          </div>
        </aside>

        <div className={styles.contentShell}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Interactive election scenarios</p>
              <h2>{tabs.find((tab) => tab.id === activeTab)?.label} workspace</h2>
            </div>
            <div className={styles.headerMeta}>
              <span>State, seat, and chamber results update live</span>
              <strong>Simulation only</strong>
            </div>
          </header>

          <UnifiedScenarioSummary
            activeTab={activeTab}
            baselineYear={baselineYear}
            presidentialScenario={scenario}
            houseScenario={houseScenario}
            senateScenario={senateScenario}
            shareUrl={currentShareUrl}
            onResetAll={resetAllSimulations}
            resetDisabled={isEverythingAtDefault}
          />

          {activeTab === "president" ? (
            <div
              id="president-panel"
              role="tabpanel"
              aria-labelledby="president-tab"
            >
              <ElectoralCounter
                totals={scenario.totals}
                baselineTotals={scenario.baselineTotals}
              />

              <section
                className={`${styles.workspace} ${
                  isFocusMode ? styles.focusWorkspace : ""
                }`}
                aria-label="Election scenario workspace"
              >
                <aside className={styles.leftRail} aria-label="Scenario controls">
                  <ScenarioControls
                    baselineYear={baselineYear}
                    nationalSwing={nationalSwing}
                    demographicAssumptions={demographicAssumptions}
                    onBaselineYearChange={setBaselineYear}
                    onNationalSwingChange={setNationalSwing}
                    onDemographicAssumptionChange={updateDemographicAssumption}
                    onApplyPreset={applyScenarioPreset}
                    onCopyLink={copyScenarioLink}
                    onReset={resetPresidentTab}
                  />
                </aside>

                <div className={styles.centerStage}>
                  <ElectoralMap
                    results={scenario.states}
                    selectedStateCode={selectedState.state.code}
                    customStateCodes={new Set(Object.keys(stateOverrides))}
                    onSelectState={setSelectedStateCode}
                  />
                </div>

                <aside className={styles.detailRail} aria-label="Selected state details">
                  <StateDetailPanel
                    result={selectedState}
                    stateOverride={stateOverrides[selectedState.state.code]}
                    onStateOverrideChange={(value) =>
                      updateStateOverride(selectedState.state.code, value)
                    }
                    onStateOverrideReset={() =>
                      resetStateOverride(selectedState.state.code)
                    }
                  />
                </aside>

                <aside className={styles.analysisRail} aria-label="Scenario summary and pressure points">
                  <ScenarioSummary scenario={scenario} />
                  <ScenarioComparison baselineYear={baselineYear} scenario={scenario} />
                  <MonteCarloPanel scenario={scenario} />
                  <SensitivityView scenario={scenario} />
                  <ShareCardPreview
                    baselineYear={baselineYear}
                    scenario={scenario}
                    shareUrl={currentShareUrl}
                  />
                  <ModelExplanation />
                </aside>
              </section>
            </div>
          ) : null}

          {activeTab === "house" ? (
            <div id="house-panel" role="tabpanel" aria-labelledby="house-tab">
              <LegislativeWorkspace
                chamber="house"
                scenario={houseScenario}
                selectedSeatId={selectedHouseSeatId}
                assumptions={houseScenarioAssumptions}
                presidentialAssumptions={scenarioAssumptions}
                isFocusMode={isFocusMode}
                onSelectSeat={setSelectedHouseSeatId}
                onNationalSwingChange={updateHouseSwing}
                onSliderChange={updateHouseSlider}
                onApplyPresidentAssumptions={applyPresidentAssumptionsToHouse}
                onApplyAssumptions={setHouseAssumptions}
                onStateOverrideChange={updateStateOverride}
                onStateOverrideReset={resetStateOverride}
                onSeatOverrideChange={updateHouseSeatOverride}
                onSeatOverrideReset={resetHouseSeatOverride}
                onCopyLink={copyScenarioLink}
                onReset={() => {
                  setHouseAssumptions(getDefaultLegislativeAssumptions());
                  setSelectedHouseSeatId(initialSelectedHouseSeat);
                }}
              />
            </div>
          ) : null}

          {activeTab === "senate" ? (
            <div id="senate-panel" role="tabpanel" aria-labelledby="senate-tab">
              <LegislativeWorkspace
                chamber="senate"
                scenario={senateScenario}
                selectedSeatId={selectedSenateSeatId}
                assumptions={senateScenarioAssumptions}
                presidentialAssumptions={scenarioAssumptions}
                presidentialScenario={scenario}
                isFocusMode={isFocusMode}
                onSelectSeat={setSelectedSenateSeatId}
                onNationalSwingChange={updateSenateSwing}
                onSliderChange={updateSenateSlider}
                onApplyPresidentAssumptions={applyPresidentAssumptionsToSenate}
                onApplyAssumptions={setSenateAssumptions}
                onStateOverrideChange={updateStateOverride}
                onStateOverrideReset={resetStateOverride}
                onSeatOverrideChange={updateSenateRaceOverride}
                onSeatOverrideReset={resetSenateRaceOverride}
                onCopyLink={copyScenarioLink}
                onReset={() => {
                  setSenateAssumptions(getDefaultLegislativeAssumptions());
                  setSelectedSenateSeatId(initialSelectedSenateSeat);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
