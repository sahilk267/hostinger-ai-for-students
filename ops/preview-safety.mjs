/**
 * Non-invasive Hostinger pull-request preview safety preflight.
 * No network or database access. Never outputs credentials or URLs with secrets.
 * This is only a configuration audit; it cannot establish legal guardian consent.
 */
export function inspectPreviewSafety(env) {
  const issues = [];
  const warnings = [];
  const get = (key) => (env[key] ?? "").trim();
  const blank = (key) => !get(key);
  const enabled = (key) => get(key) === "1";
  const siteOrigin = (name) => {
    try {
      const url = new URL(get(name));
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
      return url.origin;
    } catch { return null; }
  };
  if (get("DEPLOY_TARGET") !== "preview") issues.push("DEPLOY_TARGET must be preview");
  const preview = siteOrigin("PREVIEW_PUBLIC_ORIGIN");
  const production = siteOrigin("PRODUCTION_PUBLIC_ORIGIN");
  const current = siteOrigin("PUBLIC_SITE_ORIGIN");
  if (!preview) issues.push("PREVIEW_PUBLIC_ORIGIN must be a bare HTTPS origin");
  if (!production) issues.push("PRODUCTION_PUBLIC_ORIGIN must be a bare HTTPS origin");
  if (!current || !preview || current !== preview) issues.push("PUBLIC_SITE_ORIGIN must match the preview HTTPS origin");
  if (preview && production && preview === production) issues.push("Preview origin must be different from the live website origin");

  for (const flag of ["EXPLORER_CLOUD_SAVE_ENABLED", "EXPLORER_AI_FEEDBACK_ENABLED", "DISCOVERY_CHECKPOINTS_ENABLED"]) {
    if (enabled(flag)) issues.push(flag + " must remain disabled");
  }
  if (!["guest-only", "separate-db"].includes(get("PREVIEW_DATA_MODE"))) {
    issues.push("PREVIEW_DATA_MODE must be guest-only or separate-db");
  }

  const dbKeys = [
    "DATABASE_URL", "DATABASE_HOST", "DB_HOST", "MYSQL_HOST",
    "DATABASE_NAME", "DB_NAME", "MYSQL_DATABASE", "DB_DATABASE",
    "DATABASE_USER", "DB_USER", "MYSQL_USER",
    "DATABASE_PASSWORD", "DB_PASSWORD", "MYSQL_PASSWORD",
  ];
  const dbFieldsPresent = dbKeys.some(key => !blank(key));
  if (get("PREVIEW_DATA_MODE") === "guest-only") {
    if (dbFieldsPresent) issues.push("Guest-only preview must not receive any database configuration");
    if (!blank("HOSTINGER_MAIL_API_TOKEN")) issues.push("Guest-only preview must not receive a live mail API token");
    warnings.push("Guest-only preview: login and server checkpoints intentionally cannot be tested");
  }
  if (get("PREVIEW_DATA_MODE") === "separate-db") {
    let dbName = "";
    let dbUser = "";
    if (!blank("DATABASE_URL")) {
      try {
        const parsed = new URL(get("DATABASE_URL"));
        if (parsed.protocol !== "mysql:" && parsed.protocol !== "mysql2:") throw Error("invalid");
        dbName = decodeURIComponent(parsed.pathname.slice(1));
        dbUser = decodeURIComponent(parsed.username);
      } catch { issues.push("DATABASE_URL must be a valid MySQL URL"); }
    } else {
      dbName = get("DATABASE_NAME") || get("DB_NAME") || get("MYSQL_DATABASE") || get("DB_DATABASE");
      dbUser = get("DATABASE_USER") || get("DB_USER") || get("MYSQL_USER");
    }
    const prodDb = get("PRODUCTION_DATABASE_NAME");
    const prodUser = get("PRODUCTION_DATABASE_USER");
    if (!dbName || !/(?:preview|staging|_stg)(?:_|$)/i.test(dbName)) issues.push("Preview must use an obviously separately named staging/preview database");
    if (!prodDb) issues.push("PRODUCTION_DATABASE_NAME is required to prove distinct database names");
    if (dbName && prodDb && dbName === prodDb) issues.push("Preview and production database names must differ");
    if (!dbUser || !prodUser) issues.push("Preview and production database usernames are required for comparison");
    if (dbUser && prodUser && dbUser === prodUser) issues.push("Preview database must use a distinct least-privilege database user");
    if (get("PREVIEW_TEST_MAIL_ONLY") !== "yes") issues.push("Preview requires explicit PREVIEW_TEST_MAIL_ONLY=yes before checking email login");
    warnings.push("Staging DB separation is based on supplied names, not remotely verified database privileges");
  }
  if (enabled("RUN_MYSQL_INTEGRATION")) issues.push("Do not run CI integration tests in a Hostinger preview");
  if (!blank("BUILT_IN_FORGE_API_KEY")) warnings.push("Avoid exposing production AI provider credentials to a preview");

  return { ok: issues.length === 0, issues, warnings };
}

export function printPreviewSafety(result) {
  const output = [result.ok ? "Preview configuration: PASS (static audit only)" : "Preview configuration: BLOCKED"];
  for (const issue of result.issues) output.push("BLOCK: " + issue);
  for (const warning of result.warnings) output.push("NOTE: " + warning);
  return output.join("\n");
}
