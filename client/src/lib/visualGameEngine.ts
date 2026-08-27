export type VisualActionKind = "start" | "observe" | "choose" | "retry" | "hint" | "timeout" | "complete" | "abandon";

export type VisualRoundEvent = {
  sessionId: string;
  gameId: string;
  round: number;
  action: VisualActionKind;
  correct?: boolean;
  elapsedMs?: number;
  usedHint?: boolean;
  exposed?: boolean;
};

export type VisualSessionSummary = {
  score: number;
  rounds: number;
  answered: number;
  correct: number;
  accuracy: number;
  quality: "insufficient" | "usable" | "review";
  evidenceNote: "Based on current gameplay";
};

export function scoreVisualSession(events: VisualRoundEvent[], totalRounds: number): VisualSessionSummary {
  const seenRounds = new Set<string>();
  const answered = events.filter((event) => {
    if (event.action !== "choose" || typeof event.correct !== "boolean") return false;
    const key = `${event.sessionId}:${event.gameId}:${event.round}`;
    if (seenRounds.has(key)) return false;
    seenRounds.add(key);
    return true;
  });
  const correct = answered.filter((event) => event.correct).length;
  const rounds = Math.max(0, totalRounds);
  const accuracy = answered.length ? correct / answered.length : 0;
  const distinctRounds = new Set(answered.map((event) => event.round)).size;
  const unusuallyRapid = answered.some((event) => typeof event.elapsedMs === "number" && event.elapsedMs < 250);
  const possiblyIdle = answered.some((event) => typeof event.elapsedMs === "number" && event.elapsedMs > 30_000);
  const usedAssistanceOrExposure = events.some((event) => event.action === "hint" || event.action === "retry" || event.exposed === true || event.action === "timeout");
  const quality = usedAssistanceOrExposure || unusuallyRapid || possiblyIdle ? "review" : distinctRounds < Math.min(3, rounds) ? "insufficient" : "usable";
  return { score: correct, rounds, answered: answered.length, correct, accuracy, quality, evidenceNote: "Based on current gameplay" };
}

export function visualSessionId(gameId: string): string {
  return `${gameId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
