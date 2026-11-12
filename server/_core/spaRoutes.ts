/** Routing contract for production SPA fallback. Public content SSR is handled earlier.
 * Pure helpers keep direct deep-link behavior testable without a web server.
 */
const publicRoutes = new Set([
  "/", "/play", "/mission", "/journey", "/explorer", "/explorer/report",
  "/explorer/pilot-review", "/progress", "/certificate", "/account",
  "/topics", "/guides", "/learn", "/parents", "/start", "/teachers",
  "/plans", "/study", "/robotics", "/discovery-lab", "/contact",
]);

const privateRoutes = new Set([
  "/account", "/progress", "/certificate", "/explorer/report", "/explorer/pilot-review",
]);

/** Use Express's req.originalUrl, not req.path in a wildcard-mounted handler. */
export function spaPathFromOriginalUrl(originalUrl: string): string {
  const path = new URL(originalUrl, "http://localhost").pathname;
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function isKnownSpaPath(path: string): boolean {
  return publicRoutes.has(path) || /^\/explorer\/share\/[A-Za-z0-9_-]+$/.test(path);
}

export function isPrivateSpaPath(path: string): boolean {
  return privateRoutes.has(path) || /^\/explorer\/share\/[A-Za-z0-9_-]+$/.test(path);
}
