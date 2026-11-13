# Phase 9 — Guest Progress Reliability, Honest Family Summaries, Automated Regression Gates
**Date:** 2026-11-13
**Scope:** Repository/source and GitHub Actions tests. No production deployment or payments.

## Why this phase
The public platform permits free guest play on a device, and the family check-in summarises recent local practice. Browsers can restrict local storage and saved data can be corrupt; silent storage failures would falsely imply successful persistence. The phase strengthens technical reliability without turning practice counts into personal/diagnostic profiles.

## Implemented
- `client/src/lib/learningProgress.ts` now safely handles restricted/disabled storage during reading, saving, expiry reset and clearing data. No game page should crash solely because localStorage is disabled.
- Guest counters from storage are normalised to nonnegative safe integers, and scores to finite nonnegative numbers. Nonfinite game scores are not persisted.
- Start/completion analytics events are emitted by the shared progress layer only after local persistence succeeds; they remain optional and do not contain child identity. This measures successfully *recorded* guest practice, not every play if storage is blocked.
- New `isLearningProgressStorageAvailable()` checks whether storage can be written and cleared, enabling visible nonblocking warnings on `/start` and `/progress`.
- `learningProgress.test.ts`: covers new attempts, completions, best score retention, score corruption, invalid stored counts, malformed JSON, blocked storage, session expiry and storage availability.
- `familyPracticeSummary.test.ts`: covers distinct games vs sessions, seven-day latest-per-game visit caveat, stale/future timestamps and next-activity recommendations without diagnostic claims.
- `.github/workflows/source-quality.yml` now runs both regression suites alongside existing robotics/content, SEO and SPA route tests and production HTTP smoke checks.

## Data ethics and product semantics
- Device-local history remains one latest timestamp and lifetime counters per game, not a full historical event log.
- The family weekly check-in should not claim to know exact sessions or scores from the last seven days.
- A blocked-storage session can play games without persistence; the interface now calls this out.
- Signed-in server syncing continues to use the existing application path and has not been redesigned here.
- Deleting device-local progress is still separate from server-account data where applicable.

## Verification checklist
1. GitHub Actions: check tests, typecheck, Vite/Node bundle and SEO HTTP smoke result for the latest source SHA.
2. In a desktop/mobile browser, play a game with normal storage, refresh and verify its count.
3. Disable site storage/private browser permissions and verify the warning appears without stopping play. Re-enable storage and retry.
4. Confirm expired device guest records are cleared, and existing genuine completion scores remain intact.
5. Recheck family summaries show only distinct game counts and last recorded timestamps, never fabricated weekly sessions.
6. Confirm source changes do not alter auth, child privacy promises, payment flows or deployment.
7. Verify the actual production host's SEO response and client runtime separately before launch.

**Unverified here:** real-device browser UX, live database sync, live indexing, actual traffic, production deployment and revenue.

## Verified GitHub CI result
**Run 43337789030** passed for latest source-changing commit **4027d82e7d074ebcb8ebb28ce2039c53e8797e91**: locked installation, TypeScript, regression tests including guest progress and family summaries, production Vite/Node build, SEO HTTP smoke and output artifact checks. Later documentation-only commits are excluded from CI by the markdown path filter. This does **not** verify the deployed UI on a browser.
