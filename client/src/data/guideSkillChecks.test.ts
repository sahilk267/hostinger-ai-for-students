import { describe, expect, it } from "vitest";
import { publicGuides } from "@/data/publicGuides";
import { guideSkillChecks, reviewGuideSkillChoice } from "@/data/guideSkillChecks";

describe("guide one-minute decision checks", () => {
  it("provides one authored, unambiguous decision per published guide", () => {
    expect(Object.keys(guideSkillChecks).sort()).toEqual(publicGuides.map(g => g.slug).sort());
    for (const guide of publicGuides) {
      const check = guideSkillChecks[guide.slug];
      expect(check.question.length).toBeGreaterThan(35);
      expect(check.choices).toHaveLength(3);
      expect(new Set(check.choices.map(item => item.label)).size).toBe(3);
      expect(check.choices.filter(item => item.correct)).toHaveLength(1);
      for (const choice of check.choices) {
        expect(choice.label.length).toBeGreaterThan(18);
        expect(choice.feedback.length).toBeGreaterThan(35);
      }
      expect(guide.relatedHref).toMatch(/^\//);
    }
  });

  it("reviews by choice index and ignores invalid input", () => {
    for (const check of Object.values(guideSkillChecks)) {
      expect(reviewGuideSkillChoice(check, -1)).toBeNull();
      expect(reviewGuideSkillChoice(check, 3)).toBeNull();
      expect(reviewGuideSkillChoice(check, 0.5)).toBeNull();
      for (let index = 0; index < check.choices.length; index++) {
        expect(reviewGuideSkillChoice(check, index)).toBe(check.choices[index]);
      }
    }
  });
});
