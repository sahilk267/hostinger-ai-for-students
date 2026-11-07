import { describe, expect, it, vi } from "vitest";

const { reserveEmailLoginChallenge, consumeEmailLoginChallenge, cancelEmailLoginChallenge } = vi.hoisted(() => {
  const records = new Map<string, { id: string; hash: string; used: boolean }>();
  return {
    reserveEmailLoginChallenge: vi.fn(async (input: { emailKey: string; challengeId: string; codeHash: string }) => {
      records.set(input.emailKey, { id: input.challengeId, hash: input.codeHash, used: false });
      return true;
    }),
    consumeEmailLoginChallenge: vi.fn(async (input: { emailKey: string; challengeId: string; codeHash: string }) => {
      const entry = records.get(input.emailKey);
      if (!entry || entry.used || entry.id !== input.challengeId || entry.hash !== input.codeHash) return false;
      entry.used = true;
      return true;
    }),
    cancelEmailLoginChallenge: vi.fn().mockResolvedValue(undefined),
  };
});

const { sendAuthenticationCode, upsertUser, getUserByOpenId, mergeGuestProgressForUser } = vi.hoisted(() => ({
  sendAuthenticationCode: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue({ id: 42, openId: "email:local", name: "Local Learner", email: "local@example.com", role: "user" }),
  mergeGuestProgressForUser: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./mail", () => ({ sendAuthenticationCode }));
vi.mock("./db", () => ({ upsertUser, getUserByOpenId, mergeGuestProgressForUser, reserveEmailLoginChallenge, consumeEmailLoginChallenge, cancelEmailLoginChallenge }));

import { COOKIE_NAME } from "@shared/const";
import { appRouter } from "./routers";
import { sdk } from "./_core/sdk";

function context(cookies: Record<string, string> = {}) {
  return {
    req: { cookies, protocol: "https", headers: { "x-forwarded-proto": "https" } } as never,
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as never,
    user: null,
  };
}

describe("local OTP session integration", () => {
  it("uses the issued session cookie for protected guest-progress sync", async () => {
    const requestContext = context();
    await appRouter.createCaller(requestContext).auth.requestEmailCode({ email: "local@example.com" });
    const challenge = (requestContext.res as { cookie: ReturnType<typeof vi.fn> }).cookie.mock.calls[0][1] as string;
    const code = sendAuthenticationCode.mock.calls.at(-1)?.[0].code as string;

    const verificationContext = context({ ai_students_email_challenge: challenge });
    const result = await appRouter.createCaller(verificationContext).auth.verifyEmailCode({ email: "local@example.com", code });
    expect(result).toEqual({ success: true });

    const sessionCookie = (verificationContext.res as { cookie: ReturnType<typeof vi.fn> }).cookie.mock.calls[0][1] as string;
    const authenticatedUser = await sdk.authenticateRequest({
      protocol: "https",
      headers: { cookie: `${COOKIE_NAME}=${sessionCookie}`, "x-forwarded-proto": "https" },
    } as never);
    expect(authenticatedUser).toMatchObject({ id: 42, email: "local@example.com" });

    const protectedCaller = appRouter.createCaller({ ...context(), user: authenticatedUser });
    await protectedCaller.learning.syncGuest({ rows: [{ gameId: "prompt-detective", attempts: 2, completions: 1, bestScore: 26, lastScore: 26 }] });
    expect(mergeGuestProgressForUser).toHaveBeenCalledWith(42, expect.objectContaining({ gameId: "prompt-detective", bestScore: 26 }));
  });
});
