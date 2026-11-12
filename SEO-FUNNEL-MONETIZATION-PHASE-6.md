# Phase 6 — Content Quality, Funnel Measurement, Adult Plan Readiness & SEO Hardening
**Date:** 2026-11-12
**Repository:** sahilk267/hostinger-ai-for-students, main
**Release status:** Source changes committed. **NOT deployed, no payment activation, no live traffic or build/browser verification claimed.**

## Delivered: stronger student content
- `client/src/data/guideExercises.ts`: 8 original fictional hands-on examples across all six public guides.
- Worked situations include active recall, privacy-safe prompting, fictional citation checking and a realistic short revision plan.
- `GuideArticlePage.tsx` shows scenario, task, collapsible sample approach and check-yourself prompt.
- `server/_core/seoPages.ts` exposes the same substantial examples in initial article HTML to non-JavaScript crawlers.
- Do not publish unreviewed claims as formal evidence of learning effectiveness. Guides remain practical editorial resources.

## Delivered: aggregate, optional visitor→practice measurement
- `FunnelObserver.tsx` tracks `learning_funnel_page_view` for a **strict allowlist of public route paths**, including only known guide/cluster slugs. No query strings, personal profiles, free text or account identifiers are sent by this observer.
- `learningProgress.ts` emits `learning_practice_started` and `learning_practice_completed` for the 22 recorded game IDs. Existing game-specific tracking remains present, so distinguish the canonical shared events from older game events in dashboards.
- Guide/resource links continue to emit `guide_practice_click`, `resource_practice_click` and `resource_guide_click`; adult-access links emit `adult_plan_resource_click`.
- All use `trackLearningEvent`, which forwards only if the optional Umami integration is configured; Do Not Track is respected by the event wrapper and the optional script loader.
- There is **no new analytics database, cookie identifier, student event stream or revenue event**. Conversion rates cannot be claimed without deployed measurement and consent/compliance review.
- A pageview event can be missed if the optional script has not loaded at mount; use the analytics provider's normal pageview metrics as the acquisition baseline and treat custom events as indicative until validated.

## Delivered: transparent monetization readiness (not paid plans)
- New `/plans` page gives an accurate comparison of existing **free** Student Learning, Parent Guidance, Teacher Solutions.
- Clearly distinguishes *hypothetical* adult-managed premium features from currently available ones, with no pricing, checkout, subscription, waitlist or payment request.
- Linked from homepage, parent and educator pages and added to the sitemap; receives initial Node HTML and canonical title/description.
- Parent value candidates: consent-aware managed profiles, enhanced adult summaries and reviewed content. Teacher candidates: editable multi-session resources and privacy-safe classroom workflows.
- **Future gates:** adult interviews and educator pilots, school/privacy review, commercial terms, refunds/cancellation support, payment webhooks, server-side entitlement enforcement, costs and margins.

## Delivered: SEO reliability
- Server public SEO response loads built HTML relative to `import.meta.dirname/public/index.html`, avoiding dependence on `process.cwd()`.
- Server accepts optional `SITE_URL` for HTTPS canonical origin; client accepts optional `VITE_SITE_URL`; both must be set consistently to the **verified** real primary production domain.
- Client-generated printable lesson links and guide JSON-LD use shared `publicUrl` helper, which uses `VITE_SITE_URL` if configured and browser origin otherwise.
- Express serves sitemap.xml and robots.txt dynamically using `SITE_URL`, before static fallbacks, so the published hostname matches canonical **when the Node app handles requests**.
- Unrecognized guide/resource slugs have proper HTTP 404/noindex from previous phase. Other SPA routes may still fall back to HTTP 200, and most other landing routes do not have full SSR.

## Production configuration & verification checklist (NOT executed)
1. **Confirm actual public domain** and redirect other hosts to the canonical HTTPS host. Do not assume `aiforstudents.in` belongs to the deployed app.
2. Set `SITE_URL=https://REAL_HOST` on the production Node process, and `VITE_SITE_URL=https://REAL_HOST` **at Vite build time**. These values must be the same origin, with no trailing slash.
3. Build and start the Node app with its production static assets under `dist/public`. Using static-only hosting will bypass the custom server-generated SEO HTML and dynamic sitemap/robots routes.
4. Run TypeScript and production build, then confirm GET `/guides/how-to-check-ai-answers` contains its article steps and worked examples **before** JavaScript executes. Check content and 200 for all three resource clusters and `/plans`.
5. Confirm `/guides/nonexistent` and `/resources/nonexistent` return HTTP 404/noindex.
6. Inspect actual `<link rel=canonical>`, OG tags, sitemap.xml and robots.txt after deployment. Verify there is exactly one relevant canonical per route. Vite static-only deployment may retain the base HTML homepage canonical.
7. Verify guide→activity journey, all 22 practice start/completion events (using a *test* environment), mobile layout, keyboard navigation, text export and browser printing.
8. Decide whether the analytics provider is permissible for a children-oriented service in the operating jurisdiction. Configure `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` only after privacy review. The currently connected code expects the existing provider's `/umami` script path; verify it matches the deployed analytics integration.
9. Verify Search Console ownership, submit canonical sitemap, inspect priority URLs, then benchmark organic impressions, click-through, guide→practice clicks and aggregate practice completion over a minimum observation window.
10. Validate adult product interest with parents and teachers **before** implementing subscription backend or displaying a public paid tier.

## Proposed conversion metric definitions (not current results)
- **Acquisition:** number of organic sessions arriving at public resource/guide/plan pages, from provider/Search Console.
- **Guide engagement:** `guide_practice_click` / guide landing visits. This is a link-click ratio, not verified game starts.
- **Practice activation:** `learning_practice_started` / public resource or starter sessions; denominators require comparable attribution and privacy-safe provider reporting.
- **Practice completion:** `learning_practice_completed` / `learning_practice_started` by published game ID, treating repeated play separately.
- **Adult value exploration:** visits to `/plans`, clicks to parent/teacher free resources and qualitative feedback, **not** paid conversion.
- Avoid longitudinal individual-child tracking or invalid psychometric conclusions.

## Limitations
GitHub source inspection and commits do not prove that the production app builds, that UI works on a browser, or that crawlers index it. No real student evaluation or adult willingness-to-pay has been established. Stronger SEO depends on deployed technical health plus genuinely relevant editorial work, not metadata alone.
