import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isSameOriginApiRequest } from "./_core/sameOrigin";
import { getSessionCookieOptions } from "./_core/cookies";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Hardened account and guardian security contracts", () => {
  it("rejects foreign, invalid and null Origin headers", () => {
    expect(isSameOriginApiRequest({ origin: "https://aiforstudents.in", host: "aiforstudents.in" })).toBe(true);
    expect(isSameOriginApiRequest({ origin: "https://evil.example", host: "aiforstudents.in" })).toBe(false);
    expect(isSameOriginApiRequest({ origin: "null", host: "aiforstudents.in" })).toBe(false);
    expect(isSameOriginApiRequest({ origin: "javascript:alert(1)", host: "aiforstudents.in" })).toBe(false);
    expect(isSameOriginApiRequest({ origin: "https://aiforstudents.in.evil.example", host: "aiforstudents.in" })).toBe(false);
    expect(isSameOriginApiRequest({ origin: "https://aiforstudents.in", host: "private-host", }, "https://aiforstudents.in")).toBe(true);
    expect(isSameOriginApiRequest({ origin: "https://evil.example", host: "private-host" }, "https://aiforstudents.in")).toBe(false);
  });

  it("uses Lax secure first-party cookies in production and supports local HTTP", () => {
    const old = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = "production";
      expect(getSessionCookieOptions({ protocol: "http" } as never)).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax", path: "/" });
      process.env.NODE_ENV = "test";
      expect(getSessionCookieOptions({ protocol: "http" } as never).secure).toBe(false);
      expect(getSessionCookieOptions({ protocol: "https" } as never).secure).toBe(true);
    } finally {
      if (old === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = old;
    }
  });

  it("requires explicit guardian self-declaration for learner profile creation", () => {
    const server = source("server/routers.ts");
    const page = source("client/src/pages/ExplorerPage.tsx");
    expect(server).toContain('guardianAcknowledged: z.literal(true)');
    expect(server).toContain("const { guardianAcknowledged: _acknowledged, ...profile }");
    expect(page).toContain("guardianAcknowledged: true");
    expect(page).toContain("self-declaration, not verified identity");
    expect(server).toContain('EXPLORER_AI_FEEDBACK_ENABLED !== "1"');
    expect(page).toContain("explorerFeatures.data?.aiFeedbackEnabled");
  });

  it("protects minors' evidence with age-validation and permanent account-owned deletion", () => {
    const db = source("server/db.ts");
    const schema = source("drizzle/schema.ts");
    expect(db).toContain("authoredMission.ageBand !== profile[0].ageBand");
    expect(db).toContain("Maximum five learner profiles per account");
    expect(db).toContain("await db.delete(explorerProfiles).where");
    expect(schema).toContain('onDelete: "cascade"');
    expect(source("server/_core/index.ts")).toContain("requireSameOriginApi");
  });

  it("stores hashed one-time login secrets with an atomic attempt limit, never OTP plaintext", () => {
    const auth = source("server/authEmail.ts");
    const db = source("server/db.ts");
    const schema = source("drizzle/schema.ts");
    const migration = source("ops/auth-email-otp-hardening.sql");
    expect(auth).toContain('randomBytes(32).toString("base64url")');
    expect(auth).toContain("createHmac");
    expect(auth).toContain("consumeEmailLoginChallenge");
    expect(auth).not.toContain('Buffer.from(JSON.stringify(challenge))');
    expect(db).toContain("reserveEmailLoginChallenge");
    expect(db).toContain("consumeEmailLoginChallenge");
    expect(db).toContain("lt(r.attempts, 5)");
    expect(db).toContain("isNull(r.consumedAt)");
    expect(schema).toContain('authEmailChallenges = mysqlTable("authEmailChallenges"');
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS");
    expect(migration).not.toContain("emailAddress");
    expect(migration).not.toContain("plaintextCode");
  });
});
