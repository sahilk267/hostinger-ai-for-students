import { createHash, createHmac } from "node:crypto";
import { isIP } from "node:net";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { spendAuthRequestBudget } from "./db";

/** Never persist or log bearer credentials; database sees only token digests. */
export function hashAuthSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAuthSessionToken(req: Pick<Request, "headers"> & { cookies?: Record<string, string> }) {
  const fromCookie = req.cookies?.[COOKIE_NAME] ?? parseCookieHeader(req.headers.cookie ?? "")[COOKIE_NAME];
  if (fromCookie) return fromCookie;
  const header = req.headers.authorization;
  return typeof header === "string" && /^Bearer\s+\S+$/.test(header)
    ? header.slice(7) : undefined;
}

/**
 * Rely only on the connected TCP peer. Hostinger proxy setups often share an IP,
 * so enable this optional gate only AFTER staging verifies the actual client-IP
 * architecture. Never trust X-Forwarded-For or X-Real-IP from an arbitrary caller.
 */
export function requestPeerAddress(req: Pick<Request, "socket">) {
  const ip = req.socket?.remoteAddress;
  return ip && isIP(ip) ? ip : null;
}

export type AuthRequestKind = "otp-request" | "otp-verify" | "contact";
export const AUTH_ABUSE_LIMITS: Record<AuthRequestKind, { max: number; windowMs: number }> = {
  "otp-request": { max: 12, windowMs: 15 * 60_000 },
  "otp-verify": { max: 50, windowMs: 15 * 60_000 },
  contact: { max: 5, windowMs: 60 * 60_000 },
};

export function authRequestBucket(
  kind: AuthRequestKind, peerIp: string, now: number, secret: string,
) {
  const policy = AUTH_ABUSE_LIMITS[kind];
  const window = Math.floor(now / policy.windowMs);
  return {
    bucketKey: createHmac("sha256", secret)
      .update(`auth-abuse-v1:${kind}:${peerIp}:${window}`).digest("hex"),
    limit: policy.max,
    expiresAt: new Date((window + 1) * policy.windowMs),
  };
}

/** MySQL-shared rate control when the operator explicitly enables the gate. */
export async function requireAuthRequestBudget(req: Pick<Request, "socket">, kind: AuthRequestKind) {
  if (process.env.AUTH_ABUSE_DB_ENABLED !== "1") return;
  const ip = requestPeerAddress(req);
  const secret = process.env.JWT_SECRET;
  if (!ip || !secret || secret.length < 32) {
    throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Request safety configuration unavailable" });
  }
  let allowed: boolean;
  try {
    allowed = await spendAuthRequestBudget(authRequestBucket(kind, ip, Date.now(), secret));
  } catch {
    throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Request safety service unavailable" });
  }
  if (!allowed) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests; please try again later" });
  }
}
