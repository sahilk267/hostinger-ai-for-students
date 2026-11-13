import { describe, expect, it } from "vitest";
import { familyReflectionPrompts, formatFamilyReflectionWorksheet } from "./familyReflectionWorksheet";
describe("family reflection worksheet", () => {
  it("has three unique prompts for each of four family activities", () => {
    expect(familyReflectionPrompts).toHaveLength(4);
    for (const prompts of familyReflectionPrompts) {
      expect(prompts).toHaveLength(3);
      expect(new Set(prompts).size).toBe(3);
    }
  });
  it("exports the correct activity and every prompt with privacy safeguards", () => {
    familyReflectionPrompts.forEach((prompts, index) => {
      const text = formatFamilyReflectionWorksheet(index, "Practice " + index, "https://example.test/practice");
      expect(text).toContain("Practice " + index);
      expect(text).toContain("https://example.test/practice");
      prompts.forEach(prompt => expect(text).toContain(prompt));
      expect(text).toContain("No names, school details or private information");
      expect(text).toContain("ungraded");
    });
  });
  it("rejects invalid activity indices", () => {
    expect(() => formatFamilyReflectionWorksheet(-1, "Bad", "/")).toThrow(RangeError);
    expect(() => formatFamilyReflectionWorksheet(4, "Bad", "/")).toThrow(RangeError);
  });
});
