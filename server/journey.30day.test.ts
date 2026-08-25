import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { dailyJourney } from "../client/src/data/dailyJourney";

const page = readFileSync(resolve(import.meta.dirname, "../client/src/pages/JourneyPage.tsx"), "utf8");
const home = readFileSync(resolve(import.meta.dirname, "../client/src/pages/Home.tsx"), "utf8");
const app = readFileSync(resolve(import.meta.dirname, "../client/src/App.tsx"), "utf8");

describe("30-day AI Skill Journey", () => {
  it("contains thirty unique daily milestones across six skill arcs", () => {
    expect(dailyJourney).toHaveLength(30);
    expect(new Set(dailyJourney.map((day) => day.day)).size).toBe(30);
    expect(new Set(dailyJourney.map((day) => day.arc)).size).toBe(6);
    expect(dailyJourney.every((day) => day.outcome && day.action && day.proof)).toBe(true);
  });

  it("enforces sequential daily access and exposes proof/share surfaces", () => {
    expect(page).toContain("lastCompletedOn");
    expect(page).toContain("completedToday");
    expect(page).toContain("nextSequentialDay");
    expect(page).toContain("Opens tomorrow");
    expect(page).toContain("Milestone earned");
    expect(page).toContain("Share milestone");
    expect(page).toContain("SHOW YOUR WORK");
    expect(page).toContain("minimum characters");
    expect(page).toContain("Complete both checks before claiming today’s milestone.");
    expect(page).not.toContain("Mark today complete");
    expect(page).toContain("30-Day AI Skill Journey");
  });

  it("is promoted from the homepage and registered as a route", () => {
    expect(app).toContain('<Route path="/journey" component={JourneyPage} />');
    expect(home).toContain('href="/journey"');
    expect(home).toContain("Start 30-day journey");
  });
});
