"use client";

import { Moon, Sun } from "lucide-react";
import { useMemo, useState } from "react";
import { ElectoralCounter } from "@/components/ElectoralCounter";
import { ElectoralMap } from "@/components/ElectoralMap";
import { ModelExplanation } from "@/components/ModelExplanation";
import { ScenarioControls } from "@/components/ScenarioControls";
import { ScenarioSummary } from "@/components/ScenarioSummary";
import { StateDetailPanel } from "@/components/StateDetailPanel";
import { stateBaselines } from "@/data/states";
import { calculateScenario } from "@/lib/calculateScenario";
import styles from "@/components/Playground.module.css";

const initialSelectedState = "PA";
type ThemeMode = "light" | "dark";

export function Playground() {
  const [nationalSwing, setNationalSwing] = useState(0);
  const [selectedStateCode, setSelectedStateCode] = useState(initialSelectedState);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const scenario = useMemo(
    () =>
      calculateScenario(stateBaselines, {
        nationalSwing,
        adjustments: [],
      }),
    [nationalSwing],
  );

  const selectedState = useMemo(() => {
    return (
      scenario.states.find((state) => state.state.code === selectedStateCode) ??
      scenario.states[0]
    );
  }, [scenario.states, selectedStateCode]);

  return (
    <main className={styles.shell} data-theme={themeMode}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {themeMode === "dark"
              ? "Simulation playground / EV-grid 2040"
              : "Simulation playground / aero EV grid"}
          </p>
          <h1>
            {themeMode === "dark"
              ? "Election Forecast Tactical Grid"
              : "Election Forecast Aero Grid"}
          </h1>
        </div>
        <div className={styles.headerMeta}>
          <span>MODEL: uniform national swing // EV 538</span>
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

      <ElectoralCounter
        totals={scenario.totals}
        baselineTotals={scenario.baselineTotals}
      />

      <section className={styles.workspace} aria-label="Election scenario workspace">
        <ElectoralMap
          results={scenario.states}
          selectedStateCode={selectedState.state.code}
          onSelectState={setSelectedStateCode}
        />

        <aside className={styles.controlRail} aria-label="Scenario controls and details">
          <ScenarioControls
            nationalSwing={nationalSwing}
            onNationalSwingChange={setNationalSwing}
            onReset={() => {
              setNationalSwing(0);
              setSelectedStateCode(initialSelectedState);
            }}
          />
          <StateDetailPanel result={selectedState} />
          <ScenarioSummary scenario={scenario} />
          <ModelExplanation />
        </aside>
      </section>
    </main>
  );
}
