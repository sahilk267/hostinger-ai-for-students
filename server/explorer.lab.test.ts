import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EXPLORER_AGE_BANDS, EXPLORER_PILOT_MISSIONS, EXPLORER_PROHIBITED_OUTPUTS } from "../client/src/data/explorerLab";
import { EXPLORER_LOCALES, explorerCopy, quickPlayOptions } from "../client/src/data/explorerI18n";

const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/ExplorerPage.tsx"), "utf8");
const routerSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const serverRouterSource = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
const reportSource = readFileSync(resolve(process.cwd(), "client/src/pages/ExplorerReportPage.tsx"), "utf8");
const shareSource = readFileSync(resolve(process.cwd(), "client/src/pages/ExplorerSharePage.tsx"), "utf8");

describe("AI Explorer Lab pilot contract", () => {
  it("covers four age bands with six missions each", () => {
    expect(EXPLORER_AGE_BANDS).toHaveLength(4);
    expect(EXPLORER_PILOT_MISSIONS).toHaveLength(24);
    for (const band of EXPLORER_AGE_BANDS) {
      expect(EXPLORER_PILOT_MISSIONS.filter((mission) => mission.ageBand === band.id)).toHaveLength(6);
    }
  });

  it("gives every mission an objective, evidence contract, rubric and pilot status", () => {
    for (const mission of EXPLORER_PILOT_MISSIONS) {
      expect(mission.objective.length).toBeGreaterThan(20);
      expect(mission.evidenceFields.length).toBeGreaterThanOrEqual(2);
      expect(mission.rubric.length).toBeGreaterThanOrEqual(3);
      expect(mission.reviewStatus).toBe("pilot");
    }
  });

  it("requires submitted work, reflection checks and minimum evidence before completion", () => {
    expect(pageSource).toContain("Save evidence & complete");
    expect(pageSource).toContain("totalCharacters < 30");
    expect(pageSource).toContain("I did the task, not just read the instructions.");
    expect(pageSource).toContain("I looked at my result and can explain one choice.");
    expect(pageSource).toContain("Give me optional AI coaching on this attempt");
    expect(pageSource).toContain("showing the practice feedback instead");
    expect(pageSource).toContain("const missing = mission.evidenceFields.filter");
    expect(pageSource).toContain("const attemptNumber = Math.min(20");
    expect(pageSource).toContain("aifs-explorer-attempt-counts-v1");
  });

  it("exposes protected parent profile procedures without changing the existing learning router", () => {
    expect(serverRouterSource).toContain("explorer: router({");
    expect(serverRouterSource).toContain("createProfile: protectedProcedure");
    expect(serverRouterSource).toContain("saveAttempt: protectedProcedure");
    expect(serverRouterSource).toContain("feedback: protectedProcedure");
    expect(serverRouterSource).toContain("createShare: protectedProcedure");
    expect(serverRouterSource).toContain("revokeShare: protectedProcedure");
    expect(serverRouterSource).toContain("getShare: publicProcedure");
    expect(serverRouterSource).toContain("expiresInDays");
    expect(serverRouterSource).toContain("response_format");
    expect(serverRouterSource).toContain("Never diagnose, score IQ");
    expect(serverRouterSource).toContain("SERVICE_UNAVAILABLE");
    expect(serverRouterSource).toContain("deleteProfile: protectedProcedure");
    expect(serverRouterSource).toContain("consentVersion: z.literal(\"explorer-consent-v1\")");
    expect(serverRouterSource).toContain("learning: router({");
  });

  it("keeps parent reports private-by-default and shares only a non-identifying snapshot", () => {
    expect(routerSource).toContain('path="/explorer/report"');
    expect(reportSource).toContain("PARENT VIEW · PRIVATE BY DEFAULT");
    expect(reportSource).toContain("Raw responses, age details and personal information stay out of the share text.");
    expect(reportSource).toContain("not a fixed label or prediction");
    expect(reportSource).not.toContain("evidenceJson");
    expect(shareSource).toContain("window.location.pathname.split(\"/\")");
    expect(shareSource).toContain("no name, age, raw answer or prediction");
    expect(shareSource).not.toContain("evidenceJson");
  });

  it("supports India-first Hinglish, Hindi and worldwide English with play-first options", () => {
    expect(EXPLORER_LOCALES.map((item) => item.id)).toEqual(["hinglish", "hi", "en"]);
    expect(explorerCopy.hinglish.playFirst).toContain("Pehle khelo");
    expect(explorerCopy.hinglish.optionalWriting).toContain("optional");
    for (const kind of ["choice-observatory", "source-hunt", "build-studio", "explain-it", "strategy-switch", "reflect-improve"]) {
      expect(quickPlayOptions[kind]).toHaveLength(3);
      expect(quickPlayOptions[kind].every((option) => option.label.hinglish && option.label.hi && option.label.en)).toBe(true);
    }
    expect(pageSource).toContain("STEP 03 / PLAY FIRST");
    expect(pageSource).toContain("copy.optionalWriting");
    expect(pageSource).toContain("speakExplorerText");
    expect(pageSource).toContain("chooseReason");
    expect(pageSource).toContain("const playDone = Boolean(playChoice && playReason)");
    expect(pageSource).toContain("if (!playDone)");
    expect(pageSource).toContain("choice: option.evidence[locale]");
  });

  it("exposes the safety boundary and does not create a career-prediction route", () => {
    expect(pageSource).toContain("not a diagnosis or a prediction");
    expect(pageSource).toContain("Private by default");
    expect(routerSource).toContain('path="/explorer"');
    for (const prohibited of EXPLORER_PROHIBITED_OUTPUTS) expect(prohibited.length).toBeGreaterThan(0);
    expect(pageSource.toLowerCase()).not.toContain("your child will become");
    expect(pageSource.toLowerCase()).not.toContain("guaranteed career");
  });
});
