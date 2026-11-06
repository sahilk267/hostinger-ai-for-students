import { describe, expect, it } from "vitest";
import { ALL_ADVENTURE_MISSIONS, getAgeAdventureMissions, type AdventureAttempt } from "../client/src/data/discoveryAdventure";
import { buildAdventurePracticeReport, classifyAdventureMission, COMPLETION_POLICY_VERSION, getAdventureSkillLabel } from "../client/src/data/discoveryReport";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const record = (overrides: Partial<AdventureAttempt> = {}): AdventureAttempt => ({
  firstCorrect: true,
  firstIndependent: true,
  bestCorrect: true,
  attempts: 1,
  hintsUsed: 0,
  enjoyed: null,
  updatedAt: "2026-11-06T00:00:00.000Z",
  ...overrides,
});

describe("Discovery Adventure parent report and completion eligibility", () => {
  it("requires all nine age-specific missions to have been solved at least once", () => {
    const missions = getAgeAdventureMissions("8-10");
    const all = Object.fromEntries(missions.map((mission) => [mission.id, record()]));
    const complete = buildAdventurePracticeReport("8-10", all);
    expect(complete).toMatchObject({ attempted: 9, solved: 9, independentFirst: 9, completed: true, policyVersion: COMPLETION_POLICY_VERSION });
    expect(complete.completedAt).toBe("2026-11-06T00:00:00.000Z");

    const wrongLast = { ...all, [missions[8].id]: record({ firstCorrect: false, firstIndependent: false, bestCorrect: false, attempts: 2 }) };
    const partial = buildAdventurePracticeReport("8-10", wrongLast);
    expect(partial.attempted).toBe(9);
    expect(partial.solved).toBe(8);
    expect(partial.completed).toBe(false);
    expect(partial.completedAt).toBeNull();
    expect(partial.nextMission?.id).toBe(missions[8].id);
  });

  it("does not mistake one age group's completion for another", () => {
    const band8 = getAgeAdventureMissions("8-10");
    const records = Object.fromEntries(band8.map((mission) => [mission.id, record()]));
    expect(buildAdventurePracticeReport("8-10", records).completed).toBe(true);
    expect(buildAdventurePracticeReport("11-13", records)).toMatchObject({ attempted: 0, solved: 0, completed: false });
    expect(buildAdventurePracticeReport("14-17", records)).toMatchObject({ attempted: 0, solved: 0, completed: false });
    expect(ALL_ADVENTURE_MISSIONS).toHaveLength(27);
  });

  it("keeps independent, hinted and revised performance separate", () => {
    const [first, hinted, revised, wrong] = getAgeAdventureMissions("14-17");
    const records = {
      [first.id]: record({ enjoyed: true }),
      [hinted.id]: record({ firstIndependent: false, firstCorrect: true, hintsUsed: 1, enjoyed: null }),
      [revised.id]: record({ firstCorrect: false, firstIndependent: false, bestCorrect: true, attempts: 3, hintsUsed: 2, enjoyed: false }),
      [wrong.id]: record({ firstCorrect: false, firstIndependent: false, bestCorrect: false, attempts: 2, hintsUsed: 1 }),
    };
    const report = buildAdventurePracticeReport("14-17", records);
    expect(report).toMatchObject({
      attempted: 4, solved: 3, independentFirst: 1, firstWithHint: 1,
      improvedAfterRetry: 1, stillNeedsRetry: 1, totalHints: 4,
      reportedEnjoyment: 1, reviewedInterest: 2, completed: false,
    });
    expect(report.nextMission?.id).toBe(wrong.id);
    expect(report.worldDetails.reduce((sum, item) => sum + item.solved, 0)).toBe(3);
    expect(report.worldDetails.flatMap((world) => world.entries)).toHaveLength(9);
    expect(report.worldDetails.every((world) => world.familyPrompt.en.length > 30)).toBe(true);
    expect(classifyAdventureMission(records[first.id])).toBe("first_try_independent");
    expect(classifyAdventureMission(records[hinted.id])).toBe("first_try_with_hint");
    expect(classifyAdventureMission(records[revised.id])).toBe("solved_after_practice");
    expect(classifyAdventureMission(records[wrong.id])).toBe("needs_retry");
    expect(classifyAdventureMission(undefined)).toBe("not_started");
  });

  it("never claims a completion timestamp based on missing or invalid browser dates", () => {
    const all = Object.fromEntries(getAgeAdventureMissions("11-13").map((mission) => [mission.id, record()]));
    all[getAgeAdventureMissions("11-13")[2].id] = record({ updatedAt: "not-a-date" });
    const report = buildAdventurePracticeReport("11-13", all);
    expect(report.completed).toBe(true);
    expect(report.completedAt).toBeNull();
  });

  it("localizes task labels and retains explicit limitations in printable UI", () => {
    for (const locale of ["en", "hi", "hinglish"] as const) {
      expect(getAdventureSkillLabel("planning", locale).length).toBeGreaterThan(2);
      expect(getAdventureSkillLabel("reflection", locale).length).toBeGreaterThan(2);
    }
    const source = readFileSync(resolve(process.cwd(), "client/src/components/DiscoveryParentReport.tsx"), "utf8");
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/DiscoveryAdventurePage.tsx"), "utf8");
    const css = readFileSync(resolve(process.cwd(), "client/src/pages/discoveryAdventure.css"), "utf8");
    expect(source).toContain("buildAdventurePracticeReport");
    expect(source).toContain("NOT A VERIFIED CERTIFICATE");
    expect(source).toContain("role=\"progressbar\"");
    expect(source).toContain("PRACTICE_STATUS_LABELS");
    expect(source).toContain("window.print()");
    expect(page).toContain("<DiscoveryParentReport");
    expect(source).not.toContain("trpc.");
    expect(source).not.toContain("fetch(");
    expect(css).toContain("@media print");
  });
});
