# Phase 6: authentication hardening and guardian-managed records — rollout checklist

**Status: Draft implementation. NOT deployed.** These changes cannot safely be released before the manual MySQL schema is installed and tested. No legally verified guardian consent or identity authentication has been implemented.

## Security changes in this branch

- Email OTP: new opaque 32-byte random cookie identifier; key-separated HMAC-SHA256 of normalized email and six-digit code stored in MySQL. No plaintext OTP/email in the challenge table or cookie.
- Enforced globally across shared-hosting workers by MySQL: one active challenge per hashed email, 60-second resend cooldown, 10-minute TTL, maximum five incorrect verification attempts, atomic one-time successful consumption and rejection of replay. Failed mail delivery cancels the reserved challenge when possible.
- Cookie policy: first-party HTTP-only SameSite=Lax; Secure forced in production; avoids trusting arbitrary X-Forwarded-Proto headers. Newly issued email and OAuth sessions expire after 30 days instead of one year.
- API browser requests carrying foreign Origin headers are denied before tRPC. An absent Origin and same-site subdomains require additional deployment-level review. This guard is not a complete CSRF solution by itself.
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
