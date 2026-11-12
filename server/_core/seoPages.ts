import type { Express } from "express";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getPublicGuide, publicGuides } from "../../client/src/data/publicGuides";
import { getLearningCluster, learningClusters } from "../../client/src/data/learningClusters";
import { guideExercises } from "../../client/src/data/guideExercises";

const configuredOrigin = process.env.SITE_URL?.trim();
const ORIGIN = configuredOrigin && /^https:\/\/[a-z0-9.-]+(?::\d+)?\/?$/i.test(configuredOrigin)
  ? configuredOrigin.replace(/\/$/, "")
  : "https://aiforstudents.in"; // Replace with verified SITE_URL before deploying on a different domain.
const htmlEntities: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (char) => htmlEntities[char] ?? char);

function renderHtml(title: string, description: string, urlPath: string, body: string, schema?: object): string {
  const base = readFileSync(path.resolve(import.meta.dirname, "public", "index.html"), "utf8");
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
    `<section><h2>Worked examples and exercises</h2>${(guideExercises[slug]??[]).map(item=>`<section><h3>${esc(item.label)}</h3><p><strong>Situation:</strong> ${esc(item.scenario)}</p><p><strong>Task:</strong> ${esc(item.task)}</p><p><strong>Example approach:</strong> ${esc(item.modelApproach)}</p><p><strong>Check:</strong> ${esc(item.check)}</p></section>`).join("")}</section>`,
    `<section><h2>Example prompt</h2><p>${esc(guide.example)}</p></section>`,
    `<section><h2>Quick checklist</h2><ul>${guide.checklist.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>`,
    `<p><a href="${guide.relatedHref}">${esc(guide.relatedLabel)}</a></p></article>`,
    `<nav><a href="/guides">Browse all free AI guides</a></nav></main>`,
  ].join("");
}

