import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const mission = readFileSync(resolve(import.meta.dirname, "../client/src/pages/MissionPage.tsx"), "utf8");
const home = readFileSync(resolve(import.meta.dirname, "../client/src/pages/Home.tsx"), "utf8");
const app = readFileSync(resolve(import.meta.dirname, "../client/src/App.tsx"), "utf8");

describe("Mission Studio product loop", () => {
  it("offers multiple real-task missions and a concrete copyable output", () => {
    expect([...mission.matchAll(/id: "([^"]+)"/g)].length).toBeGreaterThanOrEqual(3);
    expect(mission).toContain("Build my mission");
    expect(mission).toContain("Copy workflow");
    expect(mission).toContain("Mark mission complete");
    expect(mission).toContain("STEP 03 / REVIEW BEFORE YOU USE IT");
  });

  it("is reachable from the router and homepage", () => {
    expect(app).toContain('<Route path="/mission" component={MissionPage} />');
    expect(home).toContain('href="/mission"');
    expect(home).toContain("MISSION STUDIO");
    expect(home).toContain("Use it on something real.");
  });
});
