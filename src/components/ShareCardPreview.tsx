import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatSwing } from "@/lib/format";
import type { HistoricalElectionYear, ScenarioResult } from "@/types/election";
import styles from "@/components/Playground.module.css";

type ShareCardPreviewProps = {
  baselineYear: HistoricalElectionYear;
  scenario: ScenarioResult;
  shareUrl: string;
};

type CopyStatus = "idle" | "copied" | "failed";

function createEmbedCode(shareUrl: string) {
  if (!shareUrl) {
    return "";
  }

  return `<iframe title="Election Forecast Playground scenario" src="${shareUrl}" width="100%" height="720" loading="lazy"></iframe>`;
}

function fallbackCopy(text: string) {
  const textArea = document.createElement("textarea");

  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    throw new Error("Copy failed");
  }
}

async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) {
    fallbackCopy(text);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    fallbackCopy(text);
  }
}

export function ShareCardPreview({
  baselineYear,
  scenario,
  shareUrl,
}: ShareCardPreviewProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const embedCode = useMemo(() => createEmbedCode(shareUrl), [shareUrl]);

  useEffect(() => {
    return () => {
      if (copyStatusTimeoutRef.current) {
        clearTimeout(copyStatusTimeoutRef.current);
      }
    };
  }, []);

  async function copyEmbedCode() {
    if (!embedCode) {
      setCopyStatus("failed");
      return;
    }

    try {
      await copyText(embedCode);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }

    if (copyStatusTimeoutRef.current) {
      clearTimeout(copyStatusTimeoutRef.current);
    }

    copyStatusTimeoutRef.current = setTimeout(() => {
      setCopyStatus("idle");
    }, 2800);
  }

  return (
    <section className={styles.panel} aria-label="Embed/share card preview">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.sectionKicker}>Share</p>
          <h2>Card preview</h2>
        </div>
        <span className={styles.summaryPill}>
          <Share2 size={13} strokeWidth={2.2} />
          Embed
        </span>
      </div>

      <div className={styles.sharePreviewCard}>
        <span>Election Forecast Playground</span>
        <strong>{baselineYear} scenario</strong>
        <dl>
          <div>
            <dt>D EV</dt>
            <dd>{scenario.totals.democratic}</dd>
          </div>
          <div>
            <dt>R EV</dt>
            <dd>{scenario.totals.republican}</dd>
          </div>
          <div>
            <dt>Swing</dt>
            <dd>{formatSwing(scenario.assumptions.nationalSwing)}</dd>
          </div>
          <div>
            <dt>Flips</dt>
            <dd>{scenario.flippedStates.length}</dd>
          </div>
        </dl>
        <small>Simulation only</small>
      </div>

      <div className={styles.embedActions}>
        <code>{embedCode || "Scenario URL loading"}</code>
        <button
          className={styles.shareButton}
          type="button"
          onClick={copyEmbedCode}
          aria-label={copyStatus === "copied" ? "Embed code copied" : "Copy embed code"}
          disabled={!embedCode}
        >
          {copyStatus === "copied" ? (
            <Check size={16} strokeWidth={2.3} />
          ) : (
            <Copy size={16} strokeWidth={2.3} />
          )}
          <span aria-live="polite">
            {copyStatus === "copied"
              ? "Copied"
              : copyStatus === "failed"
                ? "Copy failed"
                : "Copy embed"}
          </span>
        </button>
      </div>
    </section>
  );
}
