import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { mergeProgressValues } from "./db";
import { GUEST_RETENTION_DAYS, isGuestSessionExpired } from "../client/src/lib/learningProgress";
import { questions } from "../client/src/data/gameQuestions";
import { factQuestions } from "../client/src/components/game/FactCheckQuest";
import { safetyQuestions } from "../client/src/components/game/AISafetyLab";
import { moreGameCatalog } from "../client/src/components/game/MoreAIGames";
import { challenges as interactiveLabChallenges } from "../client/src/components/game/InteractiveLab";
import { gameCatalog } from "../client/src/data/gameCatalog";
import { createRoundSeed, orderChoices } from "../client/src/lib/answerOrder";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { TrpcContext } from "./_core/context";

const baseContext = (user?: TrpcContext["user"]): TrpcContext => ({
  user,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("learning progress access", () => {
  it("keeps every core learning game at thirty or more reviewed questions", () => {
    expect(questions.length).toBeGreaterThanOrEqual(30);
    expect(factQuestions.length).toBeGreaterThanOrEqual(30);
    expect(safetyQuestions.length).toBeGreaterThanOrEqual(30);
    expect(gameCatalog).toHaveLength(12);
    for (const item of gameCatalog) {
      expect(item.topics.length).toBeGreaterThan(0);
      expect(item.skills.length).toBeGreaterThan(0);
      expect(item.difficulty).toBeTruthy();
      expect(item.ageBand).toBeTruthy();
    }
    for (const lab of [interactiveLabChallenges.workshop, interactiveLabChallenges["source-hunt"]]) {
      expect(lab.length).toBeGreaterThanOrEqual(30);
      for (const challenge of lab) {
        expect(challenge.blocks.length).toBeGreaterThanOrEqual(4);
        expect(challenge.correct.length).toBeGreaterThanOrEqual(3);
        expect(new Set(challenge.correct).size).toBe(challenge.correct.length);
        expect(challenge.correct.every((block) => challenge.blocks.includes(block))).toBe(true);
      }
    }
    expect(moreGameCatalog).toHaveLength(7);
    for (const game of moreGameCatalog) {
      expect(game.scenarios.length).toBeGreaterThanOrEqual(30);
      expect(new Set(game.scenarios.map((scenario) => scenario.prompt)).size).toBe(game.scenarios.length);
      for (const scenario of game.scenarios) {
        expect(scenario.choices.length).toBeGreaterThanOrEqual(3);
        expect(scenario.choices.filter((choice) => choice.correct)).toHaveLength(1);
      }
    }
  });
  it("distributes rendered correct answers across all visible option positions", () => {
    const banks = [
      { name: "prompt detective", items: questions.map((item) => ({ choices: item.choices, seed: item.id })) },
      { name: "fact check quest", items: factQuestions.map((item, index) => ({ choices: item.choices, seed: `fact-check-${index}` })) },
      { name: "ai safety lab", items: safetyQuestions.map((item, index) => ({ choices: item.choices, seed: `ai-safety-${index}` })) },
      ...moreGameCatalog.map((game) => ({ name: game.id, items: game.scenarios.map((item, index) => ({ choices: item.choices, seed: `${game.id}-${index}` })) })),
    ];
    expect(banks).toHaveLength(10);
    for (const bank of banks) {
      const positions = bank.items.map(({ choices, seed }) => orderChoices(choices, seed, seed).findIndex((choice) => choice.correct));
      expect(new Set(positions)).toEqual(new Set([0, 1, 2]));
      const maxShare = Math.max(...[0, 1, 2].map((position) => positions.filter((value) => value === position).length / positions.length));
      expect(maxShare).toBeLessThan(0.6);
      const firstOptionScore = positions.filter((position) => position === 0).length;
      expect(firstOptionScore / positions.length).toBeLessThan(0.6);
    }
  });
  it("does not reuse a predictable answer-position cycle between rounds", () => {
    const sample = safetyQuestions.slice(0, 12);
    const firstRound = sample.map((item, index) => orderChoices(item.choices, "round-alpha", item.scenario).findIndex((choice) => choice.correct));
    const sameRound = sample.map((item, index) => orderChoices(item.choices, "round-alpha", item.scenario).findIndex((choice) => choice.correct));
    const secondRound = sample.map((item) => orderChoices(item.choices, "round-beta", item.scenario).findIndex((choice) => choice.correct));
    expect(sameRound).toEqual(firstRound);
    expect(new Set(firstRound)).toEqual(new Set([0, 1, 2]));
    expect(secondRound).not.toEqual(firstRound);
    expect(firstRound.join("")).not.toBe("012012012012");
  });
  it("audits field-game uniqueness and review-status transparency", () => {
    for (const game of moreGameCatalog) {
      const prompts = game.scenarios.map((scenario) => scenario.prompt);
      expect(new Set(prompts).size).toBe(prompts.length);
      const reviewStatuses = game.scenarios.map((scenario) => scenario.reviewStatus);
      expect(reviewStatuses.every(Boolean)).toBe(true);
      expect(game.scenarios).toHaveLength(30);
      expect(reviewStatuses.every((status) => status === "reviewed")).toBe(true);
      expect(prompts.some((prompt) => prompt.includes("practice "))).toBe(false);
    }
  });

  it("keeps answer controls and route escape affordances in every choice game", () => {
    const sources = ["PromptDetective.tsx", "FactCheckQuest.tsx", "AISafetyLab.tsx", "MoreAIGames.tsx"].map((file) => readFileSync(resolve(process.cwd(), "client/src/components/game", file), "utf8"));
    for (const source of sources) {
      expect(source).toContain("answer-card");
      expect(source).toContain("disabled={Boolean(selected)}");
      expect(source).toContain("game-back");
      expect(source.includes('href="/play"') || source.includes('onClick={reset}')).toBe(true);
      expect(source).toContain("onClick={() => choose");
    }
    const fieldGameSource = readFileSync(resolve(process.cwd(), "client/src/components/game/MoreAIGames.tsx"), "utf8");
    expect(fieldGameSource).not.toContain("PILOT CASE / FACILITATOR REVIEW NEEDED");
    expect(fieldGameSource).toContain("REVIEWED CASE");
    const gamePage = readFileSync(resolve(process.cwd(), "client/src/pages/GamePage.tsx"), "utf8");
    expect(gamePage).toContain('aria-label="Filter learning games"');
    for (const label of ["Search games or skills", "Filter by difficulty", "Filter by age band", "Filter by topic", "Filter by skill"]) {
      expect(gamePage).toContain(`aria-label="${label}"`);
    }
    expect(gamePage).toContain('<select');
    expect(gamePage).toContain('aria-label="Learning games"');
    expect(gamePage).toContain('aria-label="Clear game filters"');
    expect(gamePage).toContain('aria-live="polite"');
    expect(gamePage).toContain("Showing {filteredGames.length} of {coreGames.length} learning games");
    expect(gamePage).toContain('href="/"');
  });

  it("covers stable and fresh replay ordering across every choice-based module", () => {
    const banks = [
      ...questions.slice(0, 6).map((item) => ({ choices: item.choices, id: item.id })),
      ...factQuestions.slice(0, 6).map((item, index) => ({ choices: item.choices, id: item.id || `fact-${index}` })),
      ...safetyQuestions.slice(0, 6).map((item) => ({ choices: item.choices, id: item.scenario })),
      ...moreGameCatalog.flatMap((game) => game.scenarios.slice(0, 2).map((item) => ({ choices: item.choices, id: `${game.id}:${item.prompt}` }))),
    ];
    const firstSeed = createRoundSeed();
    const secondSeed = createRoundSeed();
    expect(firstSeed).not.toBe(secondSeed);
    for (const item of banks) {
      const first = orderChoices(item.choices, firstSeed, item.id);
      const stable = orderChoices(item.choices, firstSeed, item.id);
      const replay = orderChoices(item.choices, secondSeed, item.id);
      expect(stable).toEqual(first);
      expect(replay).toHaveLength(item.choices.length);
      expect(new Set(replay.map((choice) => choice.id))).toEqual(new Set(item.choices.map((choice) => choice.id)));
    }
  });

  it("requires an authenticated user to read progress", async () => {
    const caller = appRouter.createCaller(baseContext());
    await expect(caller.learning.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("protects account export and deletion procedures", async () => {
    const caller = appRouter.createCaller(baseContext());
    await expect(caller.learning.export()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.learning.deleteAccount()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("expires inactive guest sessions after the retention window", () => {
    const now = Date.parse("2026-08-24T00:00:00.000Z");
    const old = new Date(now - (GUEST_RETENTION_DAYS + 1) * 24 * 60 * 60 * 1000).toISOString();
    expect(isGuestSessionExpired(old, now)).toBe(true);
    expect(isGuestSessionExpired(new Date(now - 1_000).toISOString(), now)).toBe(false);
  });

  it("preserves stronger account progress during guest merge", () => {
    expect(mergeProgressValues({ attempts: 8, completions: 3, bestScore: 5, lastScore: 5 }, { attempts: 2, completions: 1, bestScore: 1, lastScore: 1 })).toEqual({ attempts: 8, completions: 3, bestScore: 5, lastScore: 5 });
  });

  it("accepts stronger guest progress during migration", () => {
    expect(mergeProgressValues({ attempts: 1, completions: 0, bestScore: 1, lastScore: 1 }, { attempts: 4, completions: 2, bestScore: 4, lastScore: 4 })).toEqual({ attempts: 4, completions: 2, bestScore: 4, lastScore: 4 });
  });

  it("is safe for out-of-order and repeated guest syncs", () => {
    const strong = mergeProgressValues(undefined, { attempts: 7, completions: 3, bestScore: 5, lastScore: 5 });
    const stale = mergeProgressValues(strong, { attempts: 2, completions: 1, bestScore: 2, lastScore: 2 });
    const repeated = mergeProgressValues(stale, { attempts: 7, completions: 3, bestScore: 5, lastScore: 5 });
    expect(stale).toEqual(strong);
    expect(repeated).toEqual(strong);
  });

  it("rejects an invalid game id before persistence", async () => {
    const caller = appRouter.createCaller(baseContext({ id: 1, openId: "test", name: null, email: null, loginMethod: "test", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }));
    await expect(caller.learning.save({ gameId: "", attempts: 0, completions: 0, bestScore: 0, lastScore: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
