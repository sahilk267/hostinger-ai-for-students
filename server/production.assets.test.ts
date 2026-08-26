import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (file: string) => readFileSync(resolve(root, file), "utf8");

describe("production asset and analytics contracts", () => {
  it("uses deploy-safe CDN assets in the homepage and game hub", () => {
    const home = read("client/src/pages/Home.tsx");
    const games = read("client/src/pages/GamePage.tsx");
    const assets = read("client/src/lib/assets.ts");

    expect(home).toContain('import { assetUrls } from "@/lib/assets";');
    expect(games).toContain('import { assetUrls } from "@/lib/assets";');
    expect(assets).toContain("https://files.manuscdn.com/");
    expect(home).not.toContain("/manus-storage/");
    expect(games).not.toContain("/manus-storage/");
  });

  it("keeps the Hostinger handoff aligned with the server environment helper", () => {
    const handoff = read("hostinger-env-handoff.md");
    const envSource = read("server/_core/env.ts");
    for (const key of ["DATABASE_URL", "JWT_SECRET", "HOSTINGER_MAIL_API_TOKEN", "AUTH_MAIL_FROM", "BUILT_IN_FORGE_API_URL", "BUILT_IN_FORGE_API_KEY"]) {
      expect(handoff).toContain(key);
      expect(envSource).toContain(`process.env.${key}`);
    }
  });

  it("keeps the Hostinger handoff secret-safe", () => {
    const handoff = read("hostinger-env-handoff.md");
    for (const key of ["DATABASE_URL", "JWT_SECRET", "HOSTINGER_MAIL_API_TOKEN", "AUTH_MAIL_FROM", "VITE_OAUTH_PORTAL_URL"]) expect(handoff).toContain(key);
    expect(handoff).toContain("never commit them to GitHub");
    expect(handoff).not.toMatch(/qwertyuiop|password123|sk-[A-Za-z0-9]{12,}|Bearer\s+[A-Za-z0-9._-]{12,}/i);
    expect(handoff).not.toContain("DATABASE_URL=mysql://");
  });

  it("keeps the favicon deploy-safe and avoids an unconditional Umami request", () => {
    const html = read("client/index.html");
    const main = read("client/src/main.tsx");

    expect(html).toContain('rel="icon"');
    expect(html).toContain("https://files.manuscdn.com/");
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%/umami");
    expect(main).toContain("analyticsEndpoint && analyticsWebsiteId");
    expect(main).toContain("document.head.appendChild(analyticsScript)");
  });
});
