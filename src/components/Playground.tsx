"use client";

import { Building2, Landmark, Moon, Sun, Vote } from "lucide-react";
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
import { defaultDemographicAssumptions } from "@/data/demographicSliders";
import { defaultHistoricalElectionYear } from "@/data/historicalElectionData.generated";
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
  legislativeSeatFromSearchParams,
  legislativeSwingFromSearchParams,
  scenarioFromSearchParams,
  simulationTabFromSearchParams,
} from "@/lib/scenarioUrl";
import { resetBaselinePresetId } from "@/data/scenarioPresets";
import type {
  DemographicAssumptions,
  DemographicSliderId,
  HistoricalElectionYear,
  LegislativeAssumptions,
  ScenarioPreset,
  SimulationTab,
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
  const [urlReady, setUrlReady] = useState(false);

  const scenarioAssumptions = useMemo(
    () => ({
      nationalSwing,
      demographics: demographicAssumptions,
      adjustments: [],
    }),
    [demographicAssumptions, nationalSwing],
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
        houseAssumptions,
      ),
    [houseAssumptions],
  );
  const senateScenario = useMemo(
    () =>
      calculateLegislativeScenario(
        "senate",
        senateSeatBaselines,
        senateAssumptions,
      ),
    [senateAssumptions],
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
      const restoredHouseSeat = legislativeSeatFromSearchParams(searchParams, "house");
      const restoredSenateSeat = legislativeSeatFromSearchParams(searchParams, "senate");

      setActiveTab(simulationTabFromSearchParams(searchParams));
      setNationalSwing(restoredAssumptions.nationalSwing);
      setDemographicAssumptions(restoredAssumptions.demographics);
      setBaselineYear(restoredBaselineYear);
      setHouseAssumptions({
        ...getDefaultLegislativeAssumptions(),
        nationalSwing: legislativeSwingFromSearchParams(searchParams, "house"),
      });
      setSenateAssumptions({
        ...getDefaultLegislativeAssumptions(),
        nationalSwing: legislativeSwingFromSearchParams(searchParams, "senate"),
      });

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

    const scenarioUrl = appScenarioToUrl({
      activeTab,
      basePath: window.location.pathname,
      baselineYear,
      presidentialAssumptions: scenarioAssumptions,
      houseSwing: houseAssumptions.nationalSwing,
      senateSwing: senateAssumptions.nationalSwing,
      houseSeatId: selectedHouseSeatId,
      senateSeatId: selectedSenateSeatId,
    });
    window.history.replaceState(null, "", scenarioUrl);
  }, [
    activeTab,
    baselineYear,
    houseAssumptions.nationalSwing,
    scenarioAssumptions,
    selectedHouseSeatId,
    selectedSenateSeatId,
    senateAssumptions.nationalSwing,
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
      houseSwing: houseAssumptions.nationalSwing,
      senateSwing: senateAssumptions.nationalSwing,
      houseSeatId: selectedHouseSeatId,
      senateSeatId: selectedSenateSeatId,
    });

    return new URL(relativeUrl, window.location.origin).href;
  }, [
    activeTab,
    baselineYear,
    houseAssumptions.nationalSwing,
    scenarioAssumptions,
    selectedHouseSeatId,
    selectedSenateSeatId,
    senateAssumptions.nationalSwing,
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
      houseSwing: houseAssumptions.nationalSwing,
      senateSwing: senateAssumptions.nationalSwing,
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
    houseAssumptions.nationalSwing,
    scenarioAssumptions,
    selectedHouseSeatId,
    selectedSenateSeatId,
    senateAssumptions.nationalSwing,
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

  function updateSenateSwing(value: number) {
    setSenateAssumptions((currentAssumptions) => ({
      ...currentAssumptions,
      nationalSwing: value,
    }));
  }

  function resetPresidentTab() {
    setBaselineYear(defaultHistoricalElectionYear);
    setNationalSwing(0);
    setDemographicAssumptions({ ...defaultDemographicAssumptions });
    setSelectedStateCode(initialSelectedState);
  }

  return (
    <main className={styles.shell} data-theme={themeMode}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Interactive Electoral College scenarios
          </p>
          <h1>Election Forecast Playground</h1>
        </div>
        <div className={styles.headerMeta}>
          <span>State colors and electoral votes update live</span>
          <strong>Simulation only</strong>
          <div className={styles.themeSwitch} aria-label="Display mode">
            <button
              aria-label="Use light aero mode"
              aria-pressed={themeMode === "light"}
              className={themeMode === "light" ? styles.activeThemeButton : ""}
              onClick={() => setThemeMode("light")}
              title="Light aero mode"
              type="button"
            >
              <Sun size={15} strokeWidth={2.2} />
              <span>Light</span>
            </button>
            <button
              aria-label="Use dark tactical mode"
              aria-pressed={themeMode === "dark"}
              className={themeMode === "dark" ? styles.activeThemeButton : ""}
              onClick={() => setThemeMode("dark")}
              title="Dark tactical mode"
              type="button"
            >
              <Moon size={15} strokeWidth={2.2} />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </header>

      <nav className={styles.tabBar} aria-label="Simulation modes">
        {tabs.map(({ Icon, detail, id, label }) => (
          <button
            aria-current={activeTab === id ? "page" : undefined}
            className={activeTab === id ? styles.activeTab : ""}
            key={id}
            onClick={() => setActiveTab(id)}
            type="button"
          >
            <Icon size={16} strokeWidth={2.2} />
            <span>{label}</span>
            <small>{detail}</small>
          </button>
        ))}
      </nav>

      {activeTab === "president" ? (
        <>
          <ElectoralCounter
            totals={scenario.totals}
            baselineTotals={scenario.baselineTotals}
          />

          <section className={styles.workspace} aria-label="Election scenario workspace">
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
                onSelectState={setSelectedStateCode}
              />
            </div>

            <aside className={styles.detailRail} aria-label="Selected state details">
              <StateDetailPanel result={selectedState} />
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
        </>
      ) : null}

      {activeTab === "house" ? (
        <LegislativeWorkspace
          chamber="house"
          scenario={houseScenario}
          selectedSeatId={selectedHouseSeatId}
          nationalSwing={houseAssumptions.nationalSwing}
          onSelectSeat={setSelectedHouseSeatId}
          onNationalSwingChange={updateHouseSwing}
          onCopyLink={copyScenarioLink}
          onReset={() => {
            setHouseAssumptions(getDefaultLegislativeAssumptions());
            setSelectedHouseSeatId(initialSelectedHouseSeat);
          }}
        />
      ) : null}

      {activeTab === "senate" ? (
        <LegislativeWorkspace
          chamber="senate"
          scenario={senateScenario}
          selectedSeatId={selectedSenateSeatId}
          nationalSwing={senateAssumptions.nationalSwing}
          onSelectSeat={setSelectedSenateSeatId}
          onNationalSwingChange={updateSenateSwing}
          onCopyLink={copyScenarioLink}
          onReset={() => {
            setSenateAssumptions(getDefaultLegislativeAssumptions());
            setSelectedSenateSeatId(initialSelectedSenateSeat);
          }}
        />
      ) : null}
    </main>
  );
}
