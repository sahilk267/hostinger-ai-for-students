import type { Express } from "express";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getPublicGuide, publicGuides } from "../../client/src/data/publicGuides";

const ORIGIN = "https://aiforstudents.in";
const htmlEntities: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (char) => htmlEntities[char] ?? char);

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
  const ecosystemPages = [
    {
      route: "/parents",
      title: "Parent Guidance: Safe AI Learning Activities for Kids",
      description: "Free parent-child learning activities, privacy guidance and practical next steps for AI literacy and visual play.",
      heading: "Parent Guidance: AI learning activities to try together",
      intro: "Choose short, age-appropriate visual games, discuss what your child tried and support safer AI habits without fixed ability labels.",
      links: [
        {href: "/discovery-lab", label: "Visual Discovery Lab activities"},
        {href: "/progress", label: "Review private local learning progress"},
        {href: "/guides/ai-safety-for-kids-and-parents", label: "AI safety for parents and children"},
      ],
    },
    {
      route: "/teachers",
      title: "Free AI Literacy Lesson Planner for Teachers",
      description: "Free short classroom AI literacy activities for prompting, fact-checking, privacy and robotics with copyable teacher lesson packs.",
      heading: "Free AI literacy classroom activities and lesson planner",
      intro: "Build a 15, 30 or 45-minute classroom pack with a learning objective, warm-up, guided practice and reflection. No class roster required.",
      links: [
        {href: "/play", label: "Prompt writing practice"},
        {href: "/play?game=fact", label: "Fact checking activity"},
        {href: "/robotics", label: "Robot route planning game"},
      ],
    },
  ];
  for (const page of ecosystemPages) {
    app.get(page.route, (_req, res, next) => {
      try {
        const body = `<main><header><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.intro)}</p></header><h2>Explore the learning resources</h2><ul>${page.links.map(link=>`<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`).join("")}</ul><p>Practice suggestions are not intelligence tests, diagnoses or predictions.</p><a href="/">AI for Students home</a></main>`;
        res.type("html").send(renderHtml(page.title,page.description,page.route,body));
      } catch(error) { next(error); }
    });
  }
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
