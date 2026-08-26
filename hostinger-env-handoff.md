# Hostinger Environment Handoff

This document is a **name-only deployment handoff** for AI for Students. It intentionally contains no passwords, tokens, database URLs, OTP codes or private keys. Enter values only in Hostinger's protected environment-variable form; never commit them to GitHub or paste them into chat.

## Required server-side variables

| Variable | Purpose | Secret? | Hostinger action |
|---|---|---:|---|
| `DATABASE_URL` | MySQL connection string used by Drizzle and the server | Yes | Preferred form: build it from the Hostinger database host, database name, user and replacement password inside the protected form. |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | Optional split MySQL fields used when `DATABASE_URL` is not available in Hostinger’s Node.js form | Yes | Enter all five in the protected form; `DATABASE_PORT` defaults to `3306`. The runtime also accepts the shorter aliases `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`. Do not mix incomplete sets. |
| `JWT_SECRET` | Signs local authentication sessions and cookies | Yes | Generate a new long random value for this deployment; do not reuse the password or commit it. |
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

## User-owned checks after configuration

The following cannot be truthfully marked complete from the sandbox: real HTTPS OTP delivery, guest-progress migration in a second browser/device, contact-form delivery on the live domain, Hostinger database connectivity, and the final staging smoke test. Run those only after the protected variables and domain are configured, then record pass/fail outcomes without copying secrets or private learner data.
