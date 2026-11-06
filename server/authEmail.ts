import { createHash, createHmac, randomBytes, randomInt } from "node:crypto";
import type { Request, Response } from "express";
import { ENV } from "./_core/env";
import { getSessionCookieOptions } from "./_core/cookies";
import { cancelEmailLoginChallenge, consumeEmailLoginChallenge, reserveEmailLoginChallenge } from "./db";

export const AUTH_EMAIL_CODE_COOKIE = "ai_students_email_challenge";
export const EMAIL_CODE_TTL_MINUTES = 10;
const CODE_TTL_MS = EMAIL_CODE_TTL_MINUTES * 60_000;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Stable local identity that does not put the email address into openId. */
export function localEmailOpenId(email: string) {
  return "email:" + createHash("sha256").update(normalizeEmail(email)).digest("hex").slice(0, 56);
}
function signingKey() {
  if (!ENV.cookieSecret || ENV.cookieSecret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  return ENV.cookieSecret;
}
function emailKey(email: string) {
  return createHmac("sha256", signingKey()).update("email:" + normalizeEmail(email)).digest("hex");
}
function codeHash(key: string, challengeId: string, code: string) {
  return createHmac("sha256", signingKey()).update("code:" + key + ":" + challengeId + ":" + code).digest("hex");
}

/** Opaque cookie value: random database identifier, never an encoded code/hash/email. */
export async function createEmailCodeChallenge(email: string, req: Request, response: Response) {
  const normalizedEmail = normalizeEmail(email);
  const key = emailKey(normalizedEmail);
  const challengeId = randomBytes(32).toString("base64url");
  const code = String(randomInt(100000, 1000000));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CODE_TTL_MS);
  const reserved = await reserveEmailLoginChallenge({
    emailKey: key, challengeId, codeHash: codeHash(key, challengeId, code),
    now, expiresAt,
  });
  if (!reserved) return null;
  response.cookie(AUTH_EMAIL_CODE_COOKIE, challengeId, {
    ...getSessionCookieOptions(req),
    maxAge: CODE_TTL_MS,
  });
  return {
    code, expiresInMinutes: EMAIL_CODE_TTL_MINUTES,
    email: normalizedEmail, emailKey: key, challengeId,
  };
}

export function getEmailChallengeCookie(request: { headers?: { cookie?: string }; cookies?: Record<string, string> }) {
  const value = request.cookies?.[AUTH_EMAIL_CODE_COOKIE];
  if (value) return value;
  const header = request.headers?.cookie;
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() !== AUTH_EMAIL_CODE_COOKIE) continue;
    const value = part.slice(separator + 1).trim();
    try { return decodeURIComponent(value); } catch { return value; }
  }
  return undefined;
}

export async function verifyEmailCode(email: string, code: string, cookieValue?: string) {
  if (!cookieValue || !/^[A-Za-z0-9_-]{43}$/.test(cookieValue) || !/^\d{6}$/.test(code)) return false;
  const key = emailKey(email);
  return consumeEmailLoginChallenge({
    emailKey: key, challengeId: cookieValue,
    codeHash: codeHash(key, cookieValue, code), now: new Date(),
  });
}
export async function cancelEmailCodeChallenge(email: string, challengeId: string) {
  return cancelEmailLoginChallenge(emailKey(email), challengeId);
}
export function clearEmailCodeChallenge(response: Response, req: Request) {
  response.clearCookie(AUTH_EMAIL_CODE_COOKIE, getSessionCookieOptions(req));
}
