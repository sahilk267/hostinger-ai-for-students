# Phase 14 — Visible Learning Product & Adult Feedback: delivery tracker

**Branch:** `feature/phase14-visible-learning-journey-20261110`  
**Base:** `feature/phase11-origin-guardian-guard-20261108` (security review branch; NOT live deployment)  
**Updated:** 2026-11-10. **Scope:** implementation + CI; deployment explicitly postponed by site owner.

## What is visible to a visitor now (in this branch)

| Priority | Experience | Implementation | Test evidence | Activation |
|---|---|---|---|---|
| P1 | Prominent Adventure header/navigation, first hero CTA and 4-step explainer | `client/src/pages/Home.tsx`, `phase14Journey.css` | Phase 14 route/journey contracts; legacy 30-day journey link restored | Ready in code; deployed site unchanged |
| P2 | Age-group journey, honest 9→3 challenge gate, direct Thinking Challenge link, parent plan entry | `DiscoveryAdventurePage.tsx`, `discoveryJourney.ts` | `server/phase14.journey.test.ts` | Ready in code |
| P3 | Single `/my-journey` dashboard + integrated Discovery card in existing `/progress` | `MyJourneyPage.tsx`, `DiscoveryJourneyCard.tsx`, `ProgressPage.tsx` | Unit/source route tests | Ready in code, browser-local Adventure is not account synced |
| P4 | `/for-parents` view with evidence-based 3-session plan, languages, 10-minute activities, guide questions, print/report | `ParentsGuidePage.tsx`, existing `DiscoveryParentReport.tsx` | Test report logic, source CTA contract | Ready in code, not validated psychometrics |
| P5 feedback | Parent/student-facing adult tester form sends to existing Hostinger Mail contact adapter | `SiteFeedbackPanel.tsx`, `contact.submit` | Unit contracts + existing contact transport tests | Ready when existing contact mail config works |
| P5 newsletter | Adult-only consent, confirmation email, 30-minute one-time link, MySQL opt-in record, unsubscribe | `AdultNewsletterSignup.tsx`, `NewsletterActionPage.tsx`, `newsletter.ts`, `newsletterSubscribers` | Crypto/route tests + isolated real MySQL confirm→unsubscribe→rejoin test | **Default OFF** until privacy review, optional migration, shared-worker rate limits and verified staging mail |

### Accessible front-door routes

- `/`: **Start Free Adventure** main button; direct My Journey + For Parents; clear 4-step explanation. Legacy `/journey`, `/learn`, `/study` remain available.
- `/explorer/adventure`: age-band missions; navigation step bar; report at any time; 3 new challenges unlock after 9 solved. `?age=11-13&view=report` opens private report. `?age=11-13&view=challenge` only opens when nine tasks solved locally.
- `/my-journey`: 9/9 missions and 3/3 transfer progress, next appropriate CTA, family plan link, local game completion, device-only notice.
- `/for-parents`: language + band selectors and **three practice sessions available immediately**, with explicit limited-evidence notice for a new user. Detailed private report links back to Adventure.
- `/progress`: original games + new Discovery card; game account sync does NOT imply Discovery Adventure sync.
- `/newsletter/confirm`, `/newsletter/unsubscribe`: token-bearing email pages, mutation only after deliberate button; no public subscriber lookup.
- `/contact`: existing adult email support; homepage/dashboard/parent page include real feedback form.

## Adult newsletter deployment gate (P5)

**Code implemented, no newsletter database migration imported anywhere.** The homepage no longer lies with "You're on the list" for a local-only form submission. With `NEWSLETTER_SIGNUP_ENABLED` unset/`0`, it truthfully shows that signups are closed and provides a feedback alternative. Do NOT set flag `1` until staging has passed all items:

- [ ] Obtain privacy/marketing policy review: 18+ only self-declaration, explicit consent, purpose and retention periods, support/unsubscribe contact. Age self-declaration is NOT proof of adult identity. Do not enroll students or minors.
- [ ] Configure an isolated staging DB/mailbox. Back up and apply **only to isolated staging**: `ops/phase14-adult-newsletter.sql`. Do not re-import `hostinger-schema-import.sql` into an existing DB.
- [ ] Verify `newsletterSubscribers` primary key, safe storage of adult address (privacy-controlled), no plaintext confirmation token, and cleanup/retention ownership. No bulk newsletter sender/campaign schedule exists.
- [ ] Verify Phase 11 `authRequestBuckets` schema, `AUTH_ABUSE_DB_ENABLED=1` and real Hostinger peer-IP architecture. This gate is required for `NEWSLETTER_SIGNUP_ENABLED=1`; do not force it where clients share a proxy IP and would be locked out.
- [ ] Verify `HOSTINGER_MAIL_API_TOKEN`, `AUTH_MAIL_FROM`, HTTPS `PUBLIC_SITE_ORIGIN` on a test-only domain, without exposing credentials.
- [ ] On staging, test adult opt-in, real verification delivery, new and reused token rejection, duplicate email cooldown, opt-out, rejoin requiring new verification, and email provider failure. Do not involve a real child.
- [ ] Assign owner for subscriber export/access, newsletter sending with per-message unsubscribe, pending record cleanup, unsubscribed retention and deletion requests. **No newsletter campaign delivery exists yet.**
- [ ] Confirm privacy/security sign-off and explicit future production enablement.