/** Serve indexable, server-visible public content before the SPA bundle replaces the shell. */
export function registerPublicSeoPages(app: Express) {
  if (process.env.NODE_ENV !== "production") return;
  // Keep sitemap and robots aligned with the configured canonical host when served by Node.
  app.get("/sitemap.xml", (_req, res, next) => {
    try {
      const xml = readFileSync(path.resolve(import.meta.dirname, "public", "sitemap.xml"), "utf8")
        .replace(/https:\/\/aiforstudents\.in/g, ORIGIN);
      res.type("application/xml").send(xml);
    } catch(error) { next(error); }
  });
  app.get("/robots.txt", (_req, res, next) => {
    try {
      const robots = readFileSync(path.resolve(import.meta.dirname, "public", "robots.txt"), "utf8")
        .replace(/https:\/\/aiforstudents\.in/g, ORIGIN);
      res.type("text/plain").send(robots);
    } catch(error) { next(error); }
  });
  const ecosystemPages = [
    {"route":"/learn","title":"Free AI Learning Lessons for Students","description":"Beginner-friendly AI lessons and practical exercises","heading":"Learn AI with practical student lessons","intro":"Start with responsible lessons, free guides and a guided practice experience.","links":[{"href":"/start","label":"Start a guided activity"},{"href":"/guides","label":"Read AI learning guides"}]},
    {"route":"/study","title":"Study with AI Without Copying Answers","description":"Learn active recall, prompts and exam study techniques","heading":"Study with AI and keep your own thinking","intro":"Use AI to clarify concepts, practise recall and independently verify answers.","links":[{"href":"/guides/how-to-use-ai-for-studying","label":"How to study with AI"},{"href":"/guides/ai-study-plan-for-exams","label":"Exam revision guide"}]},
    {"route":"/topics","title":"120 AI Topics with Related Practice","description":"Explore practical AI topics and relevant guides","heading":"AI learning topics and next steps","intro":"Browse topics for study, safety, research, career and coding skills.","links":[{"href":"/guides","label":"Free AI guides"},{"href":"/start","label":"First learning journey"}]},
    {"route":"/play","title":"Free AI Literacy Games and Practice","description":"Practise prompts, fact checking and AI safety","heading":"Free AI literacy learning games","intro":"Make practical decisions, explore explanations and practise again.","links":[{"href":"/play?game=fact","label":"Fact Check Quest"},{"href":"/play?game=safety","label":"AI Safety Lab"}]},
    {"route":"/discovery-lab","title":"Free Visual Learning and Pattern Games","description":"Try visual patterns, predictions and robotics activities","heading":"Visual practice games for students","intro":"Explore pattern recognition, prediction and planning with fun learning challenges.","links":[{"href":"/discovery-lab?game=pattern-builder","label":"Pattern Builder"},{"href":"/parents","label":"Family practice activities"}]},
    {"route":"/robotics","title":"Free Robot Route Builder for Students","description":"Plan and debug visual robot instructions","heading":"Build, test and repair a robot route","intro":"Practise instructions and adjust your plan in a hands-on robotics activity.","links":[{"href":"/discovery-lab?game=robot-programmer","label":"Robot Programmer"},{"href":"/teachers","label":"Teaching resources"}]},
    {"route":"/journey","title":"Free Guided AI Learning Journey","description":"Explore AI lessons with practical exercises","heading":"Follow a guided AI learning journey","intro":"Learn useful AI concepts through exercises and reflection.","links":[{"href":"/start","label":"Starter practice journey"},{"href":"/guides","label":"Free guides"}]},
    {"route":"/explorer","title":"Learning Explorer and Visual Practice","description":"Explore varied learning games and reflection","heading":"Explore learning through activities","intro":"Try challenges that encourage learners to think, retry and reflect. Activity data is not a diagnosis.","links":[{"href":"/discovery-lab","label":"Visual practice games"},{"href":"/parents","label":"Parent guidance"}]},
    {"route":"/mission","title":"Free Practical AI Learning Mission","description":"Try short real-world learning challenges","heading":"Try an AI learning mission","intro":"Practise responsible learning decisions with practical activities.","links":[{"href":"/start","label":"Starter learning journey"},{"href":"/play","label":"AI learning games"}]},
    {"route":"/contact","title":"Contact AI for Students","description":"Get in touch with the AI for Students team","heading":"Contact AI for Students","intro":"Share support questions and feedback without sending student records or passwords.","links":[{"href":"/plans","label":"Free access and adult plans"},{"href":"/guides","label":"Free learning guides"}]},

    {route:"/learn", title:"Free AI Learning Lessons for Students",description:"Beginner-friendly AI lessons and responsible study guides with practical exercises.",heading:"Learn AI with practical student lessons",intro:"Explore free introductory AI lessons, relevant guides and a short learning journey.",links:[{href:"/start",label:"Start a guided learning activity"},{href:"/guides",label:"Browse step-by-step AI guides"},{href:"/topics",label:"Explore AI learning topics"}]},
    {route:"/study", title:"Study with AI Without Copying Answers",description:"Practical study prompts, hints, active recall and exam revision guidance for students.",heading:"Study with AI while keeping your own thinking",intro:"Use AI to clarify concepts, practise recall and verify answers without outsourcing your work.",links:[{href:"/guides/how-to-use-ai-for-studying",label:"Learn responsible AI study methods"},{href:"/guides/ai-study-plan-for-exams",label:"Build an exam revision plan"},{href:"/play",label:"Practise clearer prompts"}]},
    {route:"/topics", title:"120 AI Learning Topics and Related Practice",description:"Explore 120 AI literacy topics with linked guides, skill practice and honest coverage notes.",heading:"Find AI learning topics and practical next steps",intro:"Explore AI foundations, studying, safety, evidence, coding and career topics. Each card links to related guidance and practice.",links:[{href:"/guides",label:"Free detailed guides"},{href:"/resources/ai-study-skills",label:"Study skills collection"},{href:"/start",label:"Try a first learning journey"}]},
    {route:"/play", title:"Free AI Literacy Practice Games",description:"Play prompt-writing, fact-checking, privacy and responsible AI decision games with useful next-step feedback.",heading:"Practise AI literacy with free learning games",intro:"Use interactive practice to compare prompt decisions, verify information and learn safer AI habits. Games are not diagnostic tests.",links:[{href:"/play?game=fact",label:"Try Fact Check Quest"},{href:"/play?game=safety",label:"Try AI Safety Lab"},{href:"/start",label:"Follow a guided journey"}]},
    {route:"/discovery-lab", title:"Free Visual Thinking and Pattern Games",description:"Explore free visual patterns, memory, predictions and robotics practice with reflective feedback.",heading:"Visual learning games for curious students",intro:"Explore shape patterns, predictions and playful decision-making without needing to enter personal information.",links:[{href:"/discovery-lab?game=pattern-builder",label:"Play Pattern Builder"},{href:"/discovery-lab?game=mini-scientist",label:"Try Mini Scientist"},{href:"/parents",label:"Use a family activity plan"}]},
    {route:"/robotics", title:"Free Robot Route Builder for Students",description:"Practise sequencing, planning and debugging robot routes with short interactive activities.",heading:"Build, test and repair a robot route",intro:"Try step-by-step robot planning, notice mistakes and revise a route. This is exploratory learning, not an ability test.",links:[{href:"/discovery-lab?game=robot-programmer",label:"Try a short robot programming challenge"},{href:"/teachers",label:"Find robotics classroom activities"},{href:"/start",label:"Start a guided learning journey"}]},
    {route:"/journey", title:"Free Guided AI Learning Journey",description:"Explore a structured AI learning journey with responsible prompts and practical tasks.",heading:"Follow a guided AI learning journey",intro:"Explore AI concepts and practical decisions with activities that encourage understanding and reflection.",links:[{href:"/start",label:"Begin a short practice journey"},{href:"/guides",label:"Read the free learning guides"}]},
    {route:"/explorer", title:"Free Learning Explorer Activities",description:"Explore varied visual practice activities and reflective learning experiences.",heading:"Explore learning through practical activities",intro:"Try a variety of games and activities and discuss what helped. Activity signals are not diagnoses or career predictions.",links:[{href:"/discovery-lab",label:"Try visual activities"},{href:"/parents",label:"Family discussion activities"}]},
    {route:"/mission", title:"Free Practical AI Learning Mission",description:"Try a short AI mission using reflection, responsibility and practical learning decisions.",heading:"Try a practical AI learning mission",intro:"Use short learning tasks to practise thinking, checking and revising instead of collecting tools.",links:[{href:"/start",label:"Guided first-session journey"},{href:"/play",label:"Explore AI practice games"}]},
    {route:"/contact", title:"Contact AI for Students",description:"Send feedback, questions and educator or parent enquiries to the AI for Students team.",heading:"Contact AI for Students",intro:"Share questions or feedback with our team. Please do not submit student records, passwords or other sensitive details.",links:[{href:"/plans",label:"Explore free access and future ideas"},{href:"/guides",label:"Browse free guides"}]},

    {
      route: "/start",
      title: "Start Learning AI — Your First Practice Journey",
      description: "Start a free AI learning journey with visual logic, robot planning, science predictions and fact-checking activities.",
      heading: "Start a free AI learning journey",
      intro: "Choose a goal, play an age-appropriate learning activity and return to reflect on what you practised. No account is required.",
      links: [
        {href: "/discovery-lab?game=pattern-builder", label: "Visual pattern practice"},
        {href: "/discovery-lab?game=mini-scientist", label: "Science prediction game"},
        {href: "/discovery-lab?game=robot-programmer", label: "Robot planning practice"},
        {href: "/play?game=fact", label: "Fact-checking game"},
      ],
    },
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
  app.get("/resources/:slug", (req, res, next) => {
    const cluster = getLearningCluster(req.params.slug);
    if (!cluster) return res.status(404).type("html").send("<!doctype html><html lang=\"en\"><head><meta name=\"robots\" content=\"noindex\"><title>Resource not found</title></head><body><main><h1>Resource not found</h1><a href=\"/guides\">Browse free guides</a></main></body></html>");
    try {
      const body = [
        `<main><nav><a href="/">Home</a> / <a href="/guides">Free guides</a></nav><h1>${escapeHtml(cluster.title)}</h1><p>${escapeHtml(cluster.intro)}</p><p>For: ${escapeHtml(cluster.audience)}</p>`,
        "<h2>Step-by-step learning resources</h2>",
        ...cluster.guides.map(item=>`<section><h3><a href="${item.href}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.summary)}</p></section>`),
        "<h2>Try a learning activity</h2>",
        ...cluster.practice.map(item=>`<section><h3><a href="${item.href}">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.why)}</p></section>`),
        "<h2>Common questions</h2>",
        ...cluster.questions.map(item=>`<section><h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p></section>`),
        "<nav><h2>More learning collections</h2><ul>",
        ...learningClusters.filter(item=>item.slug!==cluster.slug).map(item=>`<li><a href="/resources/${item.slug}">${escapeHtml(item.title)}</a></li>`),
        "</ul></nav></main>"
      ].join("");
      res.type("html").send(renderHtml(cluster.title,cluster.description,"/resources/"+cluster.slug,body));
    } catch(error){ next(error); }
  });
  app.get("/plans", (_req, res, next) => {
    try {
      const body = `<main><h1>Free AI Learning Resources and Future Adult Plans</h1><p>Free student games, lessons, parent activities and teacher packs are available. No paid plans or checkout are live.</p><h2>Available free resources</h2><ul><li><a href="/start">Student learning journey</a></li><li><a href="/parents">Parent Guidance</a></li><li><a href="/teachers">Teacher Solutions</a></li></ul><h2>Future plans under research</h2><p>Parent-managed features and educator workflows are ideas being validated; no price or availability is promised.</p><a href="/contact">Share feedback</a></main>`;
      res.type("html").send(renderHtml("Free Learning and Future Family & Teacher Plans", "Explore free learning, parent and teacher resources; optional premium features are only being researched.", "/plans", body));
    } catch(error){ next(error); }
  });
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
    if (!guide) return res.status(404).type("html").send("<!doctype html><html lang=\"en\"><head><meta name=\"robots\" content=\"noindex\"><title>Guide not found</title></head><body><main><h1>Guide not found</h1><a href=\"/guides\">Browse free guides</a></main></body></html>");
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
