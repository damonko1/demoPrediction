"use client";

import { Bookmark, Check, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SCENARIO_BOOKMARK_LIMIT,
  SCENARIO_BOOKMARK_NAME_LIMIT,
  SCENARIO_BOOKMARKS_STORAGE_KEY,
  deleteScenarioBookmark,
  normalizeScenarioBookmarkUrl,
  readScenarioBookmarks,
  saveScenarioBookmark,
  writeScenarioBookmarks,
  type ScenarioBookmark,
} from "@/lib/scenarioBookmarks";
import styles from "@/components/ScenarioBookmarks.module.css";

export type ScenarioBookmarksProps = {
  currentUrl: string;
  className?: string;
  maxItems?: number;
  storageKey?: string;
  onLoadScenario?: (url: string, bookmark: ScenarioBookmark) => void;
};

type BookmarkStatus =
  | { kind: "idle"; message: "" }
  | { kind: "success" | "error"; message: string };

function getBrowserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function ScenarioBookmarks({
  currentUrl,
  className,
  maxItems = DEFAULT_SCENARIO_BOOKMARK_LIMIT,
  storageKey = SCENARIO_BOOKMARKS_STORAGE_KEY,
  onLoadScenario,
}: ScenarioBookmarksProps) {
  const bookmarkLimit = Number.isFinite(maxItems)
    ? Math.max(1, Math.floor(maxItems))
    : DEFAULT_SCENARIO_BOOKMARK_LIMIT;
  const [bookmarks, setBookmarks] = useState<ScenarioBookmark[]>([]);
  const [name, setName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [status, setStatus] = useState<BookmarkStatus>({ kind: "idle", message: "" });
  const selectedBookmark = useMemo(
    () => bookmarks.find((bookmark) => bookmark.id === selectedId) ?? null,
    [bookmarks, selectedId],
  );

  useEffect(() => {
    const storage = getBrowserStorage();
    if (!storage) {
      setStorageAvailable(false);
      return;
    }

    const savedBookmarks = readScenarioBookmarks(storage, storageKey);
    setBookmarks(savedBookmarks);
    setSelectedId(savedBookmarks[0]?.id ?? "");
  }, [storageKey]);

  useEffect(() => {
    function syncBookmarks(event: StorageEvent) {
      if (event.key !== storageKey) {
        return;
      }

      const storage = getBrowserStorage();
      if (!storage) {
        return;
      }

      const savedBookmarks = readScenarioBookmarks(storage, storageKey);
      setBookmarks(savedBookmarks);
      setSelectedId((currentId) =>
        savedBookmarks.some(({ id }) => id === currentId)
          ? currentId
          : (savedBookmarks[0]?.id ?? ""),
      );
    }

    window.addEventListener("storage", syncBookmarks);
    return () => window.removeEventListener("storage", syncBookmarks);
  }, [storageKey]);

  function persist(nextBookmarks: ScenarioBookmark[]) {
    const storage = getBrowserStorage();
    if (!storage || !writeScenarioBookmarks(storage, nextBookmarks, storageKey)) {
      setStorageAvailable(false);
      setStatus({
        kind: "error",
        message: "Browser storage is unavailable, so this change was not saved.",
      });
      return false;
    }

    setBookmarks(nextBookmarks);
    return true;
  }

  function handleSave() {
    const normalizedUrl = normalizeScenarioBookmarkUrl(currentUrl, window.location.href);
    const result = normalizedUrl
      ? saveScenarioBookmark({ bookmarks, name, url: normalizedUrl, maxItems: bookmarkLimit })
      : null;

    if (!result) {
      setStatus({
        kind: "error",
        message: name.trim() ? "The current scenario URL cannot be saved." : "Enter a name first.",
      });
      return;
    }

    if (!persist(result.bookmarks)) {
      return;
    }

    setName("");
    setSelectedId(result.saved.id);
    setStatus({
      kind: "success",
      message: result.replaced ? "Saved scenario updated." : "Scenario saved in this browser.",
    });
  }

  function handleLoad() {
    if (!selectedBookmark) {
      return;
    }

    if (onLoadScenario) {
      onLoadScenario(selectedBookmark.url, selectedBookmark);
      return;
    }

    window.location.assign(selectedBookmark.url);
  }

  function handleDelete() {
    if (!selectedBookmark) {
      return;
    }

    const remaining = deleteScenarioBookmark(bookmarks, selectedBookmark.id);
    if (!persist(remaining)) {
      return;
    }

    setSelectedId(remaining[0]?.id ?? "");
    setStatus({ kind: "success", message: "Saved scenario deleted." });
  }

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(" ")}
      aria-label="Saved scenarios"
    >
      <div className={styles.heading}>
        <span className={styles.icon} aria-hidden="true"><Bookmark size={15} /></span>
        <div>
          <strong>Saved scenarios</strong>
          <small>Local to this browser</small>
        </div>
      </div>

      <div className={styles.saveGroup}>
        <label className={styles.nameField}>
          <span className={styles.srOnly}>Scenario name</span>
          <input
            maxLength={SCENARIO_BOOKMARK_NAME_LIMIT}
            onChange={(event) => {
              setName(event.target.value);
              if (status.kind !== "idle") {
                setStatus({ kind: "idle", message: "" });
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSave();
              }
            }}
            placeholder="Name this scenario"
            type="text"
            value={name}
          />
        </label>
        <button
          className={styles.primaryButton}
          disabled={!storageAvailable || !currentUrl || !name.trim()}
          onClick={handleSave}
          type="button"
        >
          <Save size={14} />
          Save
        </button>
      </div>

      <div className={styles.loadGroup}>
        <label className={styles.selectField}>
          <span className={styles.srOnly}>Choose a saved scenario</span>
          <select
            disabled={bookmarks.length === 0}
            onChange={(event) => {
              setSelectedId(event.target.value);
              setStatus({ kind: "idle", message: "" });
            }}
            value={selectedId}
          >
            {bookmarks.length === 0 ? (
              <option value="">No saved scenarios</option>
            ) : null}
            {bookmarks.map((bookmark) => (
              <option key={bookmark.id} value={bookmark.id}>
                {bookmark.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className={styles.secondaryButton}
          disabled={!selectedBookmark}
          onClick={handleLoad}
          type="button"
        >
          Load
        </button>
        <button
          aria-label={selectedBookmark ? `Delete ${selectedBookmark.name}` : "Delete saved scenario"}
          className={styles.deleteButton}
          disabled={!selectedBookmark}
          onClick={handleDelete}
          title="Delete saved scenario"
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <p
        aria-live="polite"
        className={`${styles.status} ${status.kind === "error" ? styles.error : ""}`}
      >
        {status.kind === "success" ? <Check size={12} aria-hidden="true" /> : null}
        {status.message || `${bookmarks.length} of ${bookmarkLimit} saved`}
      </p>
    </section>
  );
}
