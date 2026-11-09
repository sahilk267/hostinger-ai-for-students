# Phase 6: authentication hardening and guardian-managed records — rollout checklist

**Status (2026-11-08):** Owner reports the earlier feature branch was deployed and its public health, Adventure, and OTP smoke checks worked. That report is not an independent Hostinger audit. Phase 11 changes are ONLY on a separate Draft PR #2 and are NOT deployed or authorized for promotion. No legally verified guardian consent or identity authentication is implemented.

## Security changes in this branch

- Email OTP: new opaque 32-byte random cookie identifier; key-separated HMAC-SHA256 of normalized email and six-digit code stored in MySQL. No plaintext OTP/email in the challenge table or cookie.
- Enforced globally across shared-hosting workers by MySQL: one active challenge per hashed email, 60-second resend cooldown, 10-minute TTL, maximum five incorrect verification attempts, atomic one-time successful consumption and rejection of replay. Failed mail delivery cancels the reserved challenge when possible.
- Cookie policy: first-party HTTP-only SameSite=Lax; Secure forced in production; avoids trusting arbitrary X-Forwarded-Proto headers. Newly issued email and OAuth sessions expire after 30 days instead of one year.
- **Phase 11 (separate review branch):** API browser requests carrying foreign Origin headers are denied before tRPC; when PUBLIC_SITE_ORIGIN is configured it is authoritative and untrusted Host headers cannot bypass it. Cross-site/same-site Fetch Metadata is denied, and originless unsafe requests require same-origin metadata or an explicit Bearer token. This guard is still defense-in-depth, not a complete CSRF solution by itself.
- Guardian Explorer: new profile creation requires explicit adult/guardian self-declaration, but this is **not verified adult identity or legal parental consent**. Mission IDs must match age band. Account-owned profile deletion now uses FK cascade to remove saved attempts and associated share tokens, rather than soft-delete leaving content behind.
- New private **/guardian** page lets an authenticated account owner list profiles and mission attempt counts, confirm permanent deletion and manage records. It never displays raw learner answers or exposes public profiles.
- Account export now includes Explorer profiles, raw saved evidence and account-created share summaries, not only generic game scores. Browser-only guest results are not exported, and any downloaded JSON can contain sensitive learning text: store it privately.
- Cloud learner saves and new public shares default to OFF unless `EXPLORER_CLOUD_SAVE_ENABLED=1`. Existing records remain accessible for private export and deletion even while OFF.
- External LLM-based Explorer coaching defaults OFF unless `EXPLORER_AI_FEEDBACK_ENABLED=1`; helps avoid unexpected API charges and external transfer of child submissions.
- Previously added server checkpoints remain OFF unless `DISCOVERY_CHECKPOINTS_ENABLED=1`; they have no verified identity/certificate semantics.

## Phase 7: reproducible real-MySQL CI verification

A separate GitHub Actions job now boots an isolated **MySQL 8.0** service with an ephemeral `aifs_ci` database and no network path to production. It executes `server/auth.mysql.integration.test.ts` and `server/guardian.mysql.integration.test.ts` using the repository's actual database functions, not mocked responses.

Covered behavior:
- Competing OTP reservations for the same email key accept only one within cooldown.
- Parallel verification of the same correct OTP consumes it once; replay fails.
- Twelve parallel incorrect attempts cannot increment above five or unlock the correct OTP.
- Expiry, cancellation, cooldown renewal, and stale-cookie rejection.
- Exporting saved Explorer records is strictly scoped to account ID; another account's private answers must not leak.
- Deleting a profile as the wrong account leaves it intact. Authorized deletion cascades through its attempts and public share-token rows.

**Limitations:** The CI schema fixtures model the relevant existing MySQL tables; CI does not prove Hostinger DB schema compatibility, app-level cookie/proxy behavior, email provider deliverability, verified parental consent, or certificate eligibility. Production remains untouched. All tests contain an explicit `aifs_ci` database-name guard and are disabled in normal `pnpm test` runs.

## Release-blocking steps

