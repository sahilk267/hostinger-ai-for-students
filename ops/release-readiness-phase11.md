# AI for Students — Phase 11 release evidence & gate tracker

**As of 2026-11-08. Review branch:** `feature/phase11-origin-guardian-guard-20261108`. **Draft PR:** https://github.com/sahilk267/hostinger-ai-for-students/pull/2. **Base:** `feature/discovery-adventure-pilot-20261106` (reported by the owner as deployed). Status: **CODE READY FOR REVIEW; PRODUCTION PROMOTION BLOCKED**.

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
