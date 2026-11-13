/** Production-style HTTP smoke test for the standalone bundled public SEO routes.
 * Runs AFTER the Vite build and esbuild bundle. Does not need DB, OAuth or deployment.
 */
import assert from "node:assert/strict";
import { once } from "node:events";
import express from "express";
import { registerPublicSeoPages } from "../dist/seo-pages-smoke.mjs";

process.env.NODE_ENV = "production";
process.env.SITE_URL = "https://example.test";

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
  console.log("PASS: SEO HTTP smoke verified article, resources, parent/plans pages, 404s, canonical, sitemap and robots.");
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
