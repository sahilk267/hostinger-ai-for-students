# AI for Students — Phase 11 release evidence & gate tracker

**Updated 2026-11-10. Review branch:** `feature/phase11-origin-guardian-guard-20261108`. **Draft PR:** https://github.com/sahilk267/hostinger-ai-for-students/pull/2. **Base:** `feature/discovery-adventure-pilot-20261106` (reported by the owner as deployed). Status: **CODE READY FOR REVIEW; PRODUCTION PROMOTION BLOCKED**.

## What is completed in the repository

| Workstream | Status | Evidence |
|---|---|---|
| Privileged storage signing route | Implemented, default OFF | `/manus-storage/*` now requires both `MANUS_STORAGE_PROXY_ENABLED=1` and a strict `MANUS_STORAGE_PUBLIC_PREFIX` (public assets only), with traversal/encoding checks |
| Canonical tRPC Origin check | Implemented | `server/_core/sameOrigin.ts`; tests reject hostile Host spoof, wrong Origin and missing production canonical origin |
| Originless unsafe / Fetch Metadata protection | Implemented | `Sec-Fetch-Site` fail-closed cases in `server/auth.security-hardening.test.ts` and compiled-app smoke |
| Revocable account JWT sessions | Implemented, default OFF | `authSessions` schema, `registerAuthSession`, `isAuthSessionActive`, `revokeAuthSession`, sign-in/auth/logout integration; needs staging migration and `AUTH_SESSIONS_ENFORCED=1` |
| Shared-worker abuse buckets | Implemented, default OFF | `authRequestBuckets` schema, atomic bounded MySQL updates, OTP and contact integration; needs migration and peer-IP validation before `AUTH_ABUSE_DB_ENABLED=1` |
| Migration SQL | Prepared, **not applied** | `ops/auth-session-abuse-hardening.sql`; non-destructive CREATE TABLE IF NOT EXISTS for two new tables |
| Blank database schema | Synced for **fresh installs only** | `hostinger-schema-import.sql` now includes all seven core tables; never re-import into the owner's existing populated DB |
| CI | Automated | `.github/workflows/validate-discovery.yml`, normal TypeScript/unit/build/smoke plus isolated MySQL session/abuse concurrency suites |
| Developer docs + tracker | Implemented | This file, `todo.md`, ENV handoff, auth and staging runbooks |
| Read-only Hostinger staging configuration preflight | Implemented, no live account access | `ops/phase11-staging-gate.mjs`, `ops/check-phase11-staging.mjs`, and Node-native policy tests; self-acknowledgements are not proof |
| Read-only staging HTTPS probe | Implemented; live staging **not tested** | `ops/check-phase11-stage-http.mjs` tests health, cache policy, origin/Fetch Metadata denial, disabled public child sharing and default-off AI/cloud/checkpoint responses using public GET only |
| Read-only security schema inspector | Implemented; production/staging DB **not connected by assistant** | `ops/check-phase11-schema.mjs` queries INFORMATION_SCHEMA metadata for `authSessions` and `authRequestBuckets`, PKs and cascading FK; rejects same DB username/name as recorded production baseline |
| Production startup & response safety | Implemented on review branch | `server/_core/runtimeSecurity.ts` rejects missing weak JWT/invalid origin and missing opt-in integration prerequisites; `/api` no-store; 512 KB JSON limit; old child share links blocked while saving OFF |
| Live Hostinger validation | **NOT VERIFIED** | User previously attested health/Adventure/OTP worked on the earlier branch; no proof new Phase 11 commit, isolation, flags or table migration were applied |
| Guardian verification / official certification | **NOT IMPLEMENTED** | Only self-attestation, browser-local formative assessment and private practice milestone. Do not claim accreditation or verified identity |

## Staging-only acceptance (capture evidence before production promotion)

- [ ] Confirm which commit Hostinger actually serves and obtain a separate HTTPS staging app with isolated DB/user, secret, test email and independent origin.
- [ ] Backup staging DB; reconcile Drizzle migration journal; import `ops/auth-session-abuse-hardening.sql` there and verify 2 security tables/foreign keys.
- [ ] Configure exact staging `PUBLIC_SITE_ORIGIN`; verify browser GET/POST tRPC, forged `Host` rejection, invalid/absent `Origin`, `Sec-Fetch-Site` and OAuth callback compatibility.
- [ ] Enable `AUTH_SESSIONS_ENFORCED=1` on staging only; new adult test-account OTP login, authenticated account read, cookie attributes, logout, replay of old copied token denied, stale pre-migration cookies require re-login.
- [ ] Confirm multiple sessions and owner-scoped delete/export on staging; account deletion revokes via FK cascade; logout failure returns an error and clears browser cookie.
- [ ] Verify real Hostinger site assets do not depend on `/manus-storage/*`; if needed, review storage-side public prefix and test opt-in public assets. Never use proxy for private records.
- [ ] Determine Hostinger reverse-proxy TCP peer behavior across multiple independent clients. **DO NOT** enable DB-IP budgets if clients share the same proxy peer address.
- [ ] After verifying peer topology, enable `AUTH_ABUSE_DB_ENABLED=1` on staging and test 12/15 min OTP request, 50/15 min verify, 5/hour contact and legitimate-family/NAT fairness.
- [ ] Check DB downtime, error logs, email provider quotas and deletion/cleanup policy; assign owner for weekly TTL cleanup, do not silently create a background job.
- [ ] Manual low-end Android + 320px, keyboard, Hindi/Hinglish, 9+3 practice, local-clear, parent growth-plan and A4 print QA.
- [ ] Independent security, privacy, safeguarding and age/consent review before collecting learner records; no verified certificate, payment or cloud-save release.
- [ ] Approved change management: deployment window, exact commit, backup, monitoring, rollback and written human sign-off.

