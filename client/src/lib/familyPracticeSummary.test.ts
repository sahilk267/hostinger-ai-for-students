import { describe, expect, it } from "vitest";
import { buildFamilyPracticeSnapshot, formatFamilySnapshot } from "./familyPracticeSummary";
import { getLearningProgress } from "./learningProgress";

describe("parent family practice snapshot data boundaries", () => {
  const now = new Date("2026-11-13T12:00:00.000Z");

  it("does not invent activity for an empty device", () => {
    const progress = getLearningProgress();
    const snapshot = buildFamilyPracticeSnapshot(progress, now);
    expect(snapshot.gamesTried).toBe(0);
    expect(snapshot.gamesCompleted).toBe(0);
    expect(snapshot.recentGames).toHaveLength(0);
    expect(snapshot.summary).toMatch(/No game starts/);
    expect(snapshot.nextSuggestion.href).toContain("/discovery-lab");
  });

  it("counts distinct games not total sessions and records only latest visit", () => {
    const progress = getLearningProgress();
    progress["pattern-builder"] = {
      attempts: 5, completions: 2, bestScore: 4, lastScore: 3,
      lastPlayed: "2026-11-12T09:00:00.000Z"
    };
    progress.robotics = {
      attempts: 2, completions: 0, bestScore: 0, lastScore: 0,
      lastPlayed: "2026-11-10T09:00:00.000Z"
    };
    const snapshot = buildFamilyPracticeSnapshot(progress, now);
    expect(snapshot.gamesTried).toBe(2);
    expect(snapshot.gamesCompleted).toBe(1);
    expect(snapshot.recentGames).toHaveLength(2);
    expect(snapshot.recentGames.map(row => row.id)).toEqual(["pattern-builder","robotics"]);
    expect(formatFamilySnapshot(snapshot)).toMatch(/Only each game's latest recorded visit/);
    expect(formatFamilySnapshot(snapshot)).toMatch(/total recorded completions: 2/);
  });

  it("excludes visits outside the seven-day window or in the future", () => {
    const progress = getLearningProgress();
    progress["mini-scientist"].attempts = 1;
    progress["mini-scientist"].lastPlayed = "2026-11-04T09:00:00.000Z";
    progress["robot-programmer"].attempts = 1;
    progress["robot-programmer"].lastPlayed = "2026-12-10T09:00:00.000Z";
    const snapshot = buildFamilyPracticeSnapshot(progress, now);
    expect(snapshot.gamesTried).toBe(2);
    expect(snapshot.recentGames).toHaveLength(0);
    expect(snapshot.summary).toMatch(/no last-played dates/);
  });

  it("offers a real practical next step rather than a diagnostic interpretation", () => {
    const progress = getLearningProgress();
    for (const id of ["pattern-builder","mini-scientist","robot-programmer","fact-check-quest"] as const) {
      progress[id].attempts = 3;
      progress[id].completions = 1;
    }
    const snapshot = buildFamilyPracticeSnapshot(progress,now);
    expect(snapshot.nextSuggestion.href).toMatch(/^\//);
    expect(formatFamilySnapshot(snapshot)).toContain("Not an assessment, diagnosis");
  });
});
