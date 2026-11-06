import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ADVENTURE_LOCALES, ADVENTURE_MISSIONS, ADVENTURE_WORLDS, evaluateAdventureAnswer, shuffledAdventureOptions, summarizeAdventure, type AdventureAttempt } from "../client/src/data/discoveryAdventure";

const page = readFileSync(resolve(process.cwd(), "client/src/pages/DiscoveryAdventurePage.tsx"), "utf8");
const router = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "client/src/pages/discoveryAdventure.css"), "utf8");

describe("Discovery Adventure pilot", () => {
  it("covers three worlds with three unique missions each", () => {
    expect(ADVENTURE_WORLDS).toHaveLength(3);
    expect(ADVENTURE_MISSIONS).toHaveLength(9);
    expect(new Set(ADVENTURE_MISSIONS.map((mission) => mission.id)).size).toBe(9);
    for (const world of ADVENTURE_WORLDS) {
      expect(ADVENTURE_MISSIONS.filter((mission) => mission.world === world.id)).toHaveLength(3);
    }
  });

  it("provides meaningful English, Hindi and Hinglish strings for all playable content", () => {
    expect(ADVENTURE_LOCALES.map((locale) => locale.id)).toEqual(["hinglish", "hi", "en"]);
    for (const mission of ADVENTURE_MISSIONS) {
      for (const locale of ADVENTURE_LOCALES) {
        expect(mission.title[locale.id].length).toBeGreaterThan(5);
        expect(mission.story[locale.id].length).toBeGreaterThan(20);
        expect(mission.instruction[locale.id].length).toBeGreaterThan(10);
        expect(mission.feedback[locale.id].length).toBeGreaterThan(20);
        expect(mission.hint[locale.id].length).toBeGreaterThan(15);
        for (const option of mission.options) expect(option.label[locale.id].length).toBeGreaterThan(4);
      }
    }
  });

  it("has validated answer contracts and supports sequence, single and multi modes", () => {
    expect(new Set(ADVENTURE_MISSIONS.map((mission) => mission.mode))).toEqual(new Set(["sequence", "single", "multi"]));
    for (const mission of ADVENTURE_MISSIONS) {
      expect(mission.options.length).toBeGreaterThanOrEqual(3);
      expect(new Set(mission.options.map((item) => item.id)).size).toBe(mission.options.length);
      expect(mission.answer.length).toBeGreaterThan(0);
      expect(evaluateAdventureAnswer(mission, mission.answer)).toBe(true);
      expect(evaluateAdventureAnswer(mission, [...mission.answer, mission.answer[0]])).toBe(false);
      expect(evaluateAdventureAnswer(mission, ["not-an-option"])).toBe(false);
      if (mission.mode === "single") expect(mission.answer).toHaveLength(1);
      if (mission.mode === "multi") {
        expect(mission.answer.length).toBeGreaterThan(1);
        expect(evaluateAdventureAnswer(mission, [...mission.answer].reverse())).toBe(true);
      }
      if (mission.mode === "sequence") {
        expect(mission.answer.length).toBeGreaterThan(1);
        expect(evaluateAdventureAnswer(mission, [...mission.answer].reverse())).toBe(false);
      }
    }
  });

  it("shuffles option cards deterministically without accidentally revealing ordered answers", () => {
    for (const mission of ADVENTURE_MISSIONS) {
      const reordered = shuffledAdventureOptions(mission, 197);
      expect(reordered).toHaveLength(mission.options.length);
      expect(new Set(reordered.map((item) => item.id))).toEqual(new Set(mission.options.map((item) => item.id)));
      expect(shuffledAdventureOptions(mission, 197)).toEqual(reordered);
      if (mission.mode === "sequence") {
        expect(reordered.map((item) => item.id)).not.toEqual(mission.answer);
        expect(evaluateAdventureAnswer(mission, reordered.map((item) => item.id))).toBe(false);
      }
    }
  });

  it("summarizes only observed mission attempts, independent practice and explicit enjoyment", () => {
    const first = ADVENTURE_MISSIONS[0];
    const second = ADVENTURE_MISSIONS[1];
    const records: Record<string, AdventureAttempt> = {
      [first.id]: { firstCorrect: true, firstIndependent: true, bestCorrect: true, attempts: 1, hintsUsed: 0, enjoyed: true, updatedAt: "2026-11-06" },
      [second.id]: { firstCorrect: false, firstIndependent: false, bestCorrect: true, attempts: 2, hintsUsed: 1, enjoyed: null, updatedAt: "2026-11-06" },
    };
    const result = summarizeAdventure(records);
    expect(result[0]).toMatchObject({ practiced: 2, firstTryCorrect: 1, firstIndependent: 1, revisedToCorrect: 1, hintedAttempts: 1, solvedWithPractice: 2, enjoyed: 1 });
    expect(result[1]).toMatchObject({ practiced: 0, firstTryCorrect: 0, solvedWithPractice: 0, enjoyed: 0 });
    expect(result[2]).toMatchObject({ practiced: 0, firstTryCorrect: 0, solvedWithPractice: 0, enjoyed: 0 });
  });

  it("is routed, accessible and explicitly avoids child profiling claims", () => {
    expect(router).toContain('path="/explorer/adventure"');
    expect(page).toContain('aria-live="polite"');
    expect(page).toContain("aria-pressed");
    expect(page).toContain("localStorage");
    expect(page).toContain("shuffledAdventureOptions");
    expect(page).toContain("hintOpen");
    expect(page).toContain("firstIndependent");
    expect(page).toContain("not an accredited certificate");
    expect(page).not.toContain("createShare.mutate");
    expect(page).not.toContain("trpc.");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("@media print");
  });
});
