# Hostinger Environment Handoff

This document is a **name-only deployment handoff** for AI for Students. It intentionally contains no passwords, tokens, database URLs, OTP codes or private keys. Enter values only in Hostinger's protected environment-variable form; never commit them to GitHub or paste them into chat.

## Required server-side variables

| Variable | Purpose | Secret? | Hostinger action |
|---|---|---:|---|
| `DATABASE_URL` | MySQL connection string used by Drizzle and the server | Yes | Preferred form: build it from the Hostinger database host, database name, user and replacement password inside the protected form. |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | Optional split MySQL fields used when `DATABASE_URL` is not available in Hostinger’s Node.js form | Yes | Enter all five in the protected form; `DATABASE_PORT` defaults to `3306`. The runtime also accepts the shorter aliases `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`. Do not mix incomplete sets. |
| `JWT_SECRET` | Signs local authentication sessions and cookies | Yes | Generate a new long random value for this deployment; do not reuse the password or commit it. |
| `PUBLIC_SITE_ORIGIN` | Strict canonical origin for tRPC protection | No | Required for Phase 11 production operation. Set to the exact HTTPS site origin without a path; staging and production need their respective own values. |
| `AUTH_SESSIONS_ENFORCED` | Optional DB-verified, revocable session ledger | No | Keep `0` or unset until `authSessions` migration + staging login/logout test; then explicitly enable by approved rollout. Older sessions need re-login. |
| `AUTH_ABUSE_DB_ENABLED` | Optional MySQL-backed OTP/contact request budgets | No | Keep `0` or unset until `authRequestBuckets` migration and trusted client-IP/proxy topology validation. Shared reverse-proxy IPs may lock out visitors. |
| `MANUS_STORAGE_PROXY_ENABLED`, `MANUS_STORAGE_PUBLIC_PREFIX` | Public-only signed asset proxy (optional, potentially sensitive) | No | Keep disabled; only enable for a reviewed public asset prefix such as `public/`, never for learner/guardian files. |
| `HOSTINGER_MAIL_API_TOKEN` | Auth-code mail adapter credential | Yes | Paste the Hostinger Mail API token only in the protected form. |
| `AUTH_MAIL_FROM` | Sender address for local auth-code mail | No, but deployment-critical | Set to `auth@aiforstudents.in`. |
| `BUILT_IN_FORGE_API_URL` | Server-side built-in API endpoint used for supported integrations | Usually secret-backed | Copy the environment value supplied by the managed project configuration. |
| `BUILT_IN_FORGE_API_KEY` | Server-side built-in API authorization | Yes | Copy the environment value supplied by the managed project configuration. |
| `VITE_APP_ID` | OAuth application identifier | No | Set to the project OAuth application ID if Manus OAuth fallback is enabled. |
| `OAUTH_SERVER_URL` | OAuth callback/token service base URL | No | Set to the approved OAuth service base URL if fallback is enabled. |
| `OWNER_OPEN_ID` | Owner identity used by protected owner operations | No | Set only when the corresponding managed owner identity is available. |

## Required public build variables

| Variable | Purpose | Secret? | Hostinger action |
|---|---|---:|---|
| `VITE_OAUTH_PORTAL_URL` | Login portal URL used by the frontend OAuth fallback | No | Set to the approved login portal URL, or leave the OAuth fallback disabled if local OTP is the only production path. |
| `VITE_APP_TITLE` | Public website title | No | Set to `AI for Students` if the managed title is not injected automatically. |
| `VITE_APP_LOGO` | Public logo configuration | No | Set only to the approved logo value or URL; do not put binary files in environment text. |
| `VITE_ANALYTICS_ENDPOINT` | Optional analytics endpoint | No | Set only if analytics is intentionally enabled for the deployment. |
| `VITE_ANALYTICS_WEBSITE_ID` | Optional analytics website identifier | No | Set only when the analytics site identifier is confirmed. |

## Safe entry method

In Hostinger hPanel, open the Node.js Web App environment-variable section and create each key with its value there. The **Name** field must contain only `DATABASE_URL`; the **Value** field must contain only the connection URL. Do not paste the complete assignment `DATABASE_URL = mysql://...` into the Value field. The current runtime diagnostic treats that assignment form as compatible, but keeping the key and value separate is the correct hPanel configuration. For `DATABASE_URL`, do not place the database password in a repository file.
 Use the URL form accepted by the selected MySQL driver, for example `mysql://USER:PASSWORD@HOST:3306/DATABASE`, but replace every placeholder inside Hostinger and do not save the completed URL in this repository. If Hostinger provides only separate fields, use the complete `DATABASE_HOST`/`DATABASE_PORT`/`DATABASE_USER`/`DATABASE_PASSWORD`/`DATABASE_NAME` set instead; the server assembles the connection URL at runtime and never logs it. The runtime log may report `OAUTH_SERVER_URL is not configured`; that is expected if local OTP is the only login path, but Manus OAuth fallback requires the OAuth variables listed above.

