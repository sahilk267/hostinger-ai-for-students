/* Optional aggregate learning analytics. Do not pass answers, names or private text. */
type EventProperties = Record<string, string | number | boolean>;
type PendingEvent = { event: string; properties: EventProperties };

declare global { interface Window { umami?: { track: (event: string, properties?: EventProperties) => void } } }

let analyticsConfigured = false;
const pending: PendingEvent[] = [];
const MAX_PENDING_EVENTS = 40;

const doNotTrack = () => typeof window !== "undefined" &&
  (window.navigator.doNotTrack === "1" || window.navigator.doNotTrack === "yes");

/** Called only if a configured optional analytics script is about to load. */
export function enableLearningAnalytics() {
  if (doNotTrack()) return;
  analyticsConfigured = true;
}

export function flushPendingLearningEvents() {
  if (typeof window === "undefined" || doNotTrack() || !window.umami) return;
  while (pending.length) {
    const item = pending.shift()!;
    try { window.umami.track(item.event, item.properties); }
    catch { /* Never block learning if analytics fails. */ }
  }
}

export function trackLearningEvent(event: string, properties: EventProperties = {}) {
  if (typeof window === "undefined" || doNotTrack()) return;
  if (!window.umami) {
    if (analyticsConfigured && pending.length < MAX_PENDING_EVENTS) pending.push({event,properties});
    return;
  }
  flushPendingLearningEvents();
  try { window.umami.track(event, properties); }
  catch { /* Analytics must never block learning. */ }
}
