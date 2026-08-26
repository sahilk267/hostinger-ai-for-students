import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import type { Response } from "express";
import { ENV } from "./_core/env";

export const AUTH_EMAIL_CODE_COOKIE = "ai_students_email_challenge";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Stable local identity that does not put the learner's email in the openId column. */
export function localEmailOpenId(email: string) {
  return `email:${createHash("sha256").update(normalizeEmail(email)).digest("hex").slice(0, 56)}`;
}
const CODE_TTL_MS = 10 * 60 * 1000;
const REQUEST_COOLDOWN_MS = 30 * 1000;
const recentRequests = new Map<string, number>();

type Challenge = { email: string; digest: string; expiresAt: number };

function signingKey() {
  if (!ENV.cookieSecret) throw new Error("JWT secret is not configured");
  return ENV.cookieSecret;
}

function digest(email: string, code: string) {
  return createHmac("sha256", signingKey()).update(`${email}:${code}`).digest("hex");
}

export function canRequestEmailCode(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const now = Date.now();
  const previous = recentRequests.get(normalizedEmail);
  if (previous && now - previous < REQUEST_COOLDOWN_MS) return false;
  recentRequests.set(normalizedEmail, now);
  recentRequests.forEach((timestamp, key) => {
    if (now - timestamp > CODE_TTL_MS) recentRequests.delete(key);
  });
  return true;
}

export function createEmailCodeChallenge(email: string, response: Response) {
  const normalizedEmail = normalizeEmail(email);
  const code = String(randomInt(100000, 1000000));
  const challenge: Challenge = { email: normalizedEmail, digest: digest(normalizedEmail, code), expiresAt: Date.now() + CODE_TTL_MS };
  response.cookie(AUTH_EMAIL_CODE_COOKIE, Buffer.from(JSON.stringify(challenge)).toString("base64url"), {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: CODE_TTL_MS,
  });
  return { code, expiresInMinutes: CODE_TTL_MS / 60000 };
}

export function getEmailChallengeCookie(request: { headers?: { cookie?: string }; cookies?: Record<string, string> }) {
  const parsedCookie = request.cookies?.[AUTH_EMAIL_CODE_COOKIE];
  if (parsedCookie) return parsedCookie;

  const header = request.headers?.cookie;
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    const name = part.slice(0, separator).trim();
    if (name !== AUTH_EMAIL_CODE_COOKIE) continue;
    const value = part.slice(separator + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return undefined;
}

export function verifyEmailCode(email: string, code: string, cookieValue?: string) {
  const normalizedEmail = normalizeEmail(email);
  if (!cookieValue) return false;
  try {
    const challenge = JSON.parse(Buffer.from(cookieValue, "base64url").toString("utf8")) as Challenge;
    if (challenge.email !== normalizedEmail || challenge.expiresAt < Date.now()) return false;
    const expected = Buffer.from(challenge.digest, "hex");
    const actual = Buffer.from(digest(normalizedEmail, code), "hex");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function clearEmailCodeChallenge(response: Response) {
  response.clearCookie(AUTH_EMAIL_CODE_COOKIE, { path: "/", secure: true, sameSite: "none" });
}
