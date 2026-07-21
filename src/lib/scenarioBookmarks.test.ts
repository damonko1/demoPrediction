import { describe, expect, it } from "vitest";
import {
  deleteScenarioBookmark,
  normalizeScenarioBookmarkName,
  normalizeScenarioBookmarkUrl,
  readScenarioBookmarks,
  saveScenarioBookmark,
  writeScenarioBookmarks,
  type ScenarioBookmark,
} from "@/lib/scenarioBookmarks";

function createStorage(initialValue: string | null = null) {
  let value = initialValue;

  return {
    getItem: () => value,
    setItem: (_key: string, nextValue: string) => {
      value = nextValue;
    },
  };
}

function bookmark(id: string, savedAt: number): ScenarioBookmark {
  return { id, name: `Scenario ${id}`, url: `/?swing=${id}`, savedAt };
}

describe("scenario bookmarks", () => {
  it("normalizes names and rejects blank names", () => {
    expect(normalizeScenarioBookmarkName("  Midterm   wave  ")).toBe("Midterm wave");
    expect(saveScenarioBookmark({ bookmarks: [], name: "   ", url: "/", now: 1 })).toBeNull();
    expect(
      saveScenarioBookmark({
        bookmarks: [],
        name: "Unsafe",
        url: "//unrelated.test/scenario",
        now: 1,
      }),
    ).toBeNull();
  });

  it("stores only same-origin scenario paths", () => {
    expect(
      normalizeScenarioBookmarkUrl(
        "https://forecast.test/?tab=house&swing=3#map",
        "https://forecast.test/",
      ),
    ).toBe("/?tab=house&swing=3#map");
    expect(normalizeScenarioBookmarkUrl("/?tab=senate", "https://forecast.test/")).toBe(
      "/?tab=senate",
    );
    expect(
      normalizeScenarioBookmarkUrl("https://unrelated.test/", "https://forecast.test/"),
    ).toBeNull();
    expect(normalizeScenarioBookmarkUrl("javascript:alert(1)")).toBeNull();
  });

  it("replaces names case-insensitively and caps the saved list", () => {
    const first = saveScenarioBookmark({
      bookmarks: [bookmark("old", 1)],
      name: "My race",
      url: "/?swing=1",
      maxItems: 2,
      now: 2,
    });
    expect(first?.bookmarks).toHaveLength(2);

    const replaced = saveScenarioBookmark({
      bookmarks: first?.bookmarks ?? [],
      name: "my RACE",
      url: "/?swing=4",
      maxItems: 2,
      now: 3,
    });
    expect(replaced?.replaced).toBe(true);
    expect(replaced?.bookmarks).toHaveLength(2);
    expect(replaced?.bookmarks[0]).toMatchObject({ name: "my RACE", url: "/?swing=4" });
  });

  it("round-trips, sorts, deletes, and tolerates malformed storage", () => {
    const storage = createStorage();
    const items = [bookmark("older", 1), bookmark("newer", 2)];
    expect(writeScenarioBookmarks(storage, items)).toBe(true);
    expect(readScenarioBookmarks(storage).map(({ id }) => id)).toEqual(["newer", "older"]);
    expect(deleteScenarioBookmark(items, "older").map(({ id }) => id)).toEqual(["newer"]);
    expect(readScenarioBookmarks(createStorage("not-json"))).toEqual([]);
    expect(
      readScenarioBookmarks(
        createStorage(
          JSON.stringify({
            version: 1,
            items: [{ id: "bad", name: "Bad", url: "//unrelated.test", savedAt: 3 }],
          }),
        ),
      ),
    ).toEqual([]);
    expect(readScenarioBookmarks({ getItem: () => { throw new Error("blocked"); } })).toEqual([]);
    expect(writeScenarioBookmarks({ setItem: () => { throw new Error("full"); } }, items)).toBe(false);
  });
});
