import type { Express } from "express";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getPublicGuide, publicGuides } from "../../client/src/data/publicGuides";

const ORIGIN = "https://aiforstudents.in";
const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char] ?? char));

function renderHtml(title: string, description: string, urlPath: string, body: string, schema?: object): string {
  const base = readFileSync(path.resolve(process.cwd(), "dist/public/index.html"), "utf8");
  const fullTitle = `${title} | AI for Students`;
  const canonical = ORIGIN + urlPath;
  const tags = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:type" content="${schema ? "article" : "website"}">`,
    `<meta name="twitter:card" content="summary">`,
    schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>` : "",
  ].join("\n");
  // Replace the base page's generic metadata, not simply append duplicates.
  const shell = base
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/i, "")
    .replace(/<meta\s+property="og:(?:title|description|url|type)"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:(?:card|title|description)"[^>]*>/gi, "");
  return shell.replace("</head>", `${tags}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function articleMarkup(slug: string): string | null {
  const guide = getPublicGuide(slug);
  if (!guide) return null;
  const esc = escapeHtml;
  return [
    `<main><nav><a href="/">Home</a> / <a href="/guides">AI guides</a></nav>`,
    `<article><header><p>${esc(guide.category)}</p><h1>${esc(guide.title)}</h1><p>${esc(guide.intro)}</p></header>`,
    `<h2>Step-by-step guide</h2>`,
    ...guide.steps.map((step) => `<section><h3>${esc(step.heading)}</h3><p>${esc(step.body)}</p></section>`),
    `<section><h2>Example prompt</h2><p>${esc(guide.example)}</p></section>`,
    `<section><h2>Quick checklist</h2><ul>${guide.checklist.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>`,
    `<p><a href="${guide.relatedHref}">${esc(guide.relatedLabel)}</a></p></article>`,
    `<nav><a href="/guides">Browse all free AI guides</a></nav></main>`,
  ].join("");
}

/** Serve indexable, server-visible public content before the SPA bundle replaces the shell. */
export function registerPublicSeoPages(app: Express) {
  if (process.env.NODE_ENV !== "production") return;
  app.get("/guides", (_req, res, next) => {
    try {
      const body = `<main><h1>Free AI guides for students and parents</h1><p>Practical learning, study skills, safe prompting and fact-checking.</p><ul>${publicGuides.map((guide) =>
        `<li><a href="/guides/${guide.slug}">${escapeHtml(guide.title)}</a> — ${escapeHtml(guide.description)}</li>`).join("")}</ul></main>`;
      res.type("html").send(renderHtml("Free AI Guides for Students, Beginners and Parents",
        "Free AI study, prompt-writing, research and parent safety guides.", "/guides", body));
    } catch (error) { next(error); }
  });
  app.get("/guides/:slug", (req, res, next) => {
    const guide = getPublicGuide(req.params.slug);
    if (!guide) return next();
    try {
      const schema = {
        "@context": "https://schema.org", "@type": "Article",
        headline: guide.title, description: guide.description, inLanguage: "en",
        author: { "@type": "Organization", name: "AI for Students" },
        publisher: { "@type": "Organization", name: "AI for Students" },
        mainEntityOfPage: ORIGIN + "/guides/" + guide.slug, isAccessibleForFree: true,
      };
      res.type("html").send(renderHtml(guide.title, guide.description,
        "/guides/" + guide.slug, articleMarkup(guide.slug) ?? "", schema));
    } catch (error) { next(error); }
  });
}
