/* Study Desk Editorial analytics: event names only, no learner identity, answer text or personal data. */
type EventProperties = Record<string, string | number | boolean>;

declare global { interface Window { umami?: { track: (event: string, properties?: EventProperties) => void } } }

export function trackLearningEvent(event: string, properties: EventProperties = {}) {
  if (typeof window === "undefined") return;
  if (window.navigator.doNotTrack === "1" || window.navigator.doNotTrack === "yes") return;
  try { window.umami?.track(event, properties); } catch { /* Analytics must never block learning. */ }
}
