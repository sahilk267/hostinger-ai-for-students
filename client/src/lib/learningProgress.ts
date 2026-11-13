import { trackLearningEvent } from "./analytics";
export type GameId = "prompt-detective" | "fact-check-quest" | "ai-safety-lab" | "prompt-workshop" | "source-hunt" | "bias-buster" | "ai-decoder" | "data-detective" | "creative-director" | "code-coach" | "decision-studio" | "tool-match" | "robotics" | "pattern-builder" | "memory-adventure" | "mini-scientist" | "bridge-builder" | "robot-programmer" | "traffic-controller" | "mission-commander" | "creative-studio" | "performance-arena";

export type GameProgress = { attempts: number; completions: number; bestScore: number; lastScore: number; lastPlayed: string | null };
export type LearningProgress = Record<GameId, GameProgress>;

const KEY = "ai-students-learning-progress";
const SESSION_KEY = "ai-students-guest-session";
export const GUEST_RETENTION_DAYS = 90;
const GUEST_RETENTION_MS = GUEST_RETENTION_DAYS * 24 * 60 * 60 * 1000;
const empty = (): LearningProgress => ({
  "prompt-detective": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "fact-check-quest": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "ai-safety-lab": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "prompt-workshop": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "source-hunt": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "bias-buster": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "ai-decoder": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "data-detective": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "creative-director": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "code-coach": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "decision-studio": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "tool-match": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "robotics": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "pattern-builder": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "memory-adventure": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "mini-scientist": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "bridge-builder": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "robot-programmer": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "traffic-controller": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "mission-commander": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "creative-studio": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
  "performance-arena": { attempts: 0, completions: 0, bestScore: 0, lastScore: 0, lastPlayed: null },
});

export function isGuestSessionExpired(touchedAt: string | null, now = Date.now()) {
  if (!touchedAt) return false;
  const parsed = new Date(touchedAt).getTime();
  return Number.isFinite(parsed) && now - parsed > GUEST_RETENTION_MS;
}

function saveGuestProgress(progress: LearningProgress): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
    window.localStorage.setItem(SESSION_KEY, new Date().toISOString());
    return true;
  } catch {
    // Private browsing, disabled storage and storage quotas must not block play.
    return false;
  }
}
const safeCount = (value: unknown): number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
const safeScore = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;

function normalize(raw: Partial<LearningProgress>): LearningProgress {
  const base = empty();
  for (const game of Object.keys(base) as GameId[]) {
    const incoming = raw?.[game];
    if (!incoming) continue;
    base[game] = {
      attempts: safeCount(incoming.attempts),
      completions: safeCount(incoming.completions),
      bestScore: safeScore(incoming.bestScore),
      lastScore: safeScore(incoming.lastScore),
      lastPlayed: typeof incoming.lastPlayed === "string" ? incoming.lastPlayed : null,
    };
  }
  return base;
}

export function getLearningProgress(): LearningProgress {
  if (typeof window === "undefined") return empty();
  try {
    const touchedAt = window.localStorage.getItem(SESSION_KEY);
    if (isGuestSessionExpired(touchedAt)) {
      resetLearningProgress();
      return empty();
    }
    return normalize(JSON.parse(window.localStorage.getItem(KEY) || "{}"));
  } catch {
    return empty(); // Storage could be blocked; never throw during rendering.
  }
}

/** Detects restricted/private browser storage before promising persistent device progress. */
export function isLearningProgressStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "ai-students-storage-check";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch { return false; }
}

export function startGame(gameId: GameId) {
  if (typeof window === "undefined") return;
  const progress = getLearningProgress();
  progress[gameId].attempts += 1;
  progress[gameId].lastPlayed = new Date().toISOString();
  if (saveGuestProgress(progress)) trackLearningEvent("learning_practice_started", { game: gameId });
}

export function completeGame(gameId: GameId, score: number) {
  if (typeof window === "undefined") return;
  const progress = getLearningProgress();
  const recordedScore = safeScore(score);
  progress[gameId].completions += 1;
  progress[gameId].lastScore = recordedScore;
  progress[gameId].bestScore = Math.max(progress[gameId].bestScore, recordedScore);
  progress[gameId].lastPlayed = new Date().toISOString();
  if (saveGuestProgress(progress)) trackLearningEvent("learning_practice_completed", { game: gameId });
}

export function resetLearningProgress() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(SESSION_KEY);
  } catch { /* Browser storage may be blocked. */ }
}
