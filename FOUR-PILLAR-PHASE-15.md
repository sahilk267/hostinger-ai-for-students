# Phase 15 — Browser journey smoke foundation

**Date:** 2026-11-13. No deployment.

## Source implementation
- Added a dedicated GitHub Actions browser-smoke workflow.
- Builds the real Vite client, serves it via a local preview and runs headless Chromium.
- Exercises /start journey selection, /teachers topic switch and worksheet download, /parents activity switch and worksheet download, and a guide decision heading.
- Repeats at 390px mobile and 1280px desktop; captures screenshots on failure.
- Browser dependencies are isolated in /tmp to avoid altering the application's lockfile or production dependencies.
- Fails on uncaught browser runtime errors.

## Evidence boundaries
- Phase 14 source CI run 43462792280 passed.
- This new browser workflow needs its own successful run before any browser test can be claimed passed.
- A built Vite preview is not the production Express/OAuth/database stack.
- Keyboard-only, screen-reader, real devices, print dialog, game completion and live SEO remain unverified.
- If CI fails, inspect screenshots/logs and correct the actual regression; do not label the phase verified.

## Next acceptance
Expand to real game completion and progress persistence, and add manual accessibility and print checks before production readiness.
