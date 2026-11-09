import { buildDatabaseUrl } from "./env";

/**
 * Production readiness, fail-closed without echoing any environment value.
 * The only HTTP exception is explicit CI testing on a loopback address.
 * This does not authenticate a database, verify Hostinger proxy topology,
 * replace GDPR/DPDP consent review or prove a deployment is secure.
 */
export function validateProductionSecurityConfig(env: NodeJS.ProcessEnv): string[] {
  if (env.NODE_ENV !== "production") return [];
  const errors: string[] = [];

  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
    errors.push("JWT_SECRET_MISSING_OR_WEAK");
  }

  let publicOriginValid = false;
  try {
    const raw = env.PUBLIC_SITE_ORIGIN ?? "";
    const parsed = new URL(raw);
    const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(parsed.hostname);
    const ciLoopback = env.CI === "true"
      && env.ALLOW_INSECURE_LOOPBACK_ORIGIN_FOR_CI === "1" && loopback;
    publicOriginValid = (
      (parsed.protocol === "https:" || (parsed.protocol === "http:" && ciLoopback))
      && !parsed.username && !parsed.password && parsed.pathname === "/"
      && !parsed.search && !parsed.hash
      && (raw === parsed.origin || raw === parsed.origin + "/")
    );
  } catch { /* missing/invalid public origin */ }
  if (!publicOriginValid) errors.push("PUBLIC_SITE_ORIGIN_INVALID");

  if ((env.AUTH_SESSIONS_ENFORCED === "1" || env.AUTH_ABUSE_DB_ENABLED === "1")
      && !buildDatabaseUrl(env)) {
    errors.push("SECURITY_DATABASE_CONFIG_MISSING");
  }

  if (env.NEWSLETTER_SIGNUP_ENABLED === "1") {
    // Adult marketing opt-in is disabled unless verified schema and shared-worker
    // request budgets are both intentionally rolled out.
    if (env.AUTH_ABUSE_DB_ENABLED !== "1" || !buildDatabaseUrl(env)) {
      errors.push("NEWSLETTER_SECURITY_DATABASE_REQUIRED");
    }
    if (!env.HOSTINGER_MAIL_API_TOKEN || !env.AUTH_MAIL_FROM) {
      errors.push("NEWSLETTER_CONFIRMATION_MAIL_MISSING");
    }
  }

  if (env.MANUS_OAUTH_SERVER_ENABLED === "1") {
    let serverValid = false;
    try {
      const raw = env.OAUTH_SERVER_URL ?? "";
      const url = new URL(raw);
      serverValid = url.protocol === "https:" && !url.username && !url.password;
    } catch { /* absent provider URL */ }
    if (!serverValid || !env.VITE_APP_ID) errors.push("OPTIONAL_OAUTH_PROVIDER_INVALID");
  }

  if (env.MANUS_STORAGE_PROXY_ENABLED === "1") {
    const prefix = env.MANUS_STORAGE_PUBLIC_PREFIX ?? "";
    if (!/^[A-Za-z0-9][A-Za-z0-9/_-]{1,127}\/$/.test(prefix)) {
      errors.push("STORAGE_PUBLIC_PREFIX_INVALID");
    }
    if (!env.BUILT_IN_FORGE_API_URL || !env.BUILT_IN_FORGE_API_KEY) {
      errors.push("STORAGE_PROVIDER_NOT_CONFIGURED");
    }
  }
  return errors;
}
