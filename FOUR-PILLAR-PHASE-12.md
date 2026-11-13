# Phase 12 — Six-guide HTTP regression coverage and release evidence

**Date:** 2026-11-13  
**Scope:** Source tests and documentation; no deployment.

## Confirmed historical phase coverage
- Phase 7: robotics scoring and duplicate SEO route corrections.
- Phase 8: deep-link SPA fallback and 404/noindex classification.
- Phase 9: guest progress robustness, family summaries and SEO HTTP smoke.
- Phase 10: visual-game rapid-tap/timer reliability and educator collection tests.
- Phase 11: authored guide decisions, accessible response feedback, and crawlable SEO content.

These phases are implemented in source; previous GitHub Actions runs verified the included automated checks. Real browser, accessibility, production SEO and learner pilots are **not** thereby verified.

## New Phase 12 source gate
The production-style standalone Express HTTP smoke test now checks **all six** public guides (not only one) for:
- HTTP 200 and server-visible one-minute decision content.
- Server-visible learning feedback and interaction disclosure.
- Worked examples in the initial HTML.
- Exactly one canonical link pointing to the synthetic test host and correct slug.
- Exactly one H1 heading per article.

This adds protection against a future guide becoming a thin client-only page, duplicate canonicals or broken article hierarchy.

## Verification and remaining gates
- CI result for this new commit must be inspected before claiming Phase 12 automation passed.
- GitHub Actions uses a synthetic SITE_URL and locally started Express; it is **not** a live production or Google indexing check.
- Browser E2E remains pending: keyboard, 320px/390px, 200% zoom, screen reader, guest storage blocked, game completion and parent/teacher print/download.
- Confirm production host, canonical, sitemap, robots, consent, OAuth and DB integration only when deployment work is authorized.
- Do not infer validated learning outcomes or revenue from game counts or CI.

## Next recommended task
Add browser-based E2E coverage on a reproducible preview environment, then record actual results with screenshots and device/browser details before calling the release production-ready.
