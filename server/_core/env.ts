export function buildDatabaseUrl(env: Record<string, string | undefined>) {
  const explicit = env.DATABASE_URL?.trim();
  if (explicit) return explicit;

  const host = (env.DATABASE_HOST ?? env.DB_HOST)?.trim();
  const port = (env.DATABASE_PORT ?? env.DB_PORT ?? "3306").trim();
  const user = (env.DATABASE_USER ?? env.DB_USER)?.trim();
  const password = env.DATABASE_PASSWORD ?? env.DB_PASSWORD;
  const name = (env.DATABASE_NAME ?? env.DB_NAME)?.trim();
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
