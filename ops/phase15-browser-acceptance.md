# Phase 15 — Pre-deployment visible UX and browser acceptance

**Date:** 2026-11-10  
**Repository:** `sahilk267/hostinger-ai-for-students`  
**Branch:** `feature/phase14-visible-learning-journey-20261110`  
**PR:** https://github.com/sahilk267/hostinger-ai-for-students/pull/3 (Draft)  
**Latest fully tested code SHA:** `3495b86b344a670cfd256a961ae0c47405bbb2a3`  
**CI PASS:** https://github.com/sahilk267/hostinger-ai-for-students/actions/runs/42718752677  
**Evidence artifact:** `phase14-browser-qa` (9 PNG screenshots plus JSON report, in the CI run's Artifacts area; expires November 23, 2026)

## Summary

44 automated Chromium browser acceptance assertions passed, on **isolated localhost compiled Express** with *no production database, real OTP, mail delivery, actual learner records or production deployment*. CI also passed TypeScript, Vitest, production build, compiled-app API smoke and real isolated MySQL security/auth/guardian/newsletter integration.

### Screenshot evidence and checks

| Snapshot | Width / state | What the runner asserts |
|---|---|---|
| `01-home-desktop.png` | 1280px homepage | Start Free Adventure, four-stage learning path, For Parents and legacy 30-day Journey link, truthful newsletter-off notice and real adult feedback form |
| `02-home-360px-menu.png` | 360px homepage with open menu | Prominent CTA fits mobile viewport; mobile Discovery menu opens; no horizontal overflow |
| `02-home-320px-menu.png` | 320px homepage with open menu | Primary CTA stays usable; no horizontal overflow; visible navigation works |
| `03-my-journey-360px.png` | 360px new learner | Honest 0/9 browser-local progress and immediate family plan access, no fabricated result |
| `04-parent-guide-desktop-hindi.png` | Desktop parent guide, Hindi | Three 10-minute sessions, insufficient-evidence statement, Hindi titles render after language change, print CSS hides site navigation |
| `05-parent-guide-320px.png` | 320px parent guide | Parent page renders all three sessions without horizontal overflow |
| `06-adventure-360px.png` | 360px Discovery Adventure | Age 8–10 deep link, all three age-group options, visible Family Plan access, no horizontal overflow |
| `08-private-milestone-12tasks-desktop.png` | Desktop synthetic 9+3 completion | All 9 missions and all 3 transfer cases solved by **test-only fixture**, private milestone correctly unlocked; delete control verified |
| `07-email-confirmation-sanitized.png` | Desktop adult email confirmation | Private query token removed from address bar; server sets `Referrer-Policy: no-referrer` and `Cache-Control: private, no-store`, confirmation not performed automatically |

Screenshots are snapshots of the isolated compiled test build. Remote hero imagery/fonts may be blocked by the CI Chrome offline host resolution. This is **not** a human visual-art-direction sign-off.

### Verified cross-component journey

1. Fresh local browser: no existing learner state; `0/9` dashboard.
2. Attempted direct link `?view=challenge` before nine solved tasks: correctly denied.
3. Test helper `ops/phase14-browser-fixture.ts` loads real authored 11–13 mission and transfer IDs (9+3) and generates synthetic valid completion records. No real learner responses are fabricated or sent to a service.
4. With 9 test-only practice mission records, `/my-journey` offers direct `?view=challenge`; the Adventure page opens its assessment.
5. With 3 additional test-only transfer records, `/my-journey` shows 3/3 and deep-links to the private milestone/report.
6. Report shows earned local milestone, not an accredited certificate; local delete button removes both sets of browser practice results.
7. Returning to dashboard shows 0/9 again.
8. Newsletter confirmation URL query tokens are erased from history; adult signup remains disabled by default and must not claim a successful subscription.

### Security / data isolation

- The browser CI process starts only `dist/index.js` at `http://127.0.0.1:43179` with explicit **CI-only loopback exception**, blank database/mail configuration, all child cloud/AI/certificate flags OFF, `NEWSLETTER_SIGNUP_ENABLED=0`.
- Browser resolver blocks external hosts; no end-user data or external mail. It cannot assert how a live CDN/proxy behaves.
- No Hostinger environment variables, hosting services, production schema or live domain were modified by this phase.
- `ops/phase14-browser-qa.mjs` executes in the GitHub Actions main validation job and uploads artifacts whether it passes or fails. CI failures block code-level acceptance.

## What remains **not** completed, despite a green CI

- [ ] Human visual review of actual screenshots and polish of artwork, contrast, colors, copy and spacing across physical Android/iOS/desktop devices.
- [ ] Real keyboard-only, screen reader, high zoom/200%, network throttling and print-to-paper/A4 usability QA. CI checks one print media rule but not an actual printed sheet or every assistive technology.
- [ ] Real beginner/guardian usability sessions with consent; genuine mission-solving, explanation quality, completion comprehension and feedback usefulness. Synthetic localStorage records verify navigation, **not learner answer quality**.
- [ ] Live isolated Hostinger staging with separate database and mailbox, real OTP/contact email and newsletter confirmation/unsubscribe; backup, cache/CDN and proxy-IP behavior.
- [ ] Parent/child privacy legal and safeguarding sign-off, adult newsletter retention and marketing-compliance review. `NEWSLETTER_SIGNUP_ENABLED` and child-cloud/AI/checkpoint flags must remain OFF until separately approved.
- [ ] Reviewed release/rollback owner, pull request merge and live deployment (explicitly postponed).

**Status:** P1–P5 code + Phase 15 automated browser acceptance COMPLETE. **Production release and independently validated quality are NOT complete.** Do not claim the live website already shows these pages. Draft PR #3 remains the review artifact.