The database password previously shared in chat must be replaced before deployment. The replacement belongs only in Hostinger's protected environment form. If the password contains URL-reserved characters, encode them according to the connection-string rules or use Hostinger's documented database-variable format; do not simplify a password merely to avoid encoding.

## Preflight before deployment

| Check | Pass condition |
|---|---|
| Build | `pnpm check`, `pnpm test` and `pnpm build` pass from the exact source commit. |
| Secret hygiene | No `.env` file, password, token, completed `DATABASE_URL` or OTP code is tracked by Git. |
| Mail sender | `AUTH_MAIL_FROM` is exactly `auth@aiforstudents.in`; the Hostinger token is present only in protected configuration. |
| Database | The selected Hostinger database exists, the replacement password works, and either `DATABASE_URL` or the complete split database set points to that database. |
| Session security | `JWT_SECRET` is unique to the deployment and is not derived from the database password. |
| Public configuration | All `VITE_*` values are non-secret and appropriate for the intended domain. |
| Runtime | The Node.js entrypoint and start command use the platform-provided port rather than a hard-coded port. |

## Blank database schema import

If phpMyAdmin shows **No tables found in database**, select the application database, open **Import**, choose the repository file `hostinger-schema-import.sql`, keep the SQL format selected, and run the import. Do not create individual tables manually and do not modify the SQL to add passwords or user rows. After import, the Structure tab should show **seven core tables**: `users`, `learningProgress`, `explorerProfiles`, `explorerAttempts`, `explorerShares`, `authEmailChallenges` and `discoveryCheckpoints`. For an existing populated database, DO NOT re-import this blank schema file; use reviewed incremental migrations only. The SQL file also includes the required foreign keys and unique indexes.

For a read-only verification in phpMyAdmin, run `SHOW TABLES;`, `SHOW COLUMNS FROM users;` and `SHOW CREATE TABLE users;`. The `users` table must contain `id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt` and `lastSignedIn`, with `id` as the primary key and `openId` unique. Do not run `DROP`, `TRUNCATE` or manual row inserts.

## Progress persistence behavior

General learning-game scores are kept in browser storage while a learner plays. When the learner signs in and opens the progress dashboard, the dashboard sends those score summaries through `learning.syncGuest` to the account-backed `learningProgress` table; login alone does not create a progress row. Explorer mission evidence is intentionally more private: it remains in the browser unless a parent or guardian creates an age-band profile and explicitly chooses **Sync completed evidence**. That action writes completed mission evidence to `explorerAttempts` for the selected profile. This separation is intentional and prevents guest evidence from being uploaded merely because an account exists.

## User-owned checks after configuration

The following cannot be truthfully marked complete from the sandbox: real HTTPS OTP delivery, guest-progress migration in a second browser/device, contact-form delivery on the live domain, Hostinger database connectivity, and the final staging smoke test. Run those only after the protected variables and domain are configured, then record pass/fail outcomes without copying secrets or private learner data.

## Phase 11 secure rollout: configuration is NOT evidence of deployment

Import `ops/auth-session-abuse-hardening.sql` only into a backed-up isolated staging DB first. Check tables `authSessions` and `authRequestBuckets`. Enabling `AUTH_SESSIONS_ENFORCED=1` requires existing visitors to sign in again, and will fail closed if DB/session ledger is missing. `AUTH_ABUSE_DB_ENABLED=1` requires proof that the Node TCP peer represents a sufficiently differentiated client population; Hostinger reverse proxies can make all requests appear to share one address. Never trust arbitrary `X-Forwarded-For` headers. The flags default OFF and should **not** be enabled directly in production.

Track the complete gate-by-gate verification and rollback decision in `ops/release-readiness-phase11.md`. Keeping `EXPLORER_CLOUD_SAVE_ENABLED`, `EXPLORER_AI_FEEDBACK_ENABLED`, and `DISCOVERY_CHECKPOINTS_ENABLED` at `0` remains required until independent safeguarding/privacy review.

## Phase 12 read-only staging preflight & optional OAuth

A safer **staging-only** config check is available: `node ops/check-phase11-staging.mjs`. It evaluates staging/production origin separation, distinct DB name/user, test-only mail declarations, default-OFF child-data/storage flags and prerequisites for opt-in session/abuse features. It does not connect to the DB or inspect any live Hostinger system, and prints only policy names. It does not independently verify declarations made by an operator. Set `DEPLOY_TARGET=staging`, `STAGING_PUBLIC_ORIGIN`, `PRODUCTION_PUBLIC_ORIGIN`, `STAGING_DATA_MODE=isolated-db`, `STAGING_TEST_MAIL_ONLY=yes` and the protected DB/mail credentials only inside the staging environment; `PRODUCTION_DATABASE_NAME` and `PRODUCTION_DATABASE_USER` are comparison identifiers, not passwords.

