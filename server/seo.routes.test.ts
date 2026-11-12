import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { publicGuides } from "../client/src/data/publicGuides";
import { learningClusters } from "../client/src/data/learningClusters";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root,path), "utf8");

describe("SEO and public route integrity", () => {
  it("registers each public ecosystem route only once", () => {
    const code = read("server/_core/seoPages.ts");
    const start = code.indexOf("const ecosystemPages = [");
    const end = code.indexOf("for (const page of ecosystemPages)",start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const section = code.slice(start,end);
    const routes = [...section.matchAll(/\broute\s*:\s*["'](\/[^"']+)["']/g)].map(match => match[1]);
    expect(routes.length).toBeGreaterThan(8);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("sitemaps every authored public article and resource", () => {
    const sitemap = read("client/public/sitemap.xml");
    for (const guide of publicGuides) {
      expect(sitemap).toContain("/guides/" + guide.slug);
    }
    for (const cluster of learningClusters) {
      expect(sitemap).toContain("/resources/" + cluster.slug);
    }
    expect(sitemap).toContain("/parents");
    expect(sitemap).toContain("/teachers");
    expect(sitemap).toContain("/plans");
  });

  it("keeps production public routing before the static file fallback", () => {
    const app = read("server/_core/index.ts");
    expect(app.indexOf("registerPublicSeoPages(app)")).toBeGreaterThan(-1);
    expect(app.indexOf("registerPublicSeoPages(app)")).toBeLessThan(app.indexOf("serveStatic(app)"));
  });

  it("does not silently serve unknown guide and resource slugs as successful indexed pages", () => {
    const seo = read("server/_core/seoPages.ts");
    expect(seo).toContain('app.get("/guides/:slug"');
    expect(seo).toContain('app.get("/resources/:slug"');
    expect((seo.match(/status\(404\)/g)??[]).length).toBeGreaterThanOrEqual(2);
    expect(seo).toContain("noindex");
  });
});
