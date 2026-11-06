# Phase 8 — Hostinger preview and staging rollout

**STATUS:** Draft PR only. No production database migration or verified guardian certificate has been implemented.

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
