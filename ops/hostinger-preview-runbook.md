# Phase 8 — Hostinger preview and staging rollout

**STATUS (2026-11-08):** The owner reports a separate feature-branch live deployment with imported database tables and working health/OTP/Adventure flows. This was not independently audited. Phase 11 is on separate Draft PR #2 and MUST NOT be treated as deployed. No verified guardian certificate exists.

## Important: preview is not necessarily a separate database

Hostinger's October 2026 Node.js PR-preview feature builds a separate preview website at a temporary hostingersite.com URL. The Hostinger bot comments with a preview link and the commit it serves. This does not establish that database credentials, mail tokens, cookies or environment variables are isolated from production. Check before any authenticated use.

Never use an unverified PR preview with children's identities, OTPs, account writes, payments or certificates.

## Safe guest-only preview

1. Keep main branch and live deployment unchanged. Leave PR #1 Draft. Compare the current Hostinger bot preview commit with the current PR head; it updates on pushes.
2. Use Hostinger's Node.js 22 runtime and pnpm 11.24.0; build command: pnpm build; compiled entry: dist/index.js. The server listens to PORT exactly in production, rather than silently changing ports.
3. Inspect preview environment settings through the Hostinger dashboard. Do not assume per-PR environment isolation. If previews inherit production credentials and cannot be isolated, DO NOT log in or make database requests. Instead create a separate staging app/site with independent configuration.
4. A safe *guest-only* preview has no database configuration (DATABASE_URL, DATABASE_*, DB_*, MYSQL_*), no HOSTINGER_MAIL_API_TOKEN, and all three flags disabled: EXPLORER_CLOUD_SAVE_ENABLED=0, EXPLORER_AI_FEEDBACK_ENABLED=0 and DISCOVERY_CHECKPOINTS_ENABLED=0.
5. When preview-specific config is possible, define DEPLOY_TARGET=preview, PREVIEW_DATA_MODE=guest-only, PUBLIC_SITE_ORIGIN and PREVIEW_PUBLIC_ORIGIN to the *preview* HTTPS origin, and PRODUCTION_PUBLIC_ORIGIN to the real production HTTPS origin.
6. Run the **read-only**, secret-safe audit in an environment containing only the preview's settings: node ops/check-preview.mjs. It prints only policy labels, not values or credentials. It makes no network calls and does not verify Hostinger settings itself.
7. Browser-smoke-test only: /healthz, /, /explorer/adventure, /guardian, /explorer/checkpoint and the public status query /api/trpc/discoveryCheckpoint.status. Verify mobile layouts, Hindi/Hinglish, keyboard focus and console errors. Do not enter an email address on guest-only preview.

## Separate MySQL staging — only after isolation

- Hostinger recommends 127.0.0.1 for Node.js-to-MySQL; use a NEW database and a different least-privilege MySQL user, NOT the production DB/user. Use independently generated staging JWT secret and staging-only mail credentials.
- To check a separately configured preview, set PREVIEW_DATA_MODE=separate-db, PRODUCTION_DATABASE_NAME and PRODUCTION_DATABASE_USER for comparison, PREVIEW_TEST_MAIL_ONLY=yes, and preview's dedicated DATABASE_URL / split DB settings. Run node ops/check-preview.mjs. It compares the supplied names, but cannot independently prove MySQL privileges.
- Backup the isolated staging DB. Apply ops/auth-email-otp-hardening.sql there using approved database management only after reviewing compatibility and reconciling with Drizzle migration journal. DO NOT apply to production in this phase.
- Test real OTP email delivery to an adult-controlled test mailbox, cooldown, wrong attempts, one-time use, expired code, cookie attributes behind HTTPS proxy, and private account deletion. Keep all child-cloud-data flags OFF.
- CI's integration tests are deliberately destructive and restricted to *aifs_ci* on localhost; do NOT run these CI scripts on Hostinger staging or production.

## Automated validation now in this PR

- TypeScript, unit tests and production asset build.
- Compiled Express smoke: exact PORT bind, /healthz, React route fallback, default-off checkpoint status and Origin rejection (no email or database).
- Pure preview-safety configuration tests: separate HTTPS origin, database-name/user isolation checks and secret-safe output.
- Isolated MySQL 8.0 CI service: OTP races/replay/cooldown and account-owned data isolation and cascading deletion.

## Blocking prerequisites before deployment

