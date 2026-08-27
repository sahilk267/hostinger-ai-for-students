import { describe, expect, it } from "vitest";
import { scoreVisualSession } from "../client/src/lib/visualGameEngine";
import { suggestFields } from "../client/src/data/strengthSignals";

describe("visual game contracts", () => {
  it("ignores duplicate choices for the same round", () => {
    const summary = scoreVisualSession([
      { sessionId: "s", gameId: "pattern-builder", round: 1, action: "choose", correct: true },
      { sessionId: "s", gameId: "pattern-builder", round: 1, action: "choose", correct: false },
      { sessionId: "s", gameId: "pattern-builder", round: 2, action: "choose", correct: false },
      { sessionId: "s", gameId: "pattern-builder", round: 3, action: "choose", correct: true },
    ], 5);
    expect(summary.answered).toBe(3);
    expect(summary.correct).toBe(2);
    expect(summary.quality).toBe("usable");
  });

  it("marks unusually rapid or idle answers for review without changing the score", () => {
    const rapid = scoreVisualSession([1, 2, 3].map((round) => ({ sessionId: "s", gameId: "memory-adventure", round, action: "choose" as const, correct: true, elapsedMs: 100 })), 5);
    const idle = scoreVisualSession([1, 2, 3].map((round) => ({ sessionId: "idle", gameId: "memory-adventure", round, action: "choose" as const, correct: true, elapsedMs: 31_000 })), 5);
    expect(rapid.score).toBe(3);
    expect(rapid.quality).toBe("review");
    expect(idle.score).toBe(3);
    expect(idle.quality).toBe("review");
  });

  it("flags assistance, timeout or exposed-answer events for review without changing score", () => {
    const summary = scoreVisualSession([
      { sessionId: "s", gameId: "pattern-builder", round: 1, action: "hint", usedHint: true },
      { sessionId: "s", gameId: "pattern-builder", round: 1, action: "choose", correct: true, exposed: true },
      { sessionId: "s", gameId: "pattern-builder", round: 2, action: "choose", correct: true },
      { sessionId: "s", gameId: "pattern-builder", round: 3, action: "timeout" },
    ], 5);
    expect(summary.score).toBe(2);
    expect(summary.quality).toBe("review");
  });

  it("requires two matching skills before suggesting a field", () => {
    expect(suggestFields(["pattern-recognition"]).length).toBe(0);
    expect(suggestFields(["logical-reasoning", "spatial-reasoning", "systems-thinking"])[0]?.field).toBe("Engineering and robotics");
  });
});
