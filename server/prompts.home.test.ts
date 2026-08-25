import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(import.meta.dirname, "../client/src/pages/Home.tsx"), "utf8");

describe("homepage prompt shelf", () => {
  it("contains a broad practical prompt library", () => {
    const promptIds = [...home.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);
    expect(promptIds.length).toBeGreaterThanOrEqual(18);
    expect(new Set(promptIds).size).toBe(promptIds.length);
    expect(home).toContain('label: "STUDY / 01"');
    expect(home).toContain('label: "RESEARCH / 08"');
    expect(home).toContain('label: "CODING / 11"');
    expect(home).toContain('label: "CAREER / 13"');
    expect(home).toContain('label: "SAFETY / 17"');
  });

  it("announces the filtered prompt count and links to the full topic library", () => {
    expect(home).toContain("Showing {filteredPrompts.length} of {prompts.length} prompts");
    expect(home).toContain('href="/topics"');
  });
});
