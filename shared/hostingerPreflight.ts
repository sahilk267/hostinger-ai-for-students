export const HOSTINGER_REQUIRED_ENV_KEYS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "HOSTINGER_MAIL_API_TOKEN",
  "AUTH_MAIL_FROM",
  "BUILT_IN_FORGE_API_URL",
  "BUILT_IN_FORGE_API_KEY",
] as const;

export type HostingerPreflightResult = {
  ok: boolean;
  missing: string[];
  placeholders: string[];
  invalid: string[];
};

const placeholderPatterns = [
  /^your[_-]/i,
  /^replace[_-]/i,
  /^change[_-]/i,
  /^example/i,
  /^changeme$/i,
  /^qwerty/i,
  /^password$/i,
  /^secret$/i,
  /^token$/i,
  /^<[^>]+>$/,
];

const looksLikePlaceholder = (value: string) => placeholderPatterns.some((pattern) => pattern.test(value.trim()));

export function inspectHostingerEnv(env: Record<string, string | undefined>): HostingerPreflightResult {
  const missing: string[] = [];
  const placeholders: string[] = [];
  const invalid: string[] = [];

  const hasExplicitDatabaseUrl = Boolean(env.DATABASE_URL?.trim());
  const hasSplitDatabase = Boolean(
    (env.DATABASE_HOST ?? env.DB_HOST)?.trim() &&
    (env.DATABASE_USER ?? env.DB_USER)?.trim() &&
    (env.DATABASE_PASSWORD ?? env.DB_PASSWORD) !== undefined &&
    (env.DATABASE_NAME ?? env.DB_NAME)?.trim(),
  );

  for (const key of HOSTINGER_REQUIRED_ENV_KEYS) {
    if (key === "DATABASE_URL" && (hasExplicitDatabaseUrl || hasSplitDatabase)) continue;
    const value = env[key]?.trim() ?? "";
    if (!value) {
      missing.push(key);
      continue;
    }
    if (looksLikePlaceholder(value)) placeholders.push(key);
  }

  const databaseSecrets = ["DATABASE_URL", "DATABASE_PASSWORD", "DB_PASSWORD", "JWT_SECRET", "HOSTINGER_MAIL_API_TOKEN"];
  for (const key of databaseSecrets) {
    const value = env[key]?.trim();
    if (value && looksLikePlaceholder(value)) placeholders.push(key);
  }
  if (env.DATABASE_URL?.trim()) {
    try {
      const parsed = new URL(env.DATABASE_URL.trim());
      if (!(parsed.protocol === "mysql:" || parsed.protocol === "mysql2:") || !parsed.hostname || parsed.pathname.length <= 1) invalid.push("DATABASE_URL");
    } catch {
      invalid.push("DATABASE_URL");
    }
  }
  if (env.AUTH_MAIL_FROM?.trim() && env.AUTH_MAIL_FROM.trim() !== "auth@aiforstudents.in") invalid.push("AUTH_MAIL_FROM");

  return { ok: missing.length === 0 && placeholders.length === 0 && invalid.length === 0, missing, placeholders, invalid };
}

export function formatHostingerPreflight(result: HostingerPreflightResult): string {
  if (result.ok) return "Hostinger environment preflight passed.";
  const lines = ["Hostinger environment preflight failed."];
  if (result.missing.length) lines.push(`Missing keys: ${result.missing.join(", ")}`);
  if (result.placeholders.length) lines.push(`Placeholder keys: ${result.placeholders.join(", ")}`);
  if (result.invalid.length) lines.push(`Invalid keys: ${result.invalid.join(", ")}`);
  return lines.join("\n");
}
