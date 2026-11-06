import { describe, expect, it, vi } from "vitest";

const { reserveEmailLoginChallenge, consumeEmailLoginChallenge, cancelEmailLoginChallenge } = vi.hoisted(() => {
  const rows = new Map<string, {
    challengeId: string; codeHash: string; attempts: number; requestedAt: number;
    expiresAt: number; consumed: boolean;
  }>();
  return {
    reserveEmailLoginChallenge: vi.fn(async (record: { emailKey: string; challengeId: string; codeHash: string; now: Date; expiresAt: Date }) => {
      const existing = rows.get(record.emailKey);
      if (existing && record.now.getTime() - existing.requestedAt < 60_000) return false;
      rows.set(record.emailKey, { challengeId: record.challengeId, codeHash: record.codeHash, attempts: 0, requestedAt: record.now.getTime(), expiresAt: record.expiresAt.getTime(), consumed: false });
      return true;
    }),
    consumeEmailLoginChallenge: vi.fn(async (input: { emailKey: string; challengeId: string; codeHash: string; now: Date }) => {
      const row = rows.get(input.emailKey);
      if (!row || row.challengeId !== input.challengeId || row.consumed || row.attempts >= 5 || row.expiresAt <= input.now.getTime()) return false;
      row.attempts++;
      if (row.codeHash !== input.codeHash) return false;
      row.consumed = true;
      return true;
    }),
    cancelEmailLoginChallenge: vi.fn(async (emailKey: string, challengeId: string) => {
      if (rows.get(emailKey)?.challengeId === challengeId) rows.delete(emailKey);
    }),
  };
});

const { sendAuthenticationCode, upsertUser, getUserByOpenId, getLearningProgressForUser, mergeGuestProgressForUser, createSessionToken } = vi.hoisted(() => ({
  sendAuthenticationCode: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue({ id: 7, openId: "email:test", name: "Learner", email: "learner@example.com", role: "user" }),
  getLearningProgressForUser: vi.fn().mockResolvedValue([]),
  mergeGuestProgressForUser: vi.fn().mockResolvedValue(undefined),
  createSessionToken: vi.fn().mockResolvedValue("signed-local-session"),
}));
vi.mock("./mail", () => ({ sendAuthenticationCode }));
vi.mock("./db", () => ({ upsertUser, getUserByOpenId, getLearningProgressForUser, mergeGuestProgressForUser, reserveEmailLoginChallenge, consumeEmailLoginChallenge, cancelEmailLoginChallenge }));
vi.mock("./_core/sdk", () => ({ sdk: { createSessionToken } }));

import { COOKIE_NAME } from "@shared/const";
import { getEmailChallengeCookie } from "./authEmail";
import { appRouter } from "./routers";

const createContext = (cookies: Record<string, string> = {}) => ({
  req: { cookies, protocol: "https", headers: { "x-forwarded-proto": "https" } } as never,
  res: { cookie: vi.fn(), clearCookie: vi.fn() } as never,
  user: null,
});