1. **Database backup** and staging database first. Review/apply `ops/auth-email-otp-hardening.sql`; it creates `authEmailChallenges`. The feature's TypeScript schema alone does **not** create a MySQL table. The previously documented `ops/discovery-checkpoint-preview.sql` is separate and optional; leave its flag OFF.
2. Use an independently generated **JWT_SECRET of at least 32 random characters**, identical on all running Node processes. Safeguard and rotate it with a planned invalidation process; never use the CI dummy secret in production.
3. Set `PUBLIC_SITE_ORIGIN` to the actual HTTPS public origin if app/Hostinger proxy Host differs from browser origin. Validate OAuth redirect and same-origin tRPC calls on staging. Do not use this flag to permit unrelated origins.
4. Keep `EXPLORER_CLOUD_SAVE_ENABLED=0`, `EXPLORER_AI_FEEDBACK_ENABLED=0`, `DISCOVERY_CHECKPOINTS_ENABLED=0` until separate security/legal/educational reviews permit otherwise.
5. Test with **real MySQL**, including 5 wrong guesses, one-time consume/replay, two concurrent resends, multiple Node processes, DB disconnect, malformed cookies, expired records and duplicate requests. Unit mocks/TypeScript/build alone do not prove DB atomic behavior.
6. Run `pnpm check`, `pnpm test`, `pnpm build` in CI and smoke-test OTP email delivery and browser cookies on the final Hostinger HTTPS domain. A real-mail credential test must never run in public CI.
7. Ensure reverse-proxy protections, abuse-limits per trusted originating IP, email provider quotas, safe logging, support/appeal flow and a session-revocation strategy before accepting payments. Current database throttle is **per email only**; distributed abuse using many emails remains a risk. Logout clears the cookie but does not revoke a copied JWT before expiry.
8. Existing OAuth state handling and legacy cookies need a separate compatibility review. SameSite=Lax allows normal top-level GET OAuth redirects but deployments with cross-site embedded clients may need a safe alternative architecture.
9. Set a periodic retention cleanup using Hostinger cron or an equivalent controlled maintenance process. Suggested SQL for stale OTP records: `DELETE FROM authEmailChallenges WHERE expiresAt < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY);` Adjust retention after legal review. Avoid recurring workers on shared hosting.
10. Verify authorized parent/guardian consent and age handling legally before storing identifiable learner records. Email-OTP or a checked box does **not** verify someone is an adult or legally empowered guardian. Do not enable premium certificates based only on this data.
11. Coordinate manual SQL with Drizzle's migration journal before later `pnpm db:push` runs to avoid duplicate-table migrations. Never run migrations on a live DB without backup and review.

## Not yet implemented
- Verified guardian identity or legally complete consent lifecycle.
- Full CSRF protection when browser Origin is omitted, including support for subdomain boundaries.
- Global per-IP or account abuse defense, session revocation/rotation and comprehensive live security testing.
- Cryptographically trusted, learner-identity-verified certificates.
- A paid product, UPI checkout, Telegram verification or production database migrations.

**This is security groundwork and private account controls, not approval to launch or collect children's data.**

## Phase 11: canonical origin / CSRF defense-in-depth (separate review branch)

- The site owner has reported the earlier feature branch deployed and the database/OTP smoke flow working. **This new patch is on a separate branch** and is NOT automatically proof of deployment or live safety.
- Required Hostinger setting: `PUBLIC_SITE_ORIGIN=https://aiforstudents.in` (or the actual HTTPS canonical origin in that environment). Do not add a trailing path or unrelated host. Preview apps must use their own isolated `PUBLIC_SITE_ORIGIN`; a copied production value must not be used to enable OTP/accounts on a preview origin.
- In production, API calls fail closed if PUBLIC_SITE_ORIGIN is absent or invalid. A browser must use exactly that origin, even if a hostile request supplies matching `Host` / `X-Forwarded-Host` headers.
- Browser-origin requests with `Sec-Fetch-Site` equal to `same-site`, `cross-site` or `none` are blocked on tRPC. No Origin + unsafe HTTP method is blocked unless Fetch Metadata explicitly says `same-origin`, or a caller intentionally supplies a Bearer token (non-browser API clients). Normal browser POSTs supply an Origin and/or Fetch Metadata.
- OAuth GET callback routes are outside tRPC and remain separate. Validate OTP login, guardian export/delete, and mobile/older-browser functionality on an **isolated staging deployment** before promotion.
- Remaining limitations: untrusted client-side headers are not authentication; a stolen session/bearer credential remains valid until expiry; legacy/no Fetch Metadata GET requests may still reach read-only APIs; allowlisting GET queries does not mean server-side permissions can be relaxed. Do not enable minor cloud data or paid/verified programs based only on this guard.

## Phase 11 implementation: revocable sessions and abuse controls

The code now includes two optional, **default-disabled** controls, separate from the existing Phase 11 strict origin guard. Do not switch them on before applying and reviewing `ops/auth-session-abuse-hardening.sql` on a disposable, isolated staging database.

| Flag | Default | When `1` | Before enabling |
|---|---|---|---|
| `AUTH_SESSIONS_ENFORCED` | unset / `0` | New OTP/OAuth JWT sessions store SHA-256 token digest + owner + expiry in MySQL. Every authenticated account request requires active DB record. Logout marks the token revoked; account deletion cascades. | Create `authSessions`; verify HTTPS login, logout, new login, cross-browser expiry and rollback. **Existing untracked sessions will require sign-in again.** |
| `AUTH_ABUSE_DB_ENABLED` | unset / `0` | Atomic per-peer MySQL budgets: OTP requests 12 per 15 min, OTP checks 50 per 15 min, contact 5 per hour. Stores only HMAC pseudonymous bucket identifiers. | Create `authRequestBuckets`; verify Hostinger TCP peer represents independent clients and not one shared reverse proxy. If it does represent a shared proxy, **DO NOT ENABLE** until trusted-client-IP resolution is engineered and tested. |