For OTP-only sites, leave `VITE_MANUS_OAUTH_ENABLED` unset or `0`; the UI will hide the unusable OAuth option. Only set it to `1` when `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID` (frontend build) and approved server `OAUTH_SERVER_URL` are fully configured and tested. No new variable is required for normal email OTP login.

## Phase 13 API safety, deployment-time gating and staging commands

- Production-mode startup now refuses to serve when `JWT_SECRET` is shorter than 32 characters or `PUBLIC_SITE_ORIGIN` is not the correct canonical HTTPS origin, with no path/query. The only HTTP exception is an explicit CI/test-only loopback and must **never** be configured in Hostinger.
- API response headers include `Cache-Control: private, no-store` to protect account exports and private learning records from intermediary caches. JSON/URL-encoded request bodies are capped at 512 KB / 64 KB. This app has no general file-upload endpoint on these parsers.
- `MANUS_OAUTH_SERVER_ENABLED` is a separate server-side opt-in that defaults OFF. It must be `1` only when a separately approved OAuth provider is configured; the frontend also requires `VITE_MANUS_OAUTH_ENABLED=1` plus `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` at build time. Local email OTP requires NONE of those OAuth variables.
- Public child share-token lookup is now denied when `EXPLORER_CLOUD_SAVE_ENABLED` is unset/`0`; previous share links intentionally stop working under that privacy boundary.
- The Stage Operator Preflight uses `DEPLOY_TARGET`, `STAGING_DATA_MODE`, `STAGING_PUBLIC_ORIGIN`, `PRODUCTION_PUBLIC_ORIGIN`, `PRODUCTION_DATABASE_NAME` and `PRODUCTION_DATABASE_USER`. These are comparison/verification identifiers for **staging**, not production settings; do not add them to a live application merely to satisfy a checklist.
- Safe commands: `node ops/check-phase11-staging.mjs` (static only), `node ops/check-phase11-schema.mjs` (SELECT-only against **staging** DB after reviewed migration), `node ops/check-phase11-stage-http.mjs` (public GETs against **staging** HTTPS only). Each exits nonzero on a detected gap and reports codes without displaying secrets. Neither proves a verified guardian, official certification, live git SHA, or production safety.

## Phase 14 visible product (code only — rollout postponed)

New pages `/my-journey`, `/for-parents`, homepage CTA and private report navigation **do not need additional ENV variables or migrations**. Discovery Adventure remains browser-local; existing login/cloud settings do not change.

The new adult email-note opt-in is **default disabled**. Do not enable it until an isolated staging environment has passed consent/privacy review and the `ops/phase14-adult-newsletter.sql` **additional table** is installed there. New optional flag:

| Variable | Purpose | Default / safety rule |
|---|---|---|
| `NEWSLETTER_SIGNUP_ENABLED` | Enables adult-only email confirmation and subscription management endpoints | **Unset / 0**. If `1`, production startup requires `AUTH_ABUSE_DB_ENABLED=1` plus configured MySQL and Hostinger Mail sender; do not enable on live before staging. |

Confirmation email needs existing `HOSTINGER_MAIL_API_TOKEN`, `AUTH_MAIL_FROM`, `JWT_SECRET` (at least 32 chars), and canonical HTTPS `PUBLIC_SITE_ORIGIN`. Adult email subscribers are stored in `newsletterSubscribers` only after a request and are **not active** until the recipient explicitly confirms. All replies/marketing require a separate human-controlled compliant sending process; no automated campaign has been configured. Existing personal child cloud-save flags must stay 0.

The new adult tester feedback form uses the **existing** `contact.submit`/Hostinger Mail API integration and does not need a new table. It collects only the explicitly submitted adult name, email, category, and message; the UI warns not to include child details.

**DO NOT** import `hostinger-schema-import.sql` into the already-populated production database. Do not add `NEWSLETTER_SIGNUP_ENABLED=1` just because the code is present. See `ops/phase14-visible-product-completion.md`.

## Phase 15 visual QA — no ENV changes

The new `ops/phase14-browser-qa.mjs` is a **CI-only** compiled-app Chromium test runner. It uses local `http://127.0.0.1:43179` and the explicit pair `CI=true`, `ALLOW_INSECURE_LOOPBACK_ORIGIN_FOR_CI=1` strictly in its *child test process*. **Never add these values to Hostinger staging or production**. No new production ENV variable, database table or email provider setting was needed for this QA phase.

QA evidence: https://github.com/sahilk267/hostinger-ai-for-students/actions/runs/42718752677 (`phase14-browser-qa`, 8 screenshots). More detail: `ops/phase15-browser-acceptance.md`. Real Hostinger staging and privacy/marketing approval remain prerequisites to any new rollout.
