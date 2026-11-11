import { describe, expect, it } from "vitest";
import { getPracticeNextStep } from "./learningGuidance";
import type { LearningProgress } from "./learningProgress";

function sampleProgress(): LearningProgress {
  const ids = [
    "prompt-detective", "fact-check-quest", "ai-safety-lab", "prompt-workshop",
    "source-hunt", "bias-buster", "ai-decoder", "data-detective",
    "creative-director", "code-coach", "decision-studio", "tool-match",
    "robotics", "pattern-builder", "memory-adventure", "mini-scientist",
    "bridge-builder", "robot-programmer", "traffic-controller",
    "mission-commander", "creative-studio", "performance-arena",
  ] as const;
  return Object.fromEntries(ids.map((id) => [id, {
    attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null,
  }])) as LearningProgress;
}

describe("family practice next steps", () => {
  it("offers a playable first activity for new learners", () => {
    const next = getPracticeNextStep(sampleProgress());
    expect(next.href).toBe("/discovery-lab?game=pattern-builder");
    expect(next.action).toContain("pattern");
  });

  it("recognizes an unfinished activity without interpreting ability", () => {
    const progress = sampleProgress();
    progress["pattern-builder"].attempts = 1;
    const next = getPracticeNextStep(progress);
    expect(next.title).toContain("Finish");
    expect(next.reason).toContain("optional");
  });

  it("suggests varied play before repeating the same world", () => {
    const progress = sampleProgress();
    progress["pattern-builder"].completions = 3;
    expect(getPracticeNextStep(progress).href).toContain("memory-adventure");
  });

  it("picks the least-practiced world once all four were completed", () => {
    const progress = sampleProgress();
    progress["pattern-builder"].completions = 4;
    progress["memory-adventure"].completions = 2;
    progress["mini-scientist"].completions = 1;
    progress["robot-programmer"].completions = 3;
    expect(getPracticeNextStep(progress).href).toContain("mini-scientist");
  });
});