Enforcement performs a real MySQL lookup per authenticated request (latency/cost); this is intentional to make cross-worker revocation effective without a stale in-process cache. If MySQL fails while enforcement is enabled, authenticated requests fail closed. The default-off deployment **does not have server-enforced JWT revocation**. This release should not be described as fully hardened until the flags, schema, proxy behavior and staging tests are reviewed.

All session checks use SHA-256 of the signed token (no plaintext JWT table fields). Contact and OTP budget keys use HMAC-SHA256 with `JWT_SECRET` and never store plaintext email or client IP. The TCP peer address is NOT automatically the real client IP behind Hostinger. No `X-Forwarded-For` trust is enabled. Limits are fixed-window, not a network-wide bot-detection guarantee, and NAT/shared-IP users may be affected.

The new migration does not create new users, collect student identity, change existing seven tables or migrate the Drizzle journal automatically. Reconcile with Drizzle migration history and back up first. For an isolated staging database, apply the SQL in phpMyAdmin, check table structure and indexes, then turn on one flag at a time. Do NOT import the migration blindly into live production.

Suggested **manually reviewed** maintenance SQL for the separate security tables:

```sql
DELETE FROM authSessions WHERE expiresAt < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY);
DELETE FROM authRequestBuckets WHERE expiresAt < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY);
```

No scheduled job was created. Set cleanup ownership and a data-retention policy before promotion.

### Remaining security work and limitations

- Per-IP HTTP abuse budgets remain optional until proxy topology is validated. They do not replace account/email limits, WAF, provider quotas or automated abuse monitoring.
- Stateless JWTs issued before enforcement become untracked and cannot authenticate with the flag on; this is an intentional re-login migration. If flag is off, logging out clears the browser cookie but cannot invalidate a copied JWT.
- Same-origin and Fetch Metadata are CSRF defense-in-depth; they do not protect against XSS, an already stolen Bearer credential, unsafe GET endpoints, malicious browser extensions or all older clients. Session and OAuth integration require staging review.
- Parent self-attestation is not verified adult identity, legal parental consent or independent educational assessment. Cloud child-data and certificate flags remain OFF.
- Use `ops/release-readiness-phase11.md` as the updated evidence/checklist authority.

## Privileged storage proxy route audit (Phase 11)

The original public GET `/manus-storage/*` path used a server-only Forge storage API key to generate a signed redirect for **any caller-supplied key**. This was an excessive public capability. It is now default OFF and, if explicitly enabled with `MANUS_STORAGE_PROXY_ENABLED=1`, accepts only a strict, operator-selected `MANUS_STORAGE_PUBLIC_PREFIX` such as `public/`. Requests outside that prefix or containing traversal/encoded key separators fail before contacting the backend. No front-end references to this proxy were found in the available GitHub code search, but the actual Hostinger asset usage must still be manually checked before release.

Never enable the proxy for private learner evidence, guardian exports, upload buckets or access-controlled resources. A *public prefix* requires separate storage-side access-policy verification; it is not authenticated storage access. Staging should verify whether disabling it breaks any existing publicly required assets and should keep it off otherwise.

## Phase 13 API and startup guardrails

- Cache of private API responses disabled at the Express `/api` boundary, MIME sniffing disabled, and generic JSON/urlencoded bodies capped at 512 KB / 64 KB instead of the previous 50 MB allocation. Default-off public learner share-token reads now also return FORBIDDEN, including older links while learner cloud-saving is disabled.
- The production server refuses to boot with a missing/weak JWT signing secret or an invalid/non-HTTPS `PUBLIC_SITE_ORIGIN`. An explicit CI-only loopback exception exists solely for compiled-app smoke tests.
- An unconfigured external OAuth callback now returns HTTP 404 by default (`MANUS_OAUTH_SERVER_ENABLED` must be explicitly `1` and provider/app credentials valid). This is independent of frontend OAuth display flags; local email OTP needs neither.
- Standalone staging helpers use HTTPS read-only public GETs and MySQL INFORMATION_SCHEMA SELECTs. They require a distinct staging origin and staging DB name and username baseline. They don't mutate records, issue OTP, reveal values or validate real user sessions.
- Automated contracts protect all the above. Manual Hostinger staging deployment, real browser behavior, proxy IP review, privacy and legal/safeguarding sign-off remain **unverified release blockers**, not completed functionality.
