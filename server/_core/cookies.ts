import type { CookieOptions, Request } from "express";

/**
 * Login and session cookies are first-party (same-origin React/tRPC).
 * Lax permits top-level OAuth redirects while preventing many cross-site CSRFs.
 * Secure is mandatory in production; local HTTP development remains possible.
 */
export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" || req.secure === true || req.protocol === "https",
  };
}
