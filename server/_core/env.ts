function isUsableDatabaseUrl(value: string) {
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "mysql:" || parsed.protocol === "mysql2:") && Boolean(parsed.hostname) && parsed.pathname.length > 1;
  } catch {
    return false;
  }
}

const firstTrimmed = (env: Record<string, string | undefined>, keys: string[]) => {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) return { key, value };
  }
  return undefined;
};

export function describeDatabaseConfig(env: Record<string, string | undefined>) {
  const explicit = env.DATABASE_URL?.trim();
  if (explicit) return { source: "DATABASE_URL", valid: isUsableDatabaseUrl(explicit), presentKeys: ["DATABASE_URL"] };

  const fields = {
    host: firstTrimmed(env, ["DATABASE_HOST", "DB_HOST", "MYSQL_HOST"]),
    port: firstTrimmed(env, ["DATABASE_PORT", "DB_PORT", "MYSQL_PORT"]),
    user: firstTrimmed(env, ["DATABASE_USER", "DB_USER", "MYSQL_USER"]),
    password: firstTrimmed(env, ["DATABASE_PASSWORD", "DB_PASSWORD", "MYSQL_PASSWORD"]),
    name: firstTrimmed(env, ["DATABASE_NAME", "DB_NAME", "MYSQL_DATABASE", "DB_DATABASE"]),
  };
  const presentKeys = Object.values(fields).filter(Boolean).map((field) => field!.key);
  const valid = Boolean(fields.host && fields.user && fields.password && fields.name);
  return { source: valid ? "split" : "missing-or-incomplete", valid, presentKeys };
}

export function buildDatabaseUrl(env: Record<string, string | undefined>) {
  const explicit = env.DATABASE_URL?.trim();
  if (explicit && isUsableDatabaseUrl(explicit)) return explicit;

  const host = firstTrimmed(env, ["DATABASE_HOST", "DB_HOST", "MYSQL_HOST"])?.value;
  const port = (firstTrimmed(env, ["DATABASE_PORT", "DB_PORT", "MYSQL_PORT"])?.value ?? "3306").trim();
  const user = firstTrimmed(env, ["DATABASE_USER", "DB_USER", "MYSQL_USER"])?.value;
  const password = firstTrimmed(env, ["DATABASE_PASSWORD", "DB_PASSWORD", "MYSQL_PASSWORD"])?.value;
  const name = firstTrimmed(env, ["DATABASE_NAME", "DB_NAME", "MYSQL_DATABASE", "DB_DATABASE"])?.value;
  if (!host || !user || password === undefined || !name) return "";

  const safeHost = host.includes(":") && !host.startsWith("[") ? `[${host}]` : host;
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${safeHost}:${encodeURIComponent(port)}/${encodeURIComponent(name)}`;
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: buildDatabaseUrl(process.env),
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  hostingerMailApiToken: process.env.HOSTINGER_MAIL_API_TOKEN ?? "",
  authMailFrom: process.env.AUTH_MAIL_FROM ?? "",
};
