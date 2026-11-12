/** Canonical public URL helper. Prefer verified VITE_SITE_URL in production. */
const configured = import.meta.env.VITE_SITE_URL?.trim();
const validOrigin = configured && /^https:\/\/[a-z0-9.-]+(?::\d+)?\/?$/i.test(configured);
export const publicSiteOrigin = validOrigin
  ? configured.replace(/\/$/, "")
  : typeof window !== "undefined" ? window.location.origin : "https://aiforstudents.in";

export function publicUrl(path: string): string {
  return publicSiteOrigin + (path.startsWith("/") ? path : "/" + path);
}
