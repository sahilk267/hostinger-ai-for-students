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
import { summarizeTransfer, type TransferAttempt } from "./discoveryTransfer";

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

export const COMPLETION_POLICY_VERSION = "local-practice-transfer-v2";

/** This is a non-accredited, unverifiable LOCAL practice milestone. */
export function buildAdventurePracticeReport(ageBand: AdventureAgeBand, attempts: Record<string, AdventureAttempt>, transfers: Record<string, TransferAttempt> = {}) {
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
  const transfer = summarizeTransfer(ageBand, transfers);
  const showcaseReady = completed && transfer.completed;
  const showcaseCompletedAt = showcaseReady && completedAt && transfer.completedAt
    ? new Date(Math.max(Date.parse(completedAt), Date.parse(transfer.completedAt))).toISOString() : null;

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
      guidance: getEvidenceGuidance(world.id, ageBand, worldEntries),
      transfer: transfer.entries.find(row => row.challenge.world === world.id) ?? null,
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
    transfer,
    showcaseReady,
    showcaseCompletedAt,
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


/** Concrete family support—not inferred aptitude, field selection or predicted career. */
const HOME_ACTIVITIES: Record<AdventureAgeBand, Record<AdventureWorldId, Localized>> = {
  "8-10": {
    logic: t("Make a toy road with one blocked path. Let the child find and explain another route in 10 minutes.", "खिलौनों से दो रास्ते बनाएँ, एक बंद करें। 10 मिनट में बच्चा दूसरा रास्ता समझाए।", "Toys ke 2 paths banao, ek block karo. Child 10 min mein alternative explain kare."),
    mystery: t("Compare a pretend announcement and a dated school notice. Find two clues about trust.", "एक काल्पनिक पोस्ट और तारीख़ वाली स्कूल सूचना की तुलना करके दो सुराग ढूँढें।", "Fictional post aur dated notice compare karke 2 trust clues find karo."),
    creator: t("Redesign a simple home game so it can be played by tapping, pointing or speaking.", "घर का आसान खेल इस तरह बदलें कि टैप, इशारे या बोलकर खेल सकें।", "Home game aisa redesign karo ki tap, point ya speak se play ho."),
  },
  "11-13": {
    logic: t("Plan a five-minute offline demo. List one likely failure, a fallback and how to test it.", "5 मिनट का ऑफलाइन डेमो बनाएं। एक जोखिम, विकल्प और उसकी जाँच लिखें।", "5-min offline demo plan karo: risk, fallback aur test likho."),
    mystery: t("Choose one online claim and check the original source, date and who was studied.", "ऑनलाइन दावा चुनें। मूल स्रोत, तारीख़ और शामिल लोगों की जाँच करें।", "Online claim choose karo; source, date aur sample verify karo."),
    creator: t("Ask someone to try a short instruction sheet. Revise one confusing line from their feedback.", "किसी से छोटी निर्देश शीट आज़माने को कहें। फीडबैक से एक उलझी पंक्ति सुधारें।", "Instruction sheet test karwao; feedback se confusing line improve karo."),
  },
  "14-17": {
    logic: t("Write two dependencies and a tested fallback for a small real-life project.", "छोटे प्रोजेक्ट की दो निर्भरताएँ और जाँचा हुआ विकल्प लिखें।", "Small project ki 2 dependencies aur tested fallback likho."),
    mystery: t("Find a numerical comparison. List selection bias, a possible confounder and what is not proved.", "संख्यात्मक तुलना में चयन-पक्षपात, दूसरा संभावित कारण और अप्रमाणित दावा पहचानें।", "Numerical comparison mein bias, confounder aur unproven claim identify karo."),
    creator: t("Test a form with keyboard navigation and a different language; record two fixes and retest.", "फॉर्म को कीबोर्ड और दूसरी भाषा से चलाकर दो सुधार लिखें और फिर टेस्ट करें।", "Form keyboard aur different language se test karo; 2 fixes likhkar retest."),
  },
};
const OBSERVATION = {
  noEvidence: t("Not enough activity evidence in this world yet.", "इस दुनिया में अभी पर्याप्त अभ्यास नहीं हुआ।", "Is world mein abhi evidence kam hai."),
  retry: t("Some tasks needed a second approach or are still unsolved.", "कुछ कार्यों में दोबारा कोशिश लगी या वे अभी अधूरे हैं।", "Kuch tasks retry maangte hain ya incomplete hain."),
  practice: t("Some tasks were solved independently on the first try; continue practising with new examples.", "कुछ काम पहली बार बिना सहायता हुए। नए उदाहरणों से अभ्यास जारी रखें।", "Kuch first try independent hue. New examples se practise continue karo."),
  consistent: t("All three practice tasks in this world were solved independently on the first try. Try unfamiliar examples before making wider claims.", "इस दुनिया के तीनों काम पहली बार बिना सहायता सही हुए। बड़े निष्कर्ष से पहले नए उदाहरण लें।", "World ke 3 tasks first try independent hue. Broader conclusions se pehle fresh tasks try karo."),
} as const;
function getEvidenceGuidance(world: AdventureWorldId, band: AdventureAgeBand, entries: { attempt: AdventureAttempt | null; status: MissionPracticeState }[]) {
  const started = entries.filter(row => row.attempt).length;
  const independent = entries.filter(row => row.status === "first_try_independent").length;
  const pending = entries.filter(row => row.status === "needs_retry").length;
  const revised = entries.filter(row => row.status === "solved_after_practice" || row.status === "first_try_with_hint").length;
  const observation = started < 2 ? OBSERVATION.noEvidence
    : independent === 3 ? OBSERVATION.consistent
    : pending || revised ? OBSERVATION.retry : OBSERVATION.practice;
  return { observation, activity: HOME_ACTIVITIES[band][world] };
}