Flags/limits: `NEWSLETTER_SIGNUP_ENABLED=0` default; enabling requires `AUTH_ABUSE_DB_ENABLED=1`, DB configured and Hostinger Mail config. `newsletter-request` fixed-window budget is **3 requests per hour per observed TCP peer** (which may be a shared reverse proxy). Per-email cooldown 15 minutes; confirmation expires in 30 minutes. Reply/subscriber email is the only identifiable data stored in `newsletterSubscribers`. The email key is an HMAC, not plain text; confirmation hash is stored, not the token. The unsubscribe token is an HMAC tied to `JWT_SECRET`; rotating JWT_SECRET invalidates existing opt-out links and requires a coordinated migration/notification plan. Link tokens may appear in request logs; protect/refine logging and referer policy before enabling.

## Suggested manual visible-product acceptance (not completed by CI)

- [ ] Fresh anonymous browser: homepage primary CTA visible on desktop and Android 360/320 px, nav works without horizontal overflow.
- [ ] First attempt: 8–10/11–13/14–17 select correctly; switch Hinglish/Hindi/English; a no-history parent page says evidence is insufficient.
- [ ] Solve 1 mission, refresh, see `1/9` and appropriate next step on My Journey. Multiple children on same browser must clear local records between learners.
- [ ] Solve nine missions: locked challenge unlocks and dashboard direct link opens it. Solve all three, see milestone and a useful 3-session family plan.
- [ ] Parent Guide allows selection and print; browser print preview should not include navigation; report remains a practice summary, not an aptitude label.
- [ ] Legacy `/progress`, `/journey`, games, contact, OTP, and all primary navigation remain available.
- [ ] Adult tester feedback: mail delivered only after server success; provider failure shows an error, never fake success.
- [ ] Newsletter default-OFF tells the truth on browser; after approved staging DB/import/email review, adult opt-in/confirm/unsub passes end to end.
- [ ] Privacy/accessibility review: keyboard focus, labels, low-end mobile, no cross-age comparison, no private child data collection.

## Remaining product work beyond Phase 14

The visible educational MVP is implemented in code, but it is not a paid/verified student-identification product. **Still not implemented:** legally verified guardian consent, accredited certificate, child-cloud data retention/identity controls, independent validated psychometric assessment, newsletter campaign delivery, real visitor analytics/acquisition plan, professional multi-device UX testing. AI feedback, child cloud-saving and checkpoint certification flags remain OFF. Revisit product research with 5–10 consenting adult families before building additional hidden technical phases.

## Change-management status

- [x] Phase 14 P1–P5 implemented on isolated GitHub branch, with relevant tests and docs.
- [x] GitHub CI verified for Phase 14 implementation/docs commit `63cd5a0d906cf3fb36108624d7a944c33a211c06`: https://github.com/sahilk267/hostinger-ai-for-students/actions/runs/42712113727 (TypeScript, all unit/route tests, production build, compiled-app smoke, isolated real MySQL auth/guardian/newsletter suites).
- [ ] Hostinger staging/live deployment, database migration, browser QA and approvals — deliberately deferred, **not falsely marked complete**.

## Phase 15 pre-deployment browser acceptance — evidence summary

**Pass:** https://github.com/sahilk267/hostinger-ai-for-students/actions/runs/42718752677 on test code `3495b86b344a670cfd256a961ae0c47405bbb2a3`. Chromium performed 44 UI assertions and saved 9 screenshots in `phase14-browser-qa` artifact: desktop homepage, 360px+320px home/menu, 360px dashboard, desktop Hindi parent plan, 320px parent plan, 360px Adventure, desktop 12-task milestone, and sanitized adult confirmation page. It verified synthetic state 0/9 → 9/9 → direct Thinking Challenge → 3/3 → local milestone → delete → 0/9. Privacy headers and no-history email tokens checked.

**Still to do manually:** actual learner game completion, real visual polish review, Android/iOS/screen-reader/A4 print QA, genuine guardian feedback and real isolated Hostinger deployment. No production change or real newsletter signup is part of this pass. Complete details: `ops/phase15-browser-acceptance.md`.
