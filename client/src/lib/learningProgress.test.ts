import { afterEach, describe, expect, it, vi } from "vitest";
import {
  completeGame, getLearningProgress, isGuestSessionExpired, resetLearningProgress,
  startGame, GUEST_RETENTION_DAYS
} from "./learningProgress";

function storageFixture(initial: Record<string,string> = {}, blocked = false) {
  const values = new Map(Object.entries(initial));
  const localStorage = {
    getItem: vi.fn((key:string) => { if (blocked) throw Error("Storage disabled"); return values.get(key)??null; }),
    setItem: vi.fn((key:string, value:string) => { if (blocked) throw Error("Storage disabled"); values.set(key,value); }),
    removeItem: vi.fn((key:string) => { if (blocked) throw Error("Storage disabled"); values.delete(key); }),
  };
  vi.stubGlobal("window", { localStorage, navigator: { doNotTrack: "1" } });
  return { values, localStorage };
}
afterEach(() => vi.unstubAllGlobals());

describe("guest learning progress safety", () => {
  it("starts empty, increments attempts and stores completions", () => {
    storageFixture();
    startGame("pattern-builder");
    completeGame("pattern-builder", 4);
    const data = getLearningProgress()["pattern-builder"];
    expect(data.attempts).toBe(1);
    expect(data.completions).toBe(1);
    expect(data.bestScore).toBe(4);
    expect(data.lastScore).toBe(4);
    expect(data.lastPlayed).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("preserves the best score across attempts and does not store nonfinite values", () => {
    storageFixture();
    completeGame("robotics", 7);
    completeGame("robotics", Number.NaN);
    const data = getLearningProgress().robotics;
    expect(data.completions).toBe(2);
    expect(data.bestScore).toBe(7);
    expect(data.lastScore).toBe(0);
    expect(Number.isFinite(data.bestScore)).toBe(true);
  });

  it("normalizes malicious/corrupted counts and negative scores", () => {
    storageFixture({ "ai-students-learning-progress": JSON.stringify({
      "ai-safety-lab": { attempts:-5,completions:1.5,bestScore:-12,lastScore:"4",lastPlayed:25 }
    }) });
    const data = getLearningProgress()["ai-safety-lab"];
    expect(data).toMatchObject({ attempts:0,completions:0,bestScore:0,lastScore:0,lastPlayed:null });
  });

  it("treats corrupt JSON as new progress without disrupting play", () => {
    storageFixture({ "ai-students-learning-progress": "{not-json" });
    expect(getLearningProgress()["fact-check-quest"].attempts).toBe(0);
    expect(() => startGame("fact-check-quest")).not.toThrow();
    expect(getLearningProgress()["fact-check-quest"].attempts).toBe(1);
  });

  it("does not crash when browser storage is unavailable", () => {
    storageFixture({},true);
    expect(() => startGame("mini-scientist")).not.toThrow();
    expect(() => completeGame("mini-scientist",3)).not.toThrow();
    expect(() => resetLearningProgress()).not.toThrow();
    expect(getLearningProgress()["mini-scientist"].completions).toBe(0);
  });

  it("forgets expired device-local data after the retention period", () => {
    const now=Date.now();
    const old=new Date(now-(GUEST_RETENTION_DAYS+1)*86400000).toISOString();
    const { values }=storageFixture({
      "ai-students-guest-session":old,
      "ai-students-learning-progress":JSON.stringify({"robotics":{attempts:3,completions:1,bestScore:8,lastScore:8,lastPlayed:old}})
    });
    expect(isGuestSessionExpired(old,now)).toBe(true);
    expect(getLearningProgress().robotics.completions).toBe(0);
    expect(values.has("ai-students-learning-progress")).toBe(false);
  });
});
