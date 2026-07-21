export const SCENARIO_BOOKMARKS_STORAGE_KEY =
  "election-forecast-playground:scenario-bookmarks";
export const DEFAULT_SCENARIO_BOOKMARK_LIMIT = 20;
export const SCENARIO_BOOKMARK_NAME_LIMIT = 60;

export type ScenarioBookmark = {
  id: string;
  name: string;
  url: string;
  savedAt: number;
};

type ScenarioBookmarkStore = {
  version: 1;
  items: ScenarioBookmark[];
};

export type SaveScenarioBookmarkResult = {
  bookmarks: ScenarioBookmark[];
  saved: ScenarioBookmark;
  replaced: boolean;
};

function isScenarioBookmark(value: unknown): value is ScenarioBookmark {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ScenarioBookmark>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    candidate.name.length <= SCENARIO_BOOKMARK_NAME_LIMIT &&
    typeof candidate.url === "string" &&
    candidate.url.startsWith("/") &&
    !candidate.url.startsWith("//") &&
    typeof candidate.savedAt === "number" &&
    Number.isFinite(candidate.savedAt)
  );
}

function createBookmarkId(now: number) {
  const randomId = globalThis.crypto?.randomUUID?.();
  return randomId ?? `${now.toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeScenarioBookmarkName(name: string) {
  return name.trim().replace(/\s+/g, " ").slice(0, SCENARIO_BOOKMARK_NAME_LIMIT);
}

/**
 * Stores a same-site path instead of an origin so bookmarks survive deployment
 * URL changes and cannot navigate to an unrelated website.
 */
export function normalizeScenarioBookmarkUrl(
  url: string,
  baseUrl = "https://scenario.local/",
) {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return null;
  }

  try {
    const base = new URL(baseUrl);
    const parsed = new URL(trimmedUrl, base);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    if (parsed.origin !== base.origin) {
      return null;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

export function readScenarioBookmarks(
  storage: Pick<Storage, "getItem">,
  storageKey = SCENARIO_BOOKMARKS_STORAGE_KEY,
) {
  try {
    const rawValue = storage.getItem(storageKey);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as Partial<ScenarioBookmarkStore>;
    if (parsed.version !== 1 || !Array.isArray(parsed.items)) {
      return [];
    }

    return parsed.items
      .filter(isScenarioBookmark)
      .sort((left, right) => right.savedAt - left.savedAt)
      .slice(0, DEFAULT_SCENARIO_BOOKMARK_LIMIT);
  } catch {
    return [];
  }
}

export function writeScenarioBookmarks(
  storage: Pick<Storage, "setItem">,
  bookmarks: ScenarioBookmark[],
  storageKey = SCENARIO_BOOKMARKS_STORAGE_KEY,
) {
  try {
    const payload: ScenarioBookmarkStore = { version: 1, items: bookmarks };
    storage.setItem(storageKey, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function saveScenarioBookmark({
  bookmarks,
  name,
  url,
  maxItems = DEFAULT_SCENARIO_BOOKMARK_LIMIT,
  now = Date.now(),
}: {
  bookmarks: ScenarioBookmark[];
  name: string;
  url: string;
  maxItems?: number;
  now?: number;
}): SaveScenarioBookmarkResult | null {
  const normalizedName = normalizeScenarioBookmarkName(name);
  const normalizedUrl = normalizeScenarioBookmarkUrl(url);
  if (!normalizedName || !normalizedUrl) {
    return null;
  }

  const validBookmarks = bookmarks.filter(isScenarioBookmark);
  const existing = validBookmarks.find(
    (bookmark) => bookmark.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
  );
  const savedAt = Number.isFinite(now) ? now : Date.now();
  const saved: ScenarioBookmark = {
    id: existing?.id ?? createBookmarkId(savedAt),
    name: normalizedName,
    url: normalizedUrl,
    savedAt,
  };
  const safeLimit = Number.isFinite(maxItems)
    ? Math.max(1, Math.floor(maxItems))
    : DEFAULT_SCENARIO_BOOKMARK_LIMIT;
  const nextBookmarks = [
    saved,
    ...validBookmarks.filter((bookmark) => bookmark.id !== existing?.id),
  ]
    .sort((left, right) => right.savedAt - left.savedAt)
    .slice(0, safeLimit);

  return {
    bookmarks: nextBookmarks,
    saved,
    replaced: Boolean(existing),
  };
}

export function deleteScenarioBookmark(bookmarks: ScenarioBookmark[], id: string) {
  return bookmarks.filter((bookmark) => bookmark.id !== id);
}
