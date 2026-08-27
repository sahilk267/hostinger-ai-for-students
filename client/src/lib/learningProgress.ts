export type GameId = "prompt-detective" | "fact-check-quest" | "ai-safety-lab" | "prompt-workshop" | "source-hunt" | "bias-buster" | "ai-decoder" | "data-detective" | "creative-director" | "code-coach" | "decision-studio" | "tool-match" | "robotics";

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
});

export function isGuestSessionExpired(touchedAt: string | null, now = Date.now()) {
  if (!touchedAt) return false;
  const parsed = new Date(touchedAt).getTime();
  return Number.isFinite(parsed) && now - parsed > GUEST_RETENTION_MS;
}

function touchGuestSession() {
  window.localStorage.setItem(SESSION_KEY, new Date().toISOString());
}

function normalize(raw: Partial<LearningProgress>): LearningProgress {
  const base = empty();
  for (const game of Object.keys(base) as GameId[]) {
    const incoming = raw?.[game];
    if (!incoming) continue;
    base[game] = {
      attempts: Number.isFinite(incoming.attempts) ? Math.max(0, incoming.attempts) : 0,
      completions: Number.isFinite(incoming.completions) ? Math.max(0, incoming.completions) : 0,
      bestScore: Number.isFinite(incoming.bestScore) ? Math.max(0, incoming.bestScore) : 0,
      lastScore: Number.isFinite(incoming.lastScore) ? Math.max(0, incoming.lastScore) : 0,
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
    resetLearningProgress();
    return empty();
  }
}

export function startGame(gameId: GameId) {
  const progress = getLearningProgress();
  progress[gameId].attempts += 1;
  progress[gameId].lastPlayed = new Date().toISOString();
  window.localStorage.setItem(KEY, JSON.stringify(progress));
  touchGuestSession();
}

export function completeGame(gameId: GameId, score: number) {
  const progress = getLearningProgress();
  progress[gameId].completions += 1;
  progress[gameId].lastScore = Math.max(0, score);
  progress[gameId].bestScore = Math.max(progress[gameId].bestScore, score);
  progress[gameId].lastPlayed = new Date().toISOString();
  window.localStorage.setItem(KEY, JSON.stringify(progress));
  touchGuestSession();
}

export function resetLearningProgress() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(SESSION_KEY);
  }
}
