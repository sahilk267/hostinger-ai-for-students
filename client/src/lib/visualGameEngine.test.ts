import { describe, expect, it } from "vitest";
import { scoreVisualSession, type VisualRoundEvent } from "./visualGameEngine";

const start = (sessionId = "s1"): VisualRoundEvent => ({
  sessionId, gameId: "pattern-builder", round: 0, action: "start"
});
const choose = (round: number, correct: boolean, sessionId = "s1"): VisualRoundEvent => ({
  sessionId, gameId: "pattern-builder", round, action: "choose", correct, elapsedMs: 1200
});

describe("visual discovery scoring invariants", () => {
  it("does not count a double-click twice in the same session and round", () => {
    const events = [start(), choose(1,true), choose(1,false), choose(2,true), choose(3,false)];
    const scored = scoreVisualSession(events,5);
    expect(scored.answered).toBe(3);
    expect(scored.correct).toBe(2);
    expect(scored.score).toBe(2);
    expect(scored.accuracy).toBeCloseTo(2/3);
  });
  it("keeps distinct round choices even for a repeated activity in a new session", () => {
    const events = [start(),choose(1,true),start("s2"),choose(1,false,"s2")];
    expect(scoreVisualSession(events,5).answered).toBe(2);
  });
  it("counts attempted answers, not unsupported diagnostic performance scores", () => {
    expect(scoreVisualSession([start()],5)).toMatchObject({
      answered:0,correct:0,score:0,quality:"insufficient",
      evidenceNote:"Based on current gameplay"
    });
  });
  it("flags very rapid answers and assisted play as requiring review", () => {
    const events = [start(), {...choose(1,true),elapsedMs:100},choose(2,true),choose(3,true)];
    expect(scoreVisualSession(events,5).quality).toBe("review");
    const assisted = [start(),choose(1,true),{...choose(2,true),usedHint:true},
      choose(3,true),{sessionId:"s1",gameId:"pattern-builder",round:2,action:"hint" as const}];
    expect(scoreVisualSession(assisted,5).quality).toBe("review");
  });
  it("treats completed five-round attempts as a five-point maximum", () => {
    const events=[start(), ...Array.from({length:5},(_,i)=>choose(i+1,true)),
      {sessionId:"s1",gameId:"pattern-builder",round:5,action:"complete" as const}];
    expect(scoreVisualSession(events,5)).toMatchObject({
      rounds:5,answered:5,correct:5,score:5,accuracy:1,quality:"usable"
    });
  });
});
