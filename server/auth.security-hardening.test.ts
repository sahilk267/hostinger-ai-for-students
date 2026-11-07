import { describe, expect, it } from "vitest";
import type { Request, Response } from "express";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isSameOriginApiRequest, requireSameOriginApi } from "./_core/sameOrigin";
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

  it("treats PUBLIC_SITE_ORIGIN as canonical even when the Host header is spoofed", () => {
    const configured = "https://aiforstudents.in";
    expect(isSameOriginApiRequest({ origin: "https://evil.example", host: "evil.example", method: "POST" }, configured)).toBe(false);
    expect(isSameOriginApiRequest({ origin: "https://evil.example", host: "evil.example", secFetchSite: "same-origin" }, configured)).toBe(false);
    expect(isSameOriginApiRequest({ origin: configured, host: "internal-proxy.local:3000", method: "POST" }, configured)).toBe(true);
    expect(isSameOriginApiRequest({ origin: configured, host: "internal-proxy.local:3000", method: "POST", secFetchSite: "same-origin" }, configured)).toBe(true);
    expect(isSameOriginApiRequest({ origin: configured, host: "internal-proxy.local:3000" }, "https://aiforstudents.in/path")).toBe(false);
    expect(isSameOriginApiRequest({ method: "GET" }, "javascript:alert(1)")).toBe(false);
    expect(isSameOriginApiRequest({ origin: "https://aiforstudents.in@evil.example", host: "evil.example" }, configured)).toBe(false);
    expect(isSameOriginApiRequest({ origin: configured + "/trpc", host: "aiforstudents.in" }, configured)).toBe(false);
  });

  it("rejects cross-site and sibling-site Fetch Metadata even with no Origin header", () => {
    const configured = "https://aiforstudents.in";
    for (const secFetchSite of ["cross-site", "same-site", "none", "unknown"]) {
      expect(isSameOriginApiRequest({ method: "POST", secFetchSite }, configured)).toBe(false);
      expect(isSameOriginApiRequest({ method: "GET", secFetchSite }, configured)).toBe(false);
      expect(isSameOriginApiRequest({ origin: configured, method: "POST", secFetchSite }, configured)).toBe(false);
    }
    expect(isSameOriginApiRequest({ method: "POST", secFetchSite: "same-origin" }, configured)).toBe(true);
    expect(isSameOriginApiRequest({ method: "GET" }, configured)).toBe(true);
    expect(isSameOriginApiRequest({ method: "POST" }, configured)).toBe(false);
    expect(isSameOriginApiRequest({ method: "POST", bearerAuthorization: true }, configured)).toBe(true);
    expect(isSameOriginApiRequest({ method: "POST", bearerAuthorization: true, secFetchSite: "cross-site" }, configured)).toBe(false);
    expect(isSameOriginApiRequest({ method: "POST", bearerAuthorization: true, origin: "https://evil.example" }, configured)).toBe(false);
  });

  it("fails closed on a missing public origin in production, but allows configured proxy requests", () => {
    const previousMode = process.env.NODE_ENV;
    const previousOrigin = process.env.PUBLIC_SITE_ORIGIN;
    const check = (headers: Request["headers"], method = "POST") => {
      let responseStatus = 0;
      let responseBody: unknown;
      let nextCalled = false;
      const res = {
        status(status: number) { responseStatus = status; return this; },
        json(body: unknown) { responseBody = body; return this; },
      } as unknown as Response;
      requireSameOriginApi({ headers, method } as Request, res, () => { nextCalled = true; });
      return { responseStatus, responseBody, nextCalled };
    };
    try {
      process.env.NODE_ENV = "production";
      delete process.env.PUBLIC_SITE_ORIGIN;
      expect(check({ origin: "https://aiforstudents.in", host: "aiforstudents.in" }))
        .toMatchObject({ responseStatus: 403, nextCalled: false });
      process.env.PUBLIC_SITE_ORIGIN = "https://aiforstudents.in";
      expect(check({ origin: "https://aiforstudents.in", host: "private-proxy.internal" }))
        .toMatchObject({ responseStatus: 0, nextCalled: true });
      expect(check({ origin: "https://evil.example", host: "evil.example" }))
        .toMatchObject({ responseStatus: 403, nextCalled: false });
      expect(check({ "sec-fetch-site": "cross-site" }))
        .toMatchObject({ responseStatus: 403, nextCalled: false });
      expect(check({}))
        .toMatchObject({ responseStatus: 403, nextCalled: false });
      expect(check({ "sec-fetch-site": "same-origin" }))
        .toMatchObject({ responseStatus: 0, nextCalled: true });
      expect(check({ authorization: "Bearer test-only" }))
        .toMatchObject({ responseStatus: 0, nextCalled: true });
    } finally {
      if (previousMode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousMode;
      if (previousOrigin === undefined) delete process.env.PUBLIC_SITE_ORIGIN; else process.env.PUBLIC_SITE_ORIGIN = previousOrigin;
    }
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
