import {
  ADVENTURE_WORLDS,
  getAgeAdventureMissions,
  type AdventureAgeBand,
  type AdventureAttempt,
  type AdventureLocale,
  type AdventureMission,
  type AdventureWorldId,
  type Localized,
} from "./discoveryAdventure";

/**
 * Evidence from the nine authored practice tasks for ONE selected age band.
 * No normative comparison, diagnosis, inferred personality or career advice.
 * Browser-local results are not authoritative, authenticated or verifiable.
 */
const t = (en: string, hi: string, hinglish: string): Localized => ({ en, hi, hinglish });

export type MissionPracticeState = "not_started" | "needs_retry" | "solved_after_practice" | "first_try_with_hint" | "first_try_independent";

export function classifyAdventureMission(attempt?: AdventureAttempt): MissionPracticeState {
  if (!attempt) return "not_started";
  if (!attempt.bestCorrect) return "needs_retry";
  if (attempt.firstIndependent) return "first_try_independent";
  if (attempt.firstCorrect) return "first_try_with_hint";
  return "solved_after_practice";
}

const FAMILY_PROMPTS: Record<AdventureWorldId, Localized> = {
  logic: t(
    "Ask: What was your plan before you acted? What did you change when something did not work?",
    "पूछें: काम शुरू करने से पहले आपकी योजना क्या थी? कुछ न चलने पर क्या बदला?",
    "Poochhiye: Action se pehle plan kya tha? Kuch work na kare toh kya change kiya?"
  ),
  mystery: t(
    "Ask: Which clue was reliable? How could you check the claim outside this game?",
    "पूछें: कौन सा सुराग भरोसेमंद था? खेल से बाहर इस दावे की पुष्टि कैसे करेंगे?",
    "Poochhiye: Kaunsa clue reliable tha? Game ke bahar claim ko kaise verify karoge?"
  ),
  creator: t(
    "Ask: Who would use your idea? What would you improve after getting feedback?",
    "पूछें: आपके विचार का उपयोग कौन करेगा? फीडबैक के बाद क्या सुधारेंगे?",
    "Poochhiye: Idea kaun use karega? Feedback ke baad kya improve karoge?"
  ),
};

export const COMPLETION_POLICY_VERSION = "demo-practice-v1";

/** This is a non-accredited, unverifiable LOCAL practice milestone. */
export function buildAdventurePracticeReport(ageBand: AdventureAgeBand, attempts: Record<string, AdventureAttempt>) {
  const missions = getAgeAdventureMissions(ageBand);
  const entries = missions.map((mission) => {
    const attempt = attempts[mission.id];
    return { mission, attempt: attempt ?? null, status: classifyAdventureMission(attempt) };
  });
  const attempted = entries.filter((row) => row.attempt).length;
  const solved = entries.filter((row) => row.attempt?.bestCorrect).length;
  const independentFirst = entries.filter((row) => row.status === "first_try_independent").length;
  const firstWithHint = entries.filter((row) => row.status === "first_try_with_hint").length;
  const improvedAfterRetry = entries.filter((row) => row.status === "solved_after_practice").length;
  const stillNeedsRetry = entries.filter((row) => row.status === "needs_retry").length;
  const totalHints = entries.reduce((count, row) => count + (row.attempt?.hintsUsed ?? 0), 0);
  const reportedEnjoyment = entries.filter((row) => row.attempt?.enjoyed === true).length;
  const explicitlyDisliked = entries.filter((row) => row.attempt?.enjoyed === false).length;
  const reviewedInterest = reportedEnjoyment + explicitlyDisliked;
  const completed = missions.length > 0 && solved === missions.length;
  const recentTimestamps = completed
    ? entries.map((row) => row.attempt?.updatedAt).filter((value): value is string => !!value)
    : [];
  const validDates = recentTimestamps
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value) && value > 0);
  const completedAt = completed && validDates.length === missions.length ? new Date(Math.max(...validDates)).toISOString() : null;

  const worldDetails = ADVENTURE_WORLDS.map((world) => {
    const worldEntries = entries.filter((row) => row.mission.world === world.id);
    return {
      id: world.id,
      icon: world.icon,
      title: world.title,
      familyPrompt: FAMILY_PROMPTS[world.id],
      attempted: worldEntries.filter((row) => row.attempt).length,
      solved: worldEntries.filter((row) => row.attempt?.bestCorrect).length,
      independentFirst: worldEntries.filter((row) => row.status === "first_try_independent").length,
      enjoyed: worldEntries.filter((row) => row.attempt?.enjoyed === true).length,
      entries: worldEntries,
    };
  });

  const nextMission = entries.find((row) => row.status === "needs_retry")?.mission
    ?? entries.find((row) => row.status === "not_started")?.mission
    ?? null;

  return {
    ageBand,
    policyVersion: COMPLETION_POLICY_VERSION,
    total: missions.length,
    attempted,
    solved,
    independentFirst,
    firstWithHint,
    improvedAfterRetry,
    stillNeedsRetry,
    totalHints,
    reportedEnjoyment,
    reviewedInterest,
    completed,
    completedAt,
    entries,
    worldDetails,
    nextMission,
  };
}

export const PRACTICE_STATUS_LABELS: Record<MissionPracticeState, Localized> = {
  not_started: t("Not attempted", "अभी शुरू नहीं", "Abhi start nahi hua"),
  needs_retry: t("Attempted — revise and try again", "प्रयास हुआ — फिर अभ्यास करें", "Attempt hua — retry needed"),
  solved_after_practice: t("Solved after an earlier incorrect attempt", "गलत प्रयास के बाद सही हुआ", "Earlier wrong attempt ke baad solved"),
  first_try_with_hint: t("Solved on first try with a hint", "संकेत लेकर पहले प्रयास में सही", "Hint ke saath first try solved"),
  first_try_independent: t("Solved on first try without a hint", "बिना संकेत पहले प्रयास में सही", "Without hint first try solved"),
};

export function getAdventureSkillLabel(skill: AdventureMission["skill"], locale: AdventureLocale): string {
  const labels: Record<AdventureMission["skill"], Localized> = {
    planning: t("Planning", "योजना", "Planning"),
    evidence: t("Checking evidence", "प्रमाण की जाँच", "Evidence check"),
    creativity: t("Design choices", "डिज़ाइन के निर्णय", "Design choices"),
    explanation: t("Explaining a process", "प्रक्रिया समझाना", "Process explain"),
    flexibility: t("Adapting a plan", "योजना बदलना", "Plan adapt karna"),
    reflection: t("Revising a solution", "समाधान सुधारना", "Solution revise"),
  };
  return labels[skill][locale];
}
