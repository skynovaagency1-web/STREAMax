import { describe, expect, it } from "vitest";
import { computePayouts, splitRevenue } from "./revenue";
import { adSchedule } from "./ads";
import { canWatch } from "./plans";

describe("splitRevenue", () => {
  it("gives creators 70% and the platform 30%", () => {
    expect(splitRevenue(10_000)).toEqual({ creatorCents: 7_000, platformCents: 3_000 });
  });
  it("never loses a cent when rounding", () => {
    const { creatorCents, platformCents } = splitRevenue(333);
    expect(creatorCents + platformCents).toBe(333);
    expect(creatorCents).toBe(233);
  });
  it("rejects invalid amounts", () => {
    expect(() => splitRevenue(-1)).toThrow();
    expect(() => splitRevenue(1.5)).toThrow();
  });
});

describe("computePayouts", () => {
  it("allocates the pool by watch time and keeps totals exact", () => {
    const result = computePayouts(100_000, [
      { creatorId: "a", minutes: 600 },
      { creatorId: "b", minutes: 300 },
      { creatorId: "c", minutes: 100 },
    ]);
    const a = result.lines.find((l) => l.creatorId === "a")!;
    expect(a.grossCents).toBe(60_000);
    expect(a.creatorCents).toBe(42_000);
    expect(result.lines.reduce((s, l) => s + l.grossCents, 0)).toBe(100_000);
    expect(result.creatorTotalCents + result.platformTotalCents).toBe(100_000);
  });
  it("merges duplicate creators and ignores zero minutes", () => {
    const result = computePayouts(1_000, [
      { creatorId: "a", minutes: 5 },
      { creatorId: "a", minutes: 5 },
      { creatorId: "b", minutes: 0 },
    ]);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].grossCents).toBe(1_000);
  });
  it("distributes remainders so uneven splits still sum to the pool", () => {
    const result = computePayouts(100, [
      { creatorId: "a", minutes: 1 },
      { creatorId: "b", minutes: 1 },
      { creatorId: "c", minutes: 1 },
    ]);
    expect(result.lines.reduce((s, l) => s + l.grossCents, 0)).toBe(100);
  });
  it("keeps the whole pool for the platform when nobody watched", () => {
    expect(computePayouts(500, []).platformTotalCents).toBe(500);
  });
});

describe("ads and plans", () => {
  it("free viewers get a pre-roll and mid-rolls; paid viewers get none", () => {
    const free = adSchedule("free", 60 * 60);
    expect(free[0]).toEqual({ at: 0, durationSec: 15 });
    expect(free.length).toBe(4);
    expect(adSchedule("standard", 60 * 60)).toEqual([]);
  });
  it("gates content by plan", () => {
    expect(canWatch("free", "standard")).toBe(false);
    expect(canWatch("premium", "standard")).toBe(true);
  });
});

import { CLASSICS } from "./classics";
import { TITLES, getTitleBySlug } from "./catalog";

describe("public-domain classics", () => {
  it("are free, pre-1931, and stream an archive.org MP4", () => {
    for (const t of CLASSICS) {
      expect(t.minPlan).toBe("free");
      expect(t.year).toBeLessThan(1931);
      expect(t.streamUrl).toMatch(/^https:\/\/archive\.org\/download\/.+\.mp4$/);
      expect(t.source.type).toBe("public-domain");
    }
  });
  it("have unique ids and slugs across the whole catalog", () => {
    expect(new Set(TITLES.map((t) => t.id)).size).toBe(TITLES.length);
    expect(new Set(TITLES.map((t) => t.slug)).size).toBe(TITLES.length);
    expect(getTitleBySlug("nosferatu")?.director).toBe("F. W. Murnau");
  });
});

describe("Creative Commons open movies", () => {
  it("are free, credited and have real artwork", async () => {
    const { OPEN_MOVIES } = await import("./openMovies");
    expect(OPEN_MOVIES.length).toBeGreaterThanOrEqual(5);
    for (const t of OPEN_MOVIES) {
      expect(t.minPlan).toBe("free");
      expect(t.source.type).toBe("creative-commons");
      if (t.source.type === "creative-commons") expect(t.source.license).toMatch(/^CC BY/);
      expect(t.artwork.poster).toMatch(/^https:\/\//);
      expect(t.streamUrl).toMatch(/\.(mp4|webm)$/);
    }
  });
});