describe("auth email-code procedure", () => {
  it("reads a challenge from the raw Cookie header used by production requests", () => {
    const value = "eyJlbWFpbCI6ImxlYXJuZXJAZXhhbXBsZS5jb20iLCJkaWdlc3QiOiJhYmMiLCJleHBpcmVzQXQiOjE3MDAwMDAwMDAwMDB9";
    expect(getEmailChallengeCookie({ headers: { cookie: `other=1; ai_students_email_challenge=${value}` } })).toBe(value);
    expect(getEmailChallengeCookie({ cookies: { ai_students_email_challenge: value } })).toBe(value);
  });

  it("calls the provider adapter without returning the code", async () => {
    const context = createContext();
    const caller = appRouter.createCaller(context);
    const result = await caller.auth.requestEmailCode({ email: "learner@example.com" });

    expect(result).toEqual({ success: true, expiresInMinutes: 10 });
    expect(result).not.toHaveProperty("code");
    expect(sendAuthenticationCode).toHaveBeenCalledWith({
      to: "learner@example.com",
      code: expect.stringMatching(/^\d{6}$/),
      expiresInMinutes: 10,
    });
    expect((context.res as { cookie: ReturnType<typeof vi.fn> }).cookie).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it("throttles repeated requests for the same email", async () => {
    const caller = appRouter.createCaller(createContext());
    await caller.auth.requestEmailCode({ email: "privacy@example.com" });
    await expect(caller.auth.requestEmailCode({ email: "privacy@example.com" })).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });

  it("accepts a fresh code when the challenge is present only in the raw Cookie header", async () => {
    const requestContext = createContext();
    await appRouter.createCaller(requestContext).auth.requestEmailCode({ email: "raw-cookie@example.com" });
    const challengeCookie = (requestContext.res as { cookie: ReturnType<typeof vi.fn> }).cookie.mock.calls[0][1] as string;
    const sentCode = sendAuthenticationCode.mock.calls.at(-1)?.[0].code as string;
    const verifyContext = {
      req: { headers: { cookie: `ai_students_email_challenge=${challengeCookie}` }, protocol: "https", cookies: undefined } as never,
      res: { cookie: vi.fn(), clearCookie: vi.fn() } as never,
      user: null,
    };

    const result = await appRouter.createCaller(verifyContext).auth.verifyEmailCode({ email: "raw-cookie@example.com", code: sentCode });
    expect(result).toEqual({ success: true });
  });

  it("creates a local session after a valid code and clears the one-time challenge", async () => {
    const requestContext = createContext();
    const requestCaller = appRouter.createCaller(requestContext);
    await requestCaller.auth.requestEmailCode({ email: "session@example.com" });
    const challengeCookie = (requestContext.res as { cookie: ReturnType<typeof vi.fn> }).cookie.mock.calls[0][1] as string;
    const verifyContext = createContext({ ai_students_email_challenge: challengeCookie });
    const verifyCaller = appRouter.createCaller(verifyContext);

    const result = await verifyCaller.auth.verifyEmailCode({ email: "learner@example.com", code: "000000" });
    expect(result).toEqual({ success: false });

    const sentCode = sendAuthenticationCode.mock.calls.at(-1)?.[0].code as string;
    const validResult = await verifyCaller.auth.verifyEmailCode({ email: "session@example.com", code: sentCode });
    expect(validResult).toEqual({ success: true });
    expect(upsertUser).toHaveBeenCalledWith(expect.objectContaining({ email: "session@example.com", loginMethod: "email-otp" }));
    expect(createSessionToken).toHaveBeenCalledWith(expect.stringMatching(/^email:/), expect.objectContaining({ expiresInMs: expect.any(Number) }));
    expect((verifyContext.res as { cookie: ReturnType<typeof vi.fn> }).cookie).toHaveBeenCalledWith(COOKIE_NAME, "signed-local-session", expect.objectContaining({ httpOnly: true }));
    expect((verifyContext.res as { clearCookie: ReturnType<typeof vi.fn> }).clearCookie).toHaveBeenCalled();

    const protectedCaller = appRouter.createCaller({
      ...createContext(),
      user: await getUserByOpenId("email:test"),
    });
    await protectedCaller.learning.syncGuest({ rows: [{ gameId: "prompt-detective", attempts: 1, completions: 1, bestScore: 24, lastScore: 24 }] });
    expect(mergeGuestProgressForUser).toHaveBeenCalledWith(7, expect.objectContaining({ gameId: "prompt-detective", bestScore: 24 }));
  });

  it("reports the account-load branch when the database returns no user row", async () => {
    const requestContext = createContext();
    const requestCaller = appRouter.createCaller(requestContext);
    await requestCaller.auth.requestEmailCode({ email: "missing-account@example.com" });
    const challengeCookie = (requestContext.res as { cookie: ReturnType<typeof vi.fn> }).cookie.mock.calls.at(-1)?.[1] as string;
    const sentCode = sendAuthenticationCode.mock.calls.at(-1)?.[0].code as string;
    getUserByOpenId.mockResolvedValueOnce(undefined);

    await expect(appRouter.createCaller({
      req: { cookies: { ai_students_email_challenge: challengeCookie }, protocol: "https", headers: {} } as never,
      res: { cookie: vi.fn(), clearCookie: vi.fn() } as never,
      user: null,
    }).auth.verifyEmailCode({ email: "missing-account@example.com", code: sentCode })).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "Account could not be loaded",
    });
  });

  it("rejects challenge replay and tampering after a successful login", async () => {
    const start = createContext();
    await appRouter.createCaller(start).auth.requestEmailCode({ email: "once-only@example.com" });
    const token = (start.res as { cookie: ReturnType<typeof vi.fn> }).cookie.mock.calls.at(-1)?.[1] as string;
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(token).not.toContain("once-only");
    const otp = sendAuthenticationCode.mock.calls.at(-1)?.[0].code as string;
    const caller = appRouter.createCaller(createContext({ ai_students_email_challenge: token }));
    expect(await caller.auth.verifyEmailCode({ email: "once-only@example.com", code: otp })).toEqual({ success: true });
    expect(await caller.auth.verifyEmailCode({ email: "once-only@example.com", code: otp })).toEqual({ success: false });
    expect(await appRouter.createCaller(createContext({ ai_students_email_challenge: token.slice(0,-1)+"!" })).auth.verifyEmailCode({ email: "once-only@example.com", code: otp })).toEqual({ success: false });
  });

  it("blocks verification after five incorrect attempts across callers", async () => {
    const start = createContext();
    await appRouter.createCaller(start).auth.requestEmailCode({ email: "limit-five@example.com" });
    const token = (start.res as { cookie: ReturnType<typeof vi.fn> }).cookie.mock.calls.at(-1)?.[1] as string;
    const correct = sendAuthenticationCode.mock.calls.at(-1)?.[0].code as string;
    const wrong = correct === "000000" ? "999999" : "000000";
    for (let n = 0; n < 5; n++) {
      const c = appRouter.createCaller(createContext({ ai_students_email_challenge: token }));
      expect(await c.auth.verifyEmailCode({ email: "limit-five@example.com", code: wrong })).toEqual({ success: false });
    }
    expect(await appRouter.createCaller(createContext({ ai_students_email_challenge: token })).auth.verifyEmailCode({ email: "limit-five@example.com", code: correct })).toEqual({ success: false });
  });

  it("rejects a code for a different email address", async () => {
    const start = createContext();
    await appRouter.createCaller(start).auth.requestEmailCode({ email: "one-person@example.com" });
    const token = (start.res as { cookie: ReturnType<typeof vi.fn> }).cookie.mock.calls.at(-1)?.[1] as string;
    const otp = sendAuthenticationCode.mock.calls.at(-1)?.[0].code as string;
    expect(await appRouter.createCaller(createContext({ ai_students_email_challenge: token })).auth.verifyEmailCode({ email: "another-person@example.com", code: otp })).toEqual({ success: false });
  });

  it("rejects malformed codes before verification", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.auth.verifyEmailCode({ email: "learner@example.com", code: "123" })).rejects.toThrow();
  });
});
