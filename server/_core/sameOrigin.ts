import type { NextFunction, Request, Response } from "express";

/**
 * Refuse browser requests sent from a different origin before reaching tRPC.
 * Browser cookies use SameSite=Lax as another defensive layer.
 * Configure PUBLIC_SITE_ORIGIN for reverse-proxy deployments where Host differs.
 */
export function isSameOriginApiRequest(headers: {
  origin?: string; host?: string;
}, configuredSiteOrigin?: string) {
  if (!headers.origin) return true; // Legacy/non-browser clients; SameSite cookie still applies.
  try {
    const origin = new URL(headers.origin);
    if (!["https:", "http:"].includes(origin.protocol)) return false;
    const publicOrigin = configuredSiteOrigin ? new URL(configuredSiteOrigin) : null;
    if (publicOrigin && origin.origin === publicOrigin.origin) return true;
    return Boolean(headers.host && origin.host.toLowerCase() === headers.host.toLowerCase());
  } catch { return false; }
}

export function requireSameOriginApi(req: Request, res: Response, next: NextFunction) {
  const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;
  const host = typeof req.headers.host === "string" ? req.headers.host : undefined;
  if (!isSameOriginApiRequest({ origin, host }, process.env.PUBLIC_SITE_ORIGIN)) {
    res.status(403).json({ error: "Cross-origin API request blocked" });
    return;
  }
  next();
}