## Operational decision

**STOP / do not promote** until all required staging/manual acceptance items are grounded in actual evidence. CI green proves code checks only; it does not prove Hostinger proxy handling, connected DB migration, legal consent or the real mobile UX. Keep three learner-data feature flags disabled. Do not put database credentials, email tokens or personal child records in this tracker.

## Rollback notes

- Before enabling flags: current production remains on its earlier deployed branch and unaffected by this PR.
- On a staging failure: disable `AUTH_ABUSE_DB_ENABLED` if lockouts occur; disable `AUTH_SESSIONS_ENFORCED` only after acknowledging that older JWTs regain their original stateless validity.
- Do not `DROP` new tables or alter production user records as a rollback method. Backups and planned session reset are required before any production cutover.
- Roll back application deployment to the last known-good commit only through authorized Hostinger change control. Session tokens issued solely under DB enforcement might remain signed; coordinate JWT rotation/security response according to incident impact.

## Phase 12 — auth collision and OAuth-optional follow-up (2026-11-08)

- [x] Every freshly issued signed session JWT has a cryptographically unique `jti` even when created twice in the same second; recorded token digests no longer collide solely due to matching JWT claims/expiry.
- [x] With `AUTH_SESSIONS_ENFORCED=1`, a deleted account is not silently re-provisioned through the legacy OAuth auto-sync fallback; the external OAuth callback explicitly creates/upserts fresh accounts before new sessions.
- [x] Optional Manus OAuth now requires `VITE_MANUS_OAUTH_ENABLED=1`, `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` for the UI login path. The server also needs an independently approved `OAUTH_SERVER_URL`. OTP-only deployment needs none of these.
- [x] OTP dialog no longer states that browser-only Discovery Adventure practice was automatically saved in an account.
- [x] Dashboard and protected-route authentication fall back to the existing email OTP account entry when external OAuth is disabled, avoiding dead sign-in controls.
- [x] Add a secret-safe **static** staging config gate and six Node-native regression tests, and wire them into CI. Its acknowledgements must not be mistaken for actual Hostinger validation.
- [ ] Confirm live Hostinger/staging browser paths and migration in a real, isolated environment. **Code is not deployed by these commits.**

## Phase 13 — deploy-gate and API privacy closure (2026-11-10)

**Completed in code, only on Draft PR #2:**
- [x] Harden private account/tRPC response caching: `Cache-Control: private, no-store` and `X-Content-Type-Options: nosniff` for `/api/*`. Guard default-off public share-token reads even for old share URLs.
- [x] Reduce generic body parser limit from 50 MB to 512 KB JSON / 64 KB URL encoded. CI compiled-app smoke covers HTTP 413.
- [x] Fail startup of a production app missing a 32+ character `JWT_SECRET` or a canonical HTTPS `PUBLIC_SITE_ORIGIN`. Opt-in DB session/abuse flags require a configured MySQL connection. Privileged storage and external OAuth opt-ins need prerequisite configuration. CI's loopback-only HTTP exception explicitly requires two separate environment flags and does not permit a public HTTP domain.
- [x] Keep the external OAuth callback disabled by default with `MANUS_OAUTH_SERVER_ENABLED=0`; leave the OTP-only login path functional. Explicit opt-in requires approved `OAUTH_SERVER_URL` and `VITE_APP_ID`.
- [x] Create public-only `ops/check-phase11-stage-http.mjs` probe: checks staging/production origin separation *before* network calls and then does only safe GETs; no login or DB write. Unit tests use an offline fake HTTP responder.
- [x] Create `ops/check-phase11-schema.mjs` inspector: requires isolated staging name AND user separate from production baseline and checks table structure with read-only INFORMATION_SCHEMA SELECTs. CI executes against ephemeral MySQL after integration tests create schema.
- [x] Add operational commands / handoff and CI contracts. None of these scripts were run against the user's real Hostinger staging or production account.
- [ ] Actually create/access isolated Hostinger staging, verify backup and schema imported, run both live checks and save **redacted results**.
- [ ] Verify production served commit, safe release/rollback, HTTP behavior behind Hostinger CDN, real OTP and guardian privacy, independent proxy IPs and human mobile/safeguarding review.

**Release decision: STILL BLOCKED**. A green CI and passing synthetic/isolated database checks do not complete the real hosting, consent, provider or operator evidence gates. Live feature-branch deployment should remain unchanged until staging approval.

## Phase 14 — user-facing product readiness (2026-11-10)

A separate feature branch `feature/phase14-visible-learning-journey-20261110` adds prominent homepage Discovery entry, `/my-journey` dashboard, `/for-parents` three-session family plan and real adult feedback. This is **not merged or deployed** to the earlier owner-reported live feature branch. Parent insights are local educational practice evidence, not verified psychometrics.

The earlier homepage newsletter form falsely displayed a success without a backend. Phase 14 removes it. New adult-only double-opt-in subscriber persistence is implemented but requires separate `newsletterSubscribers` staging-only migration and `NEWSLETTER_SIGNUP_ENABLED=1`. This flag is default OFF and requires the Phase 11 shared-IP budget plus verified privacy/mail configuration; unsubscribing remains available even if signups later close. Campaign sending/retention owner are outstanding.

Details and P1–P5 evidence: `ops/phase14-visible-product-completion.md`. **Release remains blocked** by real staging/manual QA/approval; do not enable learner cloud storage, paid AI feedback, certificate checkpoints or marketing signup without the documented safeguards.
