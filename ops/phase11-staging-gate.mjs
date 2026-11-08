/**
 * Phase 11 staging configuration preflight: pure/read-only.
 * No network, MySQL, mail, credentials output or Hostinger account mutation.
 * Positive acknowledgement values record operator assertions, NOT verified facts.
 */
const isYes = (value) => value === "yes";
function siteOrigin(value) {
  try {
    const uri = new URL(value);
    if (uri.protocol !== "https:" || uri.pathname !== "/" || uri.search || uri.hash
      || uri.username || uri.password) return null;
    return uri.origin;
  } catch { return null; }
}
function mysqlConfig(env) {
  if (env.DATABASE_URL) {
    try {
      const uri = new URL(env.DATABASE_URL);
      if (uri.protocol !== "mysql:" || !uri.hostname || !uri.username) return null;
      const name = decodeURIComponent(uri.pathname.slice(1));
      const user = decodeURIComponent(uri.username);
      return name && user ? { name, user } : null;
    } catch { return null; }
  }
  return env.DATABASE_HOST && env.DATABASE_USER && env.DATABASE_PASSWORD && env.DATABASE_NAME
    ? { name: env.DATABASE_NAME, user: env.DATABASE_USER } : null;
}

/** Returns only fixed policy identifiers. Never returns input values. */
export function evaluatePhase11Staging(env) {
  const issues = [];
  const add = (code, problem) => { if (problem) issues.push(code); };
  add("TARGET_NOT_STAGING", env.DEPLOY_TARGET !== "staging");
  const staging = siteOrigin(env.STAGING_PUBLIC_ORIGIN);
  const production = siteOrigin(env.PRODUCTION_PUBLIC_ORIGIN);
  const canonical = siteOrigin(env.PUBLIC_SITE_ORIGIN);
  add("STAGING_HTTPS_ORIGIN_INVALID", !staging);
  add("PRODUCTION_HTTPS_ORIGIN_INVALID", !production);
  add("PUBLIC_SITE_ORIGIN_INVALID", !canonical);
  add("ORIGINS_NOT_SEPARATE", Boolean(staging && production && staging === production));
  add("PUBLIC_ORIGIN_NOT_STAGING", Boolean(staging && canonical && staging !== canonical));
  add("STAGING_DB_MODE_REQUIRED", env.STAGING_DATA_MODE !== "isolated-db");
  const db = mysqlConfig(env);
  add("STAGING_DB_MISSING", !db);
  add("PRODUCTION_DB_BASELINE_MISSING", !env.PRODUCTION_DATABASE_NAME || !env.PRODUCTION_DATABASE_USER);
  add("DATABASE_NAME_NOT_ISOLATED", Boolean(db && env.PRODUCTION_DATABASE_NAME && db.name === env.PRODUCTION_DATABASE_NAME));
  add("DATABASE_USER_NOT_ISOLATED", Boolean(db && env.PRODUCTION_DATABASE_USER && db.user === env.PRODUCTION_DATABASE_USER));
  add("JWT_SECRET_TOO_SHORT", !env.JWT_SECRET || env.JWT_SECRET.length < 32);
  add("STAGING_TEST_MAIL_REQUIRED", !isYes(env.STAGING_TEST_MAIL_ONLY));
  add("STAGING_MAIL_NOT_CONFIGURED", !env.HOSTINGER_MAIL_API_TOKEN || !env.AUTH_MAIL_FROM);
  for (const flag of ["EXPLORER_CLOUD_SAVE_ENABLED","EXPLORER_AI_FEEDBACK_ENABLED","DISCOVERY_CHECKPOINTS_ENABLED"]) {
    add("UNSAFE_CHILD_FLAG_" + flag, env[flag] === "1");
  }
  add("STORAGE_PROXY_NOT_DISABLED", env.MANUS_STORAGE_PROXY_ENABLED === "1");
  if (env.AUTH_SESSIONS_ENFORCED === "1" || env.AUTH_ABUSE_DB_ENABLED === "1") {
    add("SECURITY_SCHEMA_REVIEW_UNACKNOWLEDGED", !isYes(env.STAGING_SECURITY_SCHEMA_REVIEWED));
    add("SECURITY_SCHEMA_IMPORT_UNACKNOWLEDGED", !isYes(env.STAGING_SECURITY_SCHEMA_APPLIED));
  }
  if (env.AUTH_ABUSE_DB_ENABLED === "1") {
    add("PEER_IP_ISOLATION_UNACKNOWLEDGED", !isYes(env.STAGING_PEER_IP_ISOLATED));
  }
  if (env.VITE_MANUS_OAUTH_ENABLED === "1") {
    add("OPTIONAL_OAUTH_NOT_CONFIGURED", !env.OAUTH_SERVER_URL ||
      !env.VITE_OAUTH_PORTAL_URL || !env.VITE_APP_ID);
  }
  return { ok: issues.length === 0, issues };
}
