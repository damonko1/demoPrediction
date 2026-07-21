"use client";

import { RotateCcw, Vote } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="fatal-error-shell">
      <section className="fatal-error-card" role="alert" aria-labelledby="error-title">
        <span className="fatal-error-mark" aria-hidden="true">
          <Vote size={28} strokeWidth={2.3} />
        </span>
        <p className="fatal-error-eyebrow">Simulation interrupted</p>
        <h1 id="error-title">This scenario could not be displayed.</h1>
        <p>
          Your browser is still responsive. Try rebuilding the current view; if
          the issue persists, reload the app to return to a clean scenario.
        </p>
        <div className="fatal-error-actions">
          <button onClick={reset} type="button">
            <RotateCcw size={17} aria-hidden="true" />
            Try again
          </button>
          <button onClick={() => window.location.reload()} type="button">
            Reload app
          </button>
        </div>
        {error.digest ? <small>Reference: {error.digest}</small> : null}
      </section>
    </main>
  );
}
