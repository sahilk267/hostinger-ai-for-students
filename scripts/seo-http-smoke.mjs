/** Production-style HTTP smoke test for the standalone bundled public SEO routes.
 * Runs AFTER the Vite build and esbuild bundle. Does not need DB, OAuth or deployment.
 */
import assert from "node:assert/strict";
import { once } from "node:events";
import express from "express";
process.env.NODE_ENV = "production";
process.env.SITE_URL = "https://example.test";
// The SEO module reads SITE_URL at module initialization; import after setting it.
const { registerPublicSeoPages } = await import("../dist/seo-pages-smoke.mjs");

const app = express();
registerPublicSeoPages(app);
app.use((_req, res) => res.status(404).end());
const server = app.listen(0, "127.0.0.1");
try {
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address === "object", "HTTP server did not bind");
  const base = `http://127.0.0.1:${address.port}`;
  async function read(route, expectedStatus) {
    const result = await fetch(base + route);
    assert.equal(result.status, expectedStatus, `Unexpected HTTP status for ${route}`);
    return { body: await result.text(), headers: result.headers };
  }

  const article = await read("/guides/how-to-check-ai-answers", 200);
  assert.match(article.body, /How to Fact-Check AI Answers/);
  assert.match(article.body, /Worked examples and exercises/);
  assert.match(article.body, /rel="canonical" href="https:\/\/example\.test\/guides\/how-to-check-ai-answers"/);
  assert.match(article.headers.get("content-type") ?? "", /text\/html/);

  // All six published guides must render crawlable decision checks without browser JS.
  const guideSlugs = [
    "how-to-use-ai-for-studying",
    "ai-prompts-for-students",
    "how-to-check-ai-answers",
    "ai-study-plan-for-exams",
    "ai-safety-for-kids-and-parents",
    "ai-tools-for-beginners",
  ];
  for (const slug of guideSlugs) {
    const response = await read("/guides/" + slug, 200);
    assert.match(response.body, /One-minute decision check/, slug + ": missing decision");
    assert.match(response.body, /Learning note:/, slug + ": missing feedback");
    assert.match(response.body, /Try the interactive choices/, slug + ": missing interaction disclosure");
    assert.match(response.body, /Worked examples and exercises/, slug + ": missing worked examples");
    const canonical = "https://example.test/guides/" + slug;
    assert(response.body.includes('rel="canonical" href="' + canonical + '"'), slug + ": wrong canonical");
    assert.equal((response.body.match(/rel="canonical"/g) ?? []).length, 1, slug + ": duplicate canonical");
    assert.equal((response.body.match(/<h1(?:\s|>)/g) ?? []).length, 1, slug + ": expected one article H1");
  }

  const collection = await read("/resources/ai-study-skills", 200);
  assert.match(collection.body, /Free AI Study Skills for Students/);
  assert.match(collection.body, /Common questions/);
  assert.match(collection.body, /rel="canonical" href="https:\/\/example\.test\/resources\/ai-study-skills"/);

  const adultPage = await read("/plans", 200);
  assert.match(adultPage.body, /No paid plans or checkout are live/);

  const parents = await read("/parents", 200);
  assert.match(parents.body, /Parent Guidance/);

  for (const missing of ["/guides/nonexistent", "/resources/nonexistent"]) {
    const result = await read(missing, 404);
    assert.match(result.body, /noindex/);
  }

  const sitemap = await read("/sitemap.xml", 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /xml/);
  assert.match(sitemap.body, /https:\/\/example\.test\/resources\/ai-study-skills/);
  assert.doesNotMatch(sitemap.body, /https:\/\/aiforstudents\.in/);

  const robots = await read("/robots.txt", 200);
  assert.match(robots.body, /Sitemap: https:\/\/example\.test\/sitemap\.xml/);
  assert.doesNotMatch(robots.body, /https:\/\/aiforstudents\.in/);
  console.log("PASS: SEO HTTP smoke verified six guide decisions/canonicals, resources, parent/plans, 404s, sitemap and robots.");
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
