import { describe, expect, it } from "vitest";
import { isKnownSpaPath, isPrivateSpaPath, spaPathFromOriginalUrl } from "./_core/spaRoutes";

describe("production SPA fallback direct-link contracts", () => {
  it("uses the original URL even with query strings or a trailing slash", () => {
    expect(spaPathFromOriginalUrl("/play?game=fact")).toBe("/play");
    expect(spaPathFromOriginalUrl("/start/")).toBe("/start");
    expect(spaPathFromOriginalUrl("/explorer/share/abc_123?from=parent")).toBe("/explorer/share/abc_123");
    expect(spaPathFromOriginalUrl("/")).toBe("/");
  });

  it("allows every major public and dynamic student route", () => {
    for (const path of ["/", "/start", "/play", "/discovery-lab", "/robotics", "/parents",
      "/teachers", "/plans", "/guides", "/journey", "/mission", "/explorer/report",
      "/explorer/share/abc-123", "/account", "/progress", "/certificate", "/contact"]) {
      expect(isKnownSpaPath(path), path).toBe(true);
    }
  });

  it("does not classify random or sensitive routes as valid public pages", () => {
    for (const path of ["/random-keyword-landing", "/admin", "/guides/unknown",
      "/resources/unknown", "/api/fake", "/explorer/share/", "/explorer/share/a/b"]) {
      expect(isKnownSpaPath(path), path).toBe(false);
    }
  });

  it("identifies private and shareable results so they remain noindex", () => {
    for (const path of ["/account", "/progress", "/certificate", "/explorer/report", "/explorer/pilot-review", "/explorer/share/a1b2"]) {
      expect(isPrivateSpaPath(path), path).toBe(true);
    }
    expect(isPrivateSpaPath("/parents")).toBe(false);
    expect(isPrivateSpaPath("/start")).toBe(false);
  });
});