- [ ] Confirm actual PR preview version, health and environment isolation in Hostinger.
- [ ] Confirm separate staging DB/user; backup and migration review.
- [ ] Test Hostinger HTTPS proxy/cookies and real email OTP in staging.
- [ ] Obtain appropriate guardian-consent/security/legal review before child records.
- [ ] Complete manual mobile, accessibility and multilingual education QA.
- [ ] Review rate limits, revokeable sessions, retention, and deployment rollback.
- [ ] Keep the PR Draft until these gates are addressed.

## Official Hostinger references

- PR previews: https://www.hostinger.com/support/how-to-use-pull-request-previews-for-node-js-websites-in-hostinger/
- Node.js app settings: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Environment variables: https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/
- MySQL on Node.js: https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/

This document does not authorize a production deployment, expose child data, issue a certificate or charge customers.

## Phase 11 isolated staging checklist

1. Keep the live feature branch unchanged. Stage `feature/phase11-origin-guardian-guard-20261108` in a separate Node.js app with distinct database/user, JWT secret, mail test account and HTTPS hostname. A PR preview URL alone does **not** prove isolation.
2. Confirm `PUBLIC_SITE_ORIGIN` equals that staging hostname (not the live domain). If missing or malformed, production-mode tRPC deliberately returns 403.
3. Back up the staging database, reconcile Drizzle migration history, and import `ops/auth-session-abuse-hardening.sql` only there; check that `authSessions` and `authRequestBuckets` exist.
4. Turn on `AUTH_SESSIONS_ENFORCED=1`; test a **new** adult test-account login. Older issued JWT cookies won't be in the ledger. Test authorization after login, logout, stale JWT denial, a second browser/session, expired token and guardian export/delete. Turn off the flag if issues occur, but remember that disabling it restores stateless legacy JWT acceptance.
5. **Before turning on `AUTH_ABUSE_DB_ENABLED=1`**, verify the TCP peer address seen by Node is not a shared Hostinger proxy for all visitors; inspect only masked/anonymized diagnostic output. No diagnostic collecting raw visitor IP has been built. If it is shared, leave OFF and plan a properly configured trusted-proxy/WAF rate limiter. Check user fairness across NATs/schools.
6. With staging limits ON (only if network topology is safe), test OTP/verify/contact rate thresholds, time-window rollover, provider rejection, app restarts and multi-worker behavior. Monitor availability and legitimate user lockouts. All test emails must be adult-controlled.
7. Confirm mobile, accessibility, languages, public routes, cookies and print. Restore test accounts/data by approved procedures; never run CI destructive tests on Hostinger.
8. Record actual observed outcomes and Hostinger served commit in `ops/release-readiness-phase11.md`; request a security and privacy review before any production promotion.

No new production ENV is required until the above migration and validation have been completed. Default-off learner data and AI flags stay `0`.

## Phase 12 read-only staging configuration preflight

In the **isolated staging** environment only, set the following non-secret control keys before running `node ops/check-phase11-staging.mjs`: `DEPLOY_TARGET=staging`, `STAGING_DATA_MODE=isolated-db`, `STAGING_PUBLIC_ORIGIN`, `PRODUCTION_PUBLIC_ORIGIN`, `PUBLIC_SITE_ORIGIN`, `PRODUCTION_DATABASE_NAME`, `PRODUCTION_DATABASE_USER` and `STAGING_TEST_MAIL_ONLY=yes`. The checker also requires staging JWT/mail and staging DB connection fields to exist; it reports only fixed codes, **never secret values**. It does not connect to Hostinger, send an email, open MySQL or prove separation.

After independently reviewing/importing the security schema on **staging only**, the operator can set `STAGING_SECURITY_SCHEMA_REVIEWED=yes` and `STAGING_SECURITY_SCHEMA_APPLIED=yes` as explicit self-attestations when either new DB security flag is enabled. Enabling the peer-IP abuse limiter also requires `STAGING_PEER_IP_ISOLATED=yes` **after** independently observing proxy topology. All acknowledgements are operator assertions; they are not substitute evidence. Keep default-off flags until actual tests show success.

Unconfigured external Manus OAuth is hidden by default. To expose it again intentionally, set `VITE_MANUS_OAUTH_ENABLED=1`, `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL` (HTTPS) at build time and configure approved server `OAUTH_SERVER_URL`. The original email OTP path requires none of these.

## Phase 13 staging operator sequence — no production writes

The commands below are **optional actions on your own isolated staging environment**. They must never be run with live production credentials or a production hostname. The assistant has not executed them on Hostinger. The production feature branch remains separate from Draft PR #2.

