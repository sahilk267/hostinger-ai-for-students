# Phase 7 — Technical SEO Quality Gates and Adult Feedback Research
**Date:** 2026-11-12
**Branch:** main
**Scope:** Source and CI automation; no live deployment or checkout.

## Product changes
- The public `/plans` page now offers four adult product-feedback prompts: family activity packs, family learning guidance, educator lesson libraries, and classroom planning workflow.
- Each prompt links to `/contact?topic=<allowlisted-id>`, where the existing real contact form is prefilled with a topic-specific question. Nothing is submitted automatically; adults must intentionally submit and include their own contact details.
- Successful adult feedback submissions emit a category-only `adult_research_feedback_submitted` event through the optional analytics adapter; child names, message contents and email are not included in the analytics event.
- No waitlist, purchasing, account entitlement or paid claim was added. Feedback is qualitative validation, not proof of willingness to pay.

## Technical SEO fixes
- Production Express static fallback now serves `dist/public/index.html` only for explicit supported SPA routes; unknown page URLs return genuine HTTP 404 with a noindex HTML response, and unknown asset requests return HTTP 404 instead of the application shell.
- Direct-load account, progress, certificates, private explorer results/share links receive `noindex,nofollow` and do not inherit the base homepage canonical when routed through the Node SPA fallback. Robot restrictions are not a security control; sensitive data must remain protected by the relevant API/auth layer.
- Additional public paths now have route-specific server-generated HTML content and metadata: `/learn`, `/study`, `/topics`, `/play`, `/discovery-lab`, `/robotics`, `/journey`, `/explorer`, `/mission`, and `/contact`. These initial snippets link to real activities; full dynamic game rendering still requires JavaScript.
- Prior guides/resources/parents/teachers/start/plans server responses and configurable canonical host settings remain intact.

## Automated source-quality gates
- Added `.github/workflows/source-quality.yml` to run on pushes and PRs against `main`.
- Uses Node 22, pnpm lockfile installation, `pnpm run check` for TypeScript and `pnpm run build` for Vite + Node bundle, then verifies `dist/index.js`, `dist/public/index.html`, `dist/public/sitemap.xml`, and `dist/public/robots.txt`.
- The first CI run revealed a genuine missing parenthesis in `GuideArticlePage.tsx`'s checklist onChange handler; corrected via commit `332b3838ca724d6d477fe7253c3eb7f93f4dd2e6`.
- **Verified CI success:** GitHub Actions run 43268220664 completed successfully for commit `332b3838ca724d6d477fe7253c3eb7f93f4dd2e6`, including locked installation, TypeScript check, production build and bundled entrypoint verification. Subsequent pushes trigger separate checks; they are not automatically covered by this successful run.
- GitHub Actions do not substitute for full live browser, accessibility, crawling and privacy verification.

## Before a real deployment
1. Confirm actual canonical domain and set `SITE_URL` (Node) and `VITE_SITE_URL` (Vite build) to the same HTTPS origin.
2. Require a passing current quality-gate workflow, then check rendered HTML `/guides/...`, `/resources/...`, `/teachers`, `/parents`, `/plans`, `/learn`, and `/discovery-lab`.
3. Confirm invalid routes and invalid guide/resource slugs return 404; private/account routes should be nonindexable.
4. Test game input, completion, progress, family/teacher download/print, and adult contact prefill/submission on mobile and desktop; maintain age/accessibility safeguards.
5. Configure and review aggregate analytics before any student-facing production use. Avoid tracking private query fields, children or individual learner identities.
6. Verify Search Console canonical URLs and indexing on the real domain; compare actual funnels only after observation.
7. Interview adult parents/teachers and assess pricing demand, legal/privacy obligations and school procurement requirements before adding checkout.

## Current business status
Core student, family and educator resources are free in the app source. Future parent and educator premium ideas remain hypotheses. Revenue, subscriptions and conversion metrics are **not live**.

- Production HTTP startup now validates `PORT` and binds the exact managed-host-assigned port rather than silently moving to another port; startup/listen failures set a nonzero process exit code.

## Final source quality verification
GitHub Actions run **43268784141** for source commit **3b66a2da1a42137922566250e922afed2a259da3** completed **successfully**: TypeScript, production Vite/Node build and expected output file checks all passed. Subsequent markdown-only tracking edits are skipped by CI via `paths-ignore`; the validated code did not change afterward.
