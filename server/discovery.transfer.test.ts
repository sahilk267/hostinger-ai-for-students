import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildAdventurePracticeReport } from "../client/src/data/discoveryReport";
import { ADVENTURE_AGE_BANDS, getAgeAdventureMissions, type AdventureAttempt } from "../client/src/data/discoveryAdventure";
import {
  getTransferChallenges, evaluateTransferChallenge, gradeTransferChallenge, submitTransferAttempt, summarizeTransfer,
  TRANSFER_CHALLENGES, TRANSFER_POLICY_VERSION,
  type TransferAttempt,
} from "../client/src/data/discoveryTransfer";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const story = (): AdventureAttempt => ({
  firstCorrect: true, firstIndependent: true, bestCorrect: true,
  attempts: 1, hintsUsed: 0, enjoyed: null, updatedAt: "2026-11-07T10:00:00.000Z",
});
const transfer = (): TransferAttempt => ({
  attempts: 1, firstCorrect: true, solved: true, updatedAt: "2026-11-07T11:00:00.000Z",
});

describe("Discovery transfer assessment & private completion journey", () => {
  it("has 3 distinct unseen two-part reasoning challenges per age group and 3 languages", () => {
    expect(TRANSFER_POLICY_VERSION).toBe("local-transfer-v1");
    expect(TRANSFER_CHALLENGES).toHaveLength(9);
    expect(new Set(TRANSFER_CHALLENGES.map(item => item.id)).size).toBe(9);
    for (const band of ADVENTURE_AGE_BANDS) {
      const deck = getTransferChallenges(band.id);
      expect(deck).toHaveLength(3);
      expect(new Set(deck.map(x=>x.world))).toEqual(new Set(["logic", "mystery", "creator"]));
      const practiceIds = new Set(getAgeAdventureMissions(band.id).map(x=>x.id));
      for (const item of deck) {
        expect(practiceIds.has(item.id)).toBe(false);
        expect(item.decisions).toHaveLength(3);
        expect(item.reasons).toHaveLength(3);
        expect(new Set(item.decisions.map(x=>x.id)).size).toBe(3);
        expect(new Set(item.reasons.map(x=>x.id)).size).toBe(3);
        expect(item.decisions.some(x => x.id === item.correctDecision)).toBe(true);
        expect(item.reasons.some(x => x.id === item.correctReason)).toBe(true);
        for (const locale of ["en", "hi", "hinglish"] as const) {
          expect(item.title[locale].length).toBeGreaterThan(6);
          expect(item.situation[locale].length).toBeGreaterThan(20);
          expect(item.question[locale].length).toBeGreaterThan(8);
          expect(item.whyQuestion[locale].length).toBeGreaterThan(8);
          expect(item.explanation[locale].length).toBeGreaterThan(20);
          expect(item.parentActivity[locale].length).toBeGreaterThan(20);
          for(const o of [...item.decisions,...item.reasons]) expect(o.label[locale].trim().length).toBeGreaterThan(4);
        }
      }
    }
  });

  it("requires BOTH an action and the evidence-based reason to be correct", () => {
    for (const item of TRANSFER_CHALLENGES) {
      expect(evaluateTransferChallenge(item, item.correctDecision, item.correctReason)).toBe(true);
      expect(evaluateTransferChallenge(item, "unknown", item.correctReason)).toBe(false);
      expect(evaluateTransferChallenge(item, item.correctDecision, "unknown")).toBe(false);
      expect(evaluateTransferChallenge(item, "", "")).toBe(false);
      for (const decision of item.decisions) for (const reason of item.reasons) {
        const result = evaluateTransferChallenge(item, decision.id, reason.id);
        expect(result).toBe(decision.id===item.correctDecision && reason.id===item.correctReason);
      }
    }
  });

  it("diagnoses action and explanation separately without saving chosen option IDs", () => {
    for (const item of TRANSFER_CHALLENGES) {
      const wrongAction = item.decisions.find(option => option.id !== item.correctDecision)!.id;
      const wrongReason = item.reasons.find(option => option.id !== item.correctReason)!.id;
      expect(gradeTransferChallenge(item, wrongAction, item.correctReason))
        .toEqual({decisionCorrect: false, reasonCorrect: true, correct: false});
      expect(gradeTransferChallenge(item, item.correctDecision, wrongReason))
        .toEqual({decisionCorrect: true, reasonCorrect: false, correct: false});
      expect(gradeTransferChallenge(item, wrongAction, wrongReason))
        .toEqual({decisionCorrect: false, reasonCorrect: false, correct: false});
      const first = submitTransferAttempt(undefined, item, item.correctDecision, wrongReason, "2026-11-07T10:00:00Z");
      expect(first).toMatchObject({firstDecisionCorrect:true, firstReasonCorrect:false, firstCorrect:false});
      const revised = submitTransferAttempt(first, item, item.correctDecision, item.correctReason, "2026-11-07T11:00:00Z");
      expect(revised).toMatchObject({solved:true, firstDecisionCorrect:true, firstReasonCorrect:false});
      expect("decision" in revised).toBe(false);
      expect("reason" in revised).toBe(false);
    }
  });

  it("keeps legacy records compatible and never fabricates old diagnostic evidence", () => {
    const challenge = getTransferChallenges("11-13")[0];
    const legacy: TransferAttempt = {attempts:2,firstCorrect:false,solved:false,updatedAt:"2026-11-07T10:00:00Z"};
    const revised = submitTransferAttempt(legacy,challenge,challenge.correctDecision,challenge.correctReason,"2026-11-07T11:00:00Z");
    expect(revised.firstDecisionCorrect).toBeUndefined();
    expect(revised.firstReasonCorrect).toBeUndefined();
    const report = summarizeTransfer("11-13",{[challenge.id]:revised});
    expect(report).toMatchObject({solved:1,firstPairKnown:0,firstActionToRevisit:0,firstReasonToRevisit:0});
  });

  it("records first-try accuracy separately from eventual completion and ignores repeats after success", () => {
    const item = getTransferChallenges("14-17")[0];
    const wrong = submitTransferAttempt(undefined,item,"wrong","wrong","2026-11-07T10:00:00Z");
    expect(wrong).toMatchObject({ attempts: 1, firstCorrect: false, solved: false });
    const improved = submitTransferAttempt(wrong,item,item.correctDecision,item.correctReason,"2026-11-07T11:00:00Z");
    expect(improved).toMatchObject({ attempts: 2, firstCorrect: false, solved: true });
    expect(submitTransferAttempt(improved,item,"wrong","wrong","2026-11-07T12:00:00Z")).toEqual(improved);
    const first = submitTransferAttempt(undefined,item,item.correctDecision,item.correctReason,"2026-11-07T10:00:00Z");
    expect(first).toMatchObject({ attempts: 1, firstCorrect: true, solved: true });
  });

  it("never combines progress between different age bands", () => {
    const junior = Object.fromEntries(getTransferChallenges("8-10").map(item => [item.id, transfer()]));
    expect(summarizeTransfer("8-10",junior)).toMatchObject({ attempted: 3, solved: 3, completed: true, firstTry: 3 });
    for (const band of ["11-13","14-17"] as const)
      expect(summarizeTransfer(band,junior)).toMatchObject({ attempted: 0, solved: 0, completed: false });
  });

  it("requires 9 solved missions PLUS 3 solved transfer checks for a private milestone", () => {
    for (const band of ADVENTURE_AGE_BANDS) {
      const missions = getAgeAdventureMissions(band.id);
      const questions = getTransferChallenges(band.id);
      const allStories = Object.fromEntries(missions.map(m => [m.id, story()]));
      const allTransfers = Object.fromEntries(questions.map(q => [q.id, transfer()]));
      expect(buildAdventurePracticeReport(band.id,allStories,{})).toMatchObject({
        solved:9, completed:true, showcaseReady:false,
      });
      expect(buildAdventurePracticeReport(band.id,{},allTransfers)).toMatchObject({
        solved:0, completed:false, showcaseReady:false,
      });
      const milestone = buildAdventurePracticeReport(band.id,allStories,allTransfers);
      expect(milestone).toMatchObject({
        solved:9, transfer:{solved:3,firstTry:3}, showcaseReady:true,
        showcaseCompletedAt:"2026-11-07T11:00:00.000Z",
      });
      expect(milestone.worldDetails).toHaveLength(3);
      for (const world of milestone.worldDetails) {
        expect(world.guidance.observation.en.length).toBeGreaterThan(20);
        expect(world.guidance.activity.hi.length).toBeGreaterThan(15);
      }
      const partial = { ...allTransfers, [questions[2].id]: { ...transfer(), solved:false } };
      expect(buildAdventurePracticeReport(band.id,allStories,partial).showcaseReady).toBe(false);
    }
  });

  it("does not imply innate talent, career suitability, or a verified certificate", () => {
    const guidance = source("client/src/data/discoveryReport.ts");
    const comp = source("client/src/components/DiscoveryMilestone.tsx");
    const ui = source("client/src/components/DiscoveryParentReport.tsx");
    const transferUi = source("client/src/components/DiscoveryTransferAssessment.tsx");
    const page = source("client/src/pages/DiscoveryAdventurePage.tsx");
    const css = source("client/src/components/discoveryCompletion.css");
    expect(guidance).toContain("Not enough activity evidence");
    expect(guidance).toContain("10 minutes");
    expect(comp).toContain("NOT AN ACCREDITED OR VERIFIED CERTIFICATE");
    expect(comp).toContain("window.print()");
    expect(comp).not.toContain("qr-code");
    expect(comp).not.toContain("trpc.");
    expect(ui).toContain("showcaseReady");
    expect(ui).toContain("onStartAssessment");
    expect(ui).toContain("step.activity[locale]");
    expect(ui).toContain("report.growthPlan");
    expect(transferUi).toContain('type="radio"');
    expect(transferUi).toContain("evaluateTransferChallenge");
    expect(transferUi).toContain("copy.noSpoiler");
    expect(transferUi).toContain("(result?.correct || alreadySolved)");
    expect(page).toContain("TRANSFER_STORAGE_KEY");
    expect(page).toContain("setTransfers({})");
    expect(page).toContain("practiceSolved !== 9");
    expect(css).toContain("@media print");
    expect(transferUi).not.toContain("fetch(");
    expect(page).not.toContain("trpc.");
  });

  it("retains local practice date safety and caps one-task completion after a missing timestamp", () => {
    const stories = Object.fromEntries(getAgeAdventureMissions("11-13").map(item => [item.id,story()]));
    const transferData = Object.fromEntries(getTransferChallenges("11-13").map(item => [item.id,transfer()]));
    transferData[getTransferChallenges("11-13")[1].id] = { ...transfer(), updatedAt:"invalid" };
    const result = buildAdventurePracticeReport("11-13",stories,transferData);
    expect(result.showcaseReady).toBe(true);
    expect(result.showcaseCompletedAt).toBeNull();
  });
});