1. Create an isolated Hostinger Node.js staging app on a different HTTPS hostname, with an independent database **and DB username**, secret, and test-only mail configuration; record only non-secret identifiers. Back up the isolated database and verify it is not the production database.
2. Configure `DEPLOY_TARGET=staging`, `STAGING_DATA_MODE=isolated-db`, `STAGING_PUBLIC_ORIGIN=https://<your-stage-domain>`, `PRODUCTION_PUBLIC_ORIGIN=https://aiforstudents.in`, and `PUBLIC_SITE_ORIGIN` equal to the staging origin. Set `PRODUCTION_DATABASE_NAME` and `PRODUCTION_DATABASE_USER` to the *names* from production for comparison, not credentials. Never paste secrets into chat or Git.
3. Ensure staging environment holds its own MySQL variables, unique `JWT_SECRET`, Hostinger mail test token/sender, and `STAGING_TEST_MAIL_ONLY=yes`. Keep `EXPLORER_CLOUD_SAVE_ENABLED=0`, `EXPLORER_AI_FEEDBACK_ENABLED=0`, `DISCOVERY_CHECKPOINTS_ENABLED=0`, `MANUS_STORAGE_PROXY_ENABLED=0`, `MANUS_OAUTH_SERVER_ENABLED=0`, `AUTH_SESSIONS_ENFORCED=0`, `AUTH_ABUSE_DB_ENABLED=0`.
4. From the app directory on staging run: `node ops/check-phase11-staging.mjs`. It is **read-only/static**, printing only policy names, and cannot independently prove asserted isolation.
5. After inspecting the seven base tables, back up and import `ops/auth-session-abuse-hardening.sql` into the **staging** MySQL DB only. Then run `node ops/check-phase11-schema.mjs`. It uses SELECT-only INFORMATION_SCHEMA queries and exits nonzero if columns, primary keys, the cascade FK or isolated DB-name/user declarations are wrong. A pass does not verify other core tables.
6. Deploy the exact Draft PR #2 commit to staging only, with the staging origin and Node 22. Run `node ops/check-phase11-stage-http.mjs` from an environment with internet access. It makes public **GET requests only** (no credentials or OTP), verifies response headers and negative origin/share checks, and refuses to probe if staging origin equals the production origin. It cannot prove which commit is actually served.
7. Review the **actual** staging runtime logs (mask secrets), then enable `AUTH_SESSIONS_ENFORCED=1` only there, restart the app and create a fresh adult-test OTP session. Confirm logout invalidates that session in another tab, old sessions require re-login, account privacy/deletion remains correct, and DB-unavailable behavior is safe. Do not store raw tokens in the tracker.
8. Independently verify real remote TCP peers across distinct clients behind Hostinger, without publishing addresses. Leave `AUTH_ABUSE_DB_ENABLED=0` if multiple clients share a reverse-proxy address. Only enable it on staging if differentiation and school/NAT fairness are demonstrated. Test rate windows without real learner records.
9. Manual keyboard, 320-pixel mobile, Hindi/Hinglish, 9+3 learning tasks, A4 print, test-only email quota, abuse monitoring, storage public-prefix dependencies and safeguarding review remain separate acceptance gates.
10. Record redacted evidence in `ops/release-readiness-phase11.md`, including *time, staging commit, redacted PASS/BLOCK codes, tester, rollback owner and explicit security/privacy approval*. Obtain sign-off before any merge or production release.

**New startup rule:** a production-mode Node process requires a strong `JWT_SECRET` (32+ characters) and canonical HTTPS `PUBLIC_SITE_ORIGIN`. CI's HTTP loopback test exception is not for Hostinger. If the new production app fails startup, check these two settings in the protected hPanel without sharing their values. No schema importer is executed automatically.

## Phase 14 visible-product staging acceptance

Once a **separate real staging app** is available, test homepage Start Free Adventure → `/explorer/adventure` → `/my-journey` → `/for-parents`, including all three age groups, Hindi/Hinglish, the 9/9 challenge gate, 3/3 transfer, private report, family-plan print and local-delete behavior. Check 320 px Android and keyboard controls. The live site has not received these changes.

New adult newsletter is default OFF. In staging ONLY, after consent review, import `ops/phase14-adult-newsletter.sql` (one additional table; not in the old seven-core-table import). Validate actual test email confirmation and unsubscribe with adult-controlled accounts, and check shared reverse-proxy IP behavior before setting `AUTH_ABUSE_DB_ENABLED=1` or `NEWSLETTER_SIGNUP_ENABLED=1`. Do not run newsletter campaigns/collect child emails. Full Phase 14 product checklist is `ops/phase14-visible-product-completion.md`.
