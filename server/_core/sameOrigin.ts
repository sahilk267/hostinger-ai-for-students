import type { NextFunction, Request, Response } from "express";

/**
 * Browser CSRF defense-in-depth for tRPC (OAuth callbacks are handled separately).
 * In production PUBLIC_SITE_ORIGIN is authoritative: Host/X-Forwarded-Host headers
 * are supplied by the client or proxy and cannot enlarge the trusted origin set.
 * Originless unsafe requests need positive same-origin Fetch Metadata or a
 * deliberately supplied Bearer credential (for non-browser API clients).
 * This is not a replacement for credential protection or session revocation.
 */
type ApiRequestHeaders = {
  origin?: string;
  host?: string;
  secFetchSite?: string;
  method?: string;
  bearerAuthorization?: boolean;
};

function parseOrigin(value: string): URL | null {
  try {
    const url = new URL(value);
    if ((url.protocol !== "https:" && url.protocol !== "http:")
      || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    return url;
  } catch {
    return null;
  }
}

export function isSameOriginApiRequest(headers: ApiRequestHeaders, configuredSiteOrigin?: string) {
  // Fail closed for an invalid configured origin (including on Originless requests).
  const canonical = configuredSiteOrigin ? parseOrigin(configuredSiteOrigin) : null;
  if (configuredSiteOrigin && !canonical) return false;

  // A browser may send a valid Origin on POST and Fetch Metadata on GET.
  // "same-site" is NOT sufficient: sibling subdomains may be untrusted.
  if (headers.secFetchSite && headers.secFetchSite !== "same-origin") return false;

  if (headers.origin !== undefined) {
    const sent = parseOrigin(headers.origin);
    if (!sent) return false;
    if (canonical) return sent.origin === canonical.origin;
    // Local development only: no canonical origin supplied. Production middleware
    // requires PUBLIC_SITE_ORIGIN and never trusts this Host-based fallback.
    return Boolean(headers.host && sent.host.toLowerCase() === headers.host.toLowerCase());
  }

  const method = (headers.method ?? "GET").toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;
  return headers.secFetchSite === "same-origin" || headers.bearerAuthorization === true;
}

export function requireSameOriginApi(req: Request, res: Response, next: NextFunction) {
  const configuredSiteOrigin = process.env.PUBLIC_SITE_ORIGIN;
  // Production must not silently fall back to a spoofable request Host.
  if (process.env.NODE_ENV === "production" && !configuredSiteOrigin) {
    res.status(403).json({ error: "API origin is not configured" });
    return;
  }
  const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;
  const host = typeof req.headers.host === "string" ? req.headers.host : undefined;
  const secFetchSite = typeof req.headers["sec-fetch-site"] === "string"
    ? req.headers["sec-fetch-site"] : undefined;
  if (!isSameOriginApiRequest({
    origin,
    host,
    secFetchSite,
    method: req.method,
    bearerAuthorization: typeof req.headers.authorization === "string"
      && /^Bearer\s+\S+$/.test(req.headers.authorization),
  }, configuredSiteOrigin)) {
    res.status(403).json({ error: "Cross-origin API request blocked" });
    return;
  }
  next();
}
