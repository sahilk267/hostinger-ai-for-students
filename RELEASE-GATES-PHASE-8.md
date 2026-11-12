# Phase 8 — Direct-Link Reliability and Release Gate Audit
**Date:** 2026-11-13
**Branch:** main. No deployment.

## Source-level audit
- GitHub Actions source quality workflow exists, but this connector does not expose a confirmed successful run for the current main commit. Absence of a reported commit status **does not** mean a successful or failed run.
- An audit of 75 authored guide, activity and learning-collection links found no broken references to the six published guide slugs.
- The production SPA fallback in `server/_core/vite.ts` already included a custom unknown-route 404 and private-page noindex implementation; no duplicate fallback was added.
- Identified a request routing risk: a wildcard-mounted Express `app.use("*", ...)` can modify the mounted request path. Using `req.path` for direct-link classification may misclassify real deep links.
- Introduced `server/_core/spaRoutes.ts` to derive the path from `req.originalUrl` and use explicit allowlists for known SPA routes and private results.
- Updated `serveStatic` to use the pure, testable route helpers. Existing 404/noindex behavior remains for unknown URLs; account, progress, certificates and explorer share pages remain noindex.
- Created `server/spa.routes.test.ts` covering direct query links, trailing slash, share routes, unknown SEO slugs and private pages. Added it to `.github/workflows/source-quality.yml` along with the earlier content/SEO/robotics tests.

## Verification status
**Confirmed through GitHub source reads:** route helper created; server fallback updated; tests and CI workflow committed; cited guide links match published guide slugs; commits visible in main.
**Not confirmed:** executed Vitest tests, TypeScript pass, production Node/Vite build, workflow conclusion, browser/mobile behavior, print exports, deployed HTTP headers/status, or Search Console indexing. Do not claim production readiness based solely on code review.

## Next release gates
1. Inspect a completed GitHub Actions run (or locally execute `pnpm install --frozen-lockfile && pnpm check && pnpm exec vitest run && pnpm build`). Address any failures.
2. Start built Node app with test-only safe environment, verify deep-link GET 200, unknown GET 404 and private pages noindex using HTTP requests.
3. Browser smoke-test all four ecosystem pillars, Robotics no-double-scoring, 22 post-game guidance links, family/teacher downloads and mobile accessibility.
4. Confirm real canonical domain, sitemap/robots, deployment environment and consent/privacy before production rollout.
