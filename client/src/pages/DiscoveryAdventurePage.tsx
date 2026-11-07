import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, RotateCcw, Sparkles, Undo2, LockKeyhole, Lightbulb } from "lucide-react";
import { ADVENTURE_LOCALES, ADVENTURE_AGE_BANDS, ALL_ADVENTURE_MISSIONS, ADVENTURE_WORLDS, evaluateAdventureAnswer, shuffledAdventureOptions, getAgeAdventureMissions, describeAdventureWorld, type AdventureAgeBand, type AdventureAttempt, type AdventureLocale, type AdventureMission } from "@/data/discoveryAdventure";
import DiscoveryEvidenceScene from "@/components/DiscoveryEvidenceScene";
import DiscoveryAgeEvidenceScene from "@/components/DiscoveryAgeEvidenceScene";
import DiscoveryParentReport from "@/components/DiscoveryParentReport";
import DiscoveryTransferAssessment from "@/components/DiscoveryTransferAssessment";
import { TRANSFER_CHALLENGES, summarizeTransfer, type TransferAttempt } from "@/data/discoveryTransfer";
import "./discoveryAdventure.css";

const STORAGE_KEY = "aifs-discovery-adventure-v1";
const TRANSFER_STORAGE_KEY = "aifs-discovery-transfer-v1";
const LOCALE_KEY = "aifs-explorer-locale";
const AGE_KEY = "aifs-discovery-adventure-age-band";
const words = {
  en: {
    kicker: "DISCOVERY UNIVERSE · FREE PILOT", hero: "Your next adventure begins here.",
    lead: "Three worlds. Nine hands-on missions. Explore how you plan, investigate and improve — without a test label.",
    private: "Private on this device", privateNote: "Practice is shared within this browser, not tied to a child identity. Clear results before another learner. No signup or payment.",
    age: "Choose your learning level", agePrompt: "Pick an age-appropriate adventure", otherAges: "Other experiences, including ages 5–7", worlds: "Choose a world",
    missions: "Missions", ready: "Ready to explore", done: "Practiced", explore: "Start mission", replay: "Practice again",
    back: "Back to map", order: "Your sequence", undo: "Undo last move", reset: "Clear choices",
    choose: "Pick an answer", selected: "Selected", check: "Check my approach", correct: "Nice reasoning!",
    incorrect: "An opportunity to revise", explanation: "What we can learn",
    retry: "Try a different approach", next: "Next mission", report: "View learning snapshot",
    reportTitle: "Your practice snapshot", reportIntro: "Age-band-specific practice on this device. No diagnosis, intelligence score, fixed strength, cross-age ranking or career prediction.",
    practiced: "Missions attempted", first: "First try, without hints", improved: "Solved after retry", hinted: "Hint-assisted attempts", hintButton: "Need a clue?",
    interest: "Missions enjoyed", noEvidence: "Not enough practice evidence yet", high: "Two or more tasks solved independently on the first try. Try fresh examples before drawing conclusions.", practice: "Try new examples in this world; a few tasks cannot measure ability.",
    parent: "For a parent or guardian", reportHint: "Ask which mission felt interesting, what changed after feedback, and what they want to explore next.",
    print: "Print private snapshot", interestQuestion: "Did you enjoy this mission?", yes: "Yes, I enjoyed it", notNow: "Not this one",
    finish: "Worlds explored", completion: "All 9 missions attempted. Explorer badge unlocked — this is a demo milestone, not an accredited certificate.",
    initial: "Progress is saved locally only; deleting browser data clears it.", help: "Tap cards to build a sequence. All controls work with keyboard, too.",
    nextPractice: "A useful next mission", nextReasonRetry: "This one was not solved yet. A fresh attempt may help.", nextReasonNew: "Try a new kind of challenge to gather more evidence.",
    enjoymentHeading: "Learner-reported enjoyment", enjoymentNote: "You said you enjoyed activities in this world. This is an interest to explore, not a talent label.",
    clearPractice: "Delete all local age-band practice", clearConfirm: "Delete results for ALL age bands on this browser? This cannot be undone.",
    assessmentCta: "The Thinking Challenge", assessmentSummary: "Three fresh situations · choose an action and explain why", assessmentLocked: "Solve all nine missions to unlock this level", assessmentOpen: "Start new challenges",
    results: "Your progress", notScore: "Results describe only these practice activities. They do not establish natural talent or suitability for a field.",
  },
  hi: {
    kicker: "डिस्कवरी यूनिवर्स · मुफ़्त पायलट", hero: "आपका अगला रोमांच यहीं से शुरू होता है।",
    lead: "तीन दुनिया, नौ गतिविधियाँ। जानें कि आप योजना कैसे बनाते हैं, जाँचते हैं और सुधार करते हैं।",
    private: "इस डिवाइस पर निजी", privateNote: "इस ब्राउज़र में सभी उपयोगकर्ताओं की प्रगति साझा रहती है। दूसरे बच्चे से पहले परिणाम मिटाएँ। नाम या भुगतान नहीं चाहिए।",
    age: "अपना सीखने का स्तर चुनें", agePrompt: "उम्र के हिसाब से खेल चुनें", otherAges: "अन्य अनुभव, 5–7 वर्ष भी", worlds: "दुनिया चुनें",
    missions: "गतिविधियाँ", ready: "खोज के लिए तैयार", done: "अभ्यास किया", explore: "मिशन शुरू करें", replay: "फिर अभ्यास करें",
    back: "नक्शे पर वापस", order: "आपका क्रम", undo: "पिछला कदम हटाएँ", reset: "चुनाव मिटाएँ",
    choose: "उत्तर चुनें", selected: "चुना गया", check: "मेरा तरीका जाँचें", correct: "अच्छा तर्क!",
    incorrect: "सुधार का एक मौका", explanation: "क्या सीख सकते हैं",
    retry: "दूसरा तरीका आज़माएँ", next: "अगला मिशन", report: "अभ्यास रिपोर्ट देखें",
    reportTitle: "आपके अभ्यास की रिपोर्ट", reportIntro: "इस आयु वर्ग की गतिविधियों का परिणाम। यह IQ, व्यक्तित्व, करियर या अन्य आयु वर्ग से तुलना नहीं है।",
    practiced: "किए गए मिशन", first: "पहले प्रयास में बिना संकेत सही", improved: "दोबारा प्रयास में सही", hinted: "संकेत लेकर किए प्रयास", hintButton: "संकेत चाहिए?",
    interest: "पसंद आए मिशन", noEvidence: "अभी पर्याप्त अभ्यास नहीं", high: "इस दुनिया में दो या अधिक कार्य बिना संकेत पहले प्रयास में सही हुए। निष्कर्ष से पहले नए सवाल आज़माएँ।", practice: "यहाँ नए उदाहरण आज़माएँ; कुछ कार्य क्षमता नहीं मापते।",
    parent: "अभिभावक के लिए", reportHint: "पूछें कौन सा मिशन अच्छा लगा, फीडबैक से क्या बदला और आगे क्या जानना चाहेंगे।",
    print: "निजी रिपोर्ट प्रिंट करें", interestQuestion: "क्या आपको यह मिशन पसंद आया?", yes: "हाँ, मज़ा आया", notNow: "खास नहीं",
    finish: "खोजी गई दुनिया", completion: "सभी 9 मिशन किए गए। एक्सप्लोरर बैज मिला — यह डेमो उपलब्धि है, मान्यता प्राप्त प्रमाणपत्र नहीं।",
    initial: "प्रगति केवल इस ब्राउज़र में है; ब्राउज़र डेटा मिटाने पर हट जाएगी।", help: "क्रम बनाने के लिए कार्ड चुनें। कीबोर्ड से भी चल सकता है।",
    nextPractice: "अगला उपयोगी मिशन", nextReasonRetry: "यह अभी सही हल नहीं हुआ। एक नया प्रयास मदद कर सकता है।", nextReasonNew: "और सीखने के लिए नई गतिविधि आज़माएँ।",
    enjoymentHeading: "विद्यार्थी ने खुद बताया कि क्या पसंद आया", enjoymentNote: "आपने इस दुनिया की गतिविधियाँ पसंद आने की बात कही। यह रुचि है, प्रतिभा का लेबल नहीं।",
    clearPractice: "सभी उम्र की स्थानीय प्रगति मिटाएँ", clearConfirm: "इस ब्राउज़र में सभी आयु वर्ग के परिणाम मिटाएँ? यह वापस नहीं होगा।",
    assessmentCta: "सोचने की चुनौती", assessmentSummary: "तीन नए हालात · निर्णय और उसका कारण चुनें", assessmentLocked: "सभी नौ मिशन हल करने पर खुलेगा", assessmentOpen: "नई चुनौती शुरू करें",
    results: "आपकी प्रगति", notScore: "ये नतीजे केवल इन गतिविधियों से संबंधित हैं; जन्मजात प्रतिभा या किसी क्षेत्र की योग्यता नहीं बताते।",
  },
  hinglish: {
    kicker: "DISCOVERY UNIVERSE · FREE PILOT", hero: "Aapka next adventure yahin se shuru hota hai!",
    lead: "3 worlds, 9 hands-on missions. Explore karo ki aap kaise plan, investigate aur improve karte ho.",
    private: "Isi device par private", privateNote: "Is browser par users ka practice data shared hai. Next learner se pehle clear karo. Account ya payment nahi chahiye.",
    age: "Apna learning level choose karo", agePrompt: "Age ke hisaab se adventure choose karo", otherAges: "Baaki experiences, ages 5–7 bhi", worlds: "Apni world choose karo",
    missions: "Missions", ready: "Explore karne ko ready", done: "Practiced", explore: "Mission shuru karo", replay: "Phir practice karo",
    back: "Map par wapas", order: "Aapka sequence", undo: "Last move undo", reset: "Choices clear karo",
    choose: "Answer choose karo", selected: "Selected", check: "Apna approach check karo", correct: "Great reasoning!",
    incorrect: "Improve karne ka mauka", explanation: "Kya seekha",
    retry: "Dusra approach try karo", next: "Next mission", report: "Learning snapshot dekho",
    reportTitle: "Aapki practice snapshot", reportIntro: "Sirf selected age band ke demo results. IQ, fixed talent, cross-age ranking ya future career prediction nahi.",
    practiced: "Missions attempted", first: "Bina hint first try solved", improved: "Retry par solved", hinted: "Hint-assisted attempts", hintButton: "Ek clue chahiye?",
    interest: "Pasand aaye missions", noEvidence: "Abhi practice evidence kam hai", high: "Is world mein 2 ya zyada tasks bina hints first try correct hue. New examples bhi try karo.", practice: "Is world ke naye examples try karo; kuch tasks ability measure nahi karte.",
    parent: "Parent / guardian ke liye", reportHint: "Poochhiye kaunsa mission interesting tha, feedback se kya badla aur next kya explore karna hai.",
    print: "Private snapshot print karo", interestQuestion: "Kya ye mission pasand aaya?", yes: "Haan, maza aaya", notNow: "Is baar nahi",
    finish: "Worlds explored", completion: "Saare 9 missions attempted! Explorer badge unlocked — ye demo milestone hai, accredited certificate nahi.",
    initial: "Progress local browser mein hai; browser data delete karne par hat jayegi.", help: "Sequence banane ke liye cards tap karo. Keyboard se bhi use kar sakte ho.",
    nextPractice: "Next useful mission", nextReasonRetry: "Ye mission abhi solve nahi hua. Ek naya attempt useful hoga.", nextReasonNew: "More evidence ke liye new challenge try karo.",
    enjoymentHeading: "Learner ne khud jo enjoy kiya", enjoymentNote: "Aapne is world ki activities enjoy karne ko bola. Ye interest hai, talent label nahi.",
    clearPractice: "Sab age groups ka local data delete karo", clearConfirm: "Is browser ke ALL age-band results delete karein? Undo nahi ho sakta.",
    assessmentCta: "Thinking Challenge", assessmentSummary: "3 new situations · action aur reason dono choose karo", assessmentLocked: "9 missions solve hone par unlock", assessmentOpen: "New challenges start karo",
    results: "Aapki progress", notScore: "Ye results sirf is practice se related hain, natural talent ya field suitability prove nahi karte.",
  },
} as const;

function readSaved(): Record<string, AdventureAttempt> {
  if (typeof window === "undefined") return {};
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const safe: Record<string, AdventureAttempt> = {};
    for (const mission of ALL_ADVENTURE_MISSIONS) {
      const item = raw[mission.id];
      if (item && typeof item.firstCorrect === "boolean" && typeof item.bestCorrect === "boolean" && Number.isInteger(item.attempts) && item.attempts > 0) {
        safe[mission.id] = {
          firstCorrect: item.firstCorrect,
          firstIndependent: typeof item.firstIndependent === "boolean" ? item.firstIndependent && item.firstCorrect : false,
          bestCorrect: item.bestCorrect,
          attempts: Math.min(item.attempts, 1000),
          hintsUsed: Number.isInteger(item.hintsUsed) && item.hintsUsed >= 0 ? Math.min(item.hintsUsed, 1000) : 0,
          enjoyed: typeof item.enjoyed === "boolean" ? item.enjoyed : null,
          updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : "",
        };
      }
    }
    return safe;
  } catch {
    return {};
  }
}

function readSavedTransfers(): Record<string, TransferAttempt> {
  if (typeof window === "undefined") return {};
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(TRANSFER_STORAGE_KEY) || "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const input = raw as Record<string, unknown>;
    const safe: Record<string, TransferAttempt> = {};
    for (const challenge of TRANSFER_CHALLENGES) {
      const item = input[challenge.id] as Partial<TransferAttempt> | undefined;
      if (!item || !Number.isInteger(item.attempts) || !item.attempts || item.attempts < 0
        || typeof item.firstCorrect !== "boolean" || typeof item.solved !== "boolean") continue;
      safe[challenge.id] = {
        attempts: Math.min(item.attempts, 100),
        firstCorrect: item.firstCorrect && item.solved,
        solved: item.solved,
        updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : "",
      };
    }
    return safe;
  } catch { return {}; }
}

function initialLocale(): AdventureLocale {
  if (typeof window === "undefined") return "hinglish";
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    return stored === "en" || stored === "hi" || stored === "hinglish" ? stored : "hinglish";
  } catch {
    return "hinglish";
  }
}

function initialBand(): AdventureAgeBand {
  if (typeof window === "undefined") return "11-13";
  try {
    const stored = window.localStorage.getItem(AGE_KEY);
    if (stored === "8-10" || stored === "11-13" || stored === "14-17") return stored;
  } catch { /* private browsing or storage disabled */ }
  return "11-13";
}

export default function DiscoveryAdventurePage() {
  const [locale, setLocale] = useState<AdventureLocale>(initialLocale);
  const [ageBand, setAgeBand] = useState<AdventureAgeBand>(initialBand);
  const [attempts, setAttempts] = useState<Record<string, AdventureAttempt>>(readSaved);
  const [transfers, setTransfers] = useState<Record<string, TransferAttempt>>(readSavedTransfers);
  const [showAssessment, setShowAssessment] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [optionOrder, setOptionOrder] = useState<string[]>([]);
  const [hintOpen, setHintOpen] = useState(false);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [showReport, setShowReport] = useState(false);
  const copy = words[locale];
  const availableMissions = useMemo(() => getAgeAdventureMissions(ageBand), [ageBand]);
  const current = availableMissions.find((mission) => mission.id === activeId) ?? null;
  const bandCopy = ADVENTURE_AGE_BANDS.find((band) => band.id === ageBand)!;
  const visibleOptions = current ? optionOrder.map((id) => current.options.find((option) => option.id === id)).filter((item): item is AdventureMission["options"][number] => Boolean(item)) : [];
  const totalAttempted = availableMissions.filter((mission) => attempts[mission.id]).length;
  const practiceSolved = availableMissions.filter((mission) => attempts[mission.id]?.bestCorrect).length;
  const transferSummary = summarizeTransfer(ageBand, transfers);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts)); } catch { /* storage disabled; play still works */ }
  }, [attempts]);

  useEffect(() => {
    if (activeId || showReport || showAssessment) {
      const focusTarget = document.getElementById(activeId ? "da-play-panel" : showAssessment ? "da-transfer-panel" : "da-report-panel");
      focusTarget?.focus();
    }
  }, [activeId, showReport, showAssessment]);

  useEffect(() => {
    try { window.localStorage.setItem(TRANSFER_STORAGE_KEY, JSON.stringify(transfers)); } catch { /* optional local storage */ }
  }, [transfers]);

  const changeLocale = (next: AdventureLocale) => {
    setLocale(next);
    try { window.localStorage.setItem(LOCALE_KEY, next); } catch { /* optional preference */ }
  };

  const chooseBand = (next: AdventureAgeBand) => {
    setAgeBand(next);
    setActiveId(null);
    setSelected([]);
    setChecked(null);
    setShowAssessment(false);
    setShowReport(false);
    setHintOpen(false);
    try { window.localStorage.setItem(AGE_KEY, next); } catch { /* preference only */ }
  };

  const openMission = (mission: AdventureMission) => {
    setActiveId(mission.id);
    setShowAssessment(false);
    setOptionOrder(shuffledAdventureOptions(mission, Date.now() ^ Math.floor(Math.random() * 1000000)).map((option) => option.id));
    setSelected([]);
    setHintOpen(false);
    setChecked(null);
    setShowReport(false);
  };

  const pick = (id: string) => {
    if (!current || checked !== null) return;
    if (current.mode === "sequence") {
      if (!selected.includes(id)) setSelected((previous) => [...previous, id]);
    } else if (current.mode === "single") {
      setSelected([id]);
    } else {
      setSelected((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : previous.length < current.answer.length ? [...previous, id] : previous);
    }
  };

  const check = () => {
    if (!current || checked !== null || selected.length !== current.answer.length) return;
    const correct = evaluateAdventureAnswer(current, selected);
    setAttempts((previous) => {
      const existing = previous[current.id];
      return {
        ...previous,
        [current.id]: {
          firstCorrect: existing ? existing.firstCorrect : correct,
          firstIndependent: existing ? existing.firstIndependent : correct && !hintOpen,
          bestCorrect: (existing?.bestCorrect ?? false) || correct,
          attempts: Math.min((existing?.attempts ?? 0) + 1, 1000),
          hintsUsed: Math.min((existing?.hintsUsed ?? 0) + Number(hintOpen), 1000),
          enjoyed: existing?.enjoyed ?? null,
          updatedAt: new Date().toISOString(),
        },
      };
    });
    setChecked(correct);
  };

  const setEnjoyed = (value: boolean) => {
    if (!current || checked === null) return;
    setAttempts((previous) => {
      const record = previous[current.id];
      return record ? { ...previous, [current.id]: { ...record, enjoyed: value } } : previous;
    });
  };

  const nextMission = () => {
    const next = availableMissions.find((mission) => !attempts[mission.id]);
    if (next) openMission(next);
    else { setActiveId(null); setShowReport(true); }
  };

  const backToMap = () => { setActiveId(null); setShowReport(false); setShowAssessment(false); setSelected([]); setHintOpen(false); setChecked(null); };
  const startAssessment = () => {
    if (practiceSolved !== 9) return;
    setActiveId(null); setShowReport(false); setShowAssessment(true);
  };
  const openReport = () => {
    setActiveId(null); setShowAssessment(false); setShowReport(true);
  };
  const clearLocalPractice = () => {
    if (!window.confirm(copy.clearConfirm)) return;
    setAttempts({});
    setTransfers({});
    backToMap();
    try { window.localStorage.removeItem(STORAGE_KEY); window.localStorage.removeItem(TRANSFER_STORAGE_KEY); } catch { /* storage optional */ }
  };
  const selectedOptions = selected.map((id) => current?.options.find((option) => option.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="discovery-adventure" data-age-band={ageBand} lang={locale === "hi" ? "hi-IN" : locale === "hinglish" ? "en-IN" : "en"}>
      <div className="da-sky" aria-hidden="true"><span className="da-orb da-orb-one" /><span className="da-orb da-orb-two" /><span className="da-orb da-orb-three" /></div>
      <header className="da-header">
        <a href="/" className="da-brand"><span aria-hidden="true">✦</span> AI for Students</a>
        <a href="/explorer" className="da-back-link"><ArrowLeft size={16} /> Explorer Lab</a>
      </header>
      <main className="da-shell">
        <section className="da-hero">
          <div className="da-hero-text">
            <span className="da-eyebrow"><Sparkles size={15} /> {copy.kicker}</span>
            <h1>{copy.hero}</h1>
            <p>{copy.lead}</p>
            <div className="da-tags"><span>🚀 {bandCopy.label[locale]}</span><span>🎮 {totalAttempted}/{availableMissions.length} {copy.missions}</span></div>
          </div>
          <div className="da-planet-art" aria-hidden="true"><span className="da-planet-ring" /><span className="da-planet-core">✦</span><span className="da-planet-satellite">🛸</span><span className="da-planet-star">✧</span></div>
        </section>

        <nav className="da-languages" aria-label="Choose language">
          {ADVENTURE_LOCALES.map((language) => <button type="button" key={language.id} aria-pressed={locale === language.id} className={locale === language.id ? "is-active" : ""} onClick={() => changeLocale(language.id)}>{language.label}</button>)}
        </nav>
        {!current && !showAssessment && !showReport && <section className="da-age-selector" aria-labelledby="da-age-title">
          <div className="da-age-intro"><span className="da-eyebrow">✦ {copy.age}</span><h2 id="da-age-title">{copy.agePrompt}</h2></div>
          <div className="da-age-buttons" role="group" aria-label={copy.agePrompt}>
            {ADVENTURE_AGE_BANDS.map((band) => <button type="button" key={band.id} className={"da-age-button" + (ageBand === band.id ? " is-selected" : "")} aria-pressed={ageBand === band.id} onClick={() => chooseBand(band.id)}>
              <strong>{band.label[locale]}</strong><small>{band.tagline[locale]}</small>
            </button>)}
          </div>
        </section>}

        {current ? (
          <section id="da-play-panel" tabIndex={-1} className="da-play-panel" aria-labelledby="da-mission-title">
            <button type="button" className="da-text-button" onClick={backToMap}><ChevronLeft size={17} /> {copy.back}</button>
            <div className={"da-play-heading da-" + current.world}>
              <div className="da-play-icon" aria-hidden="true">{ADVENTURE_WORLDS.find((world) => world.id === current.world)?.icon}</div>
              <div><span className="da-section-label">{bandCopy.label[locale]} · {current.world.toUpperCase()} · {copy.missions} {availableMissions.filter((mission) => mission.world === current.world).findIndex((mission) => mission.id === current.id) + 1}/3</span><h2 id="da-mission-title">{current.title[locale]}</h2></div>
            </div>
            <p className="da-story">{current.story[locale]}</p>
            <DiscoveryEvidenceScene missionId={current.id} locale={locale} />
            <DiscoveryAgeEvidenceScene missionId={current.id} locale={locale} />
            <h3 className="da-instruction">{current.instruction[locale]}</h3>

            {current.mode === "sequence" && (
              <div className="da-sequence-area">
                <div className="da-sequence-title">{copy.order}</div>
                <div className="da-sequence-steps" aria-label={copy.order}>
                  {current.answer.map((_, index) => <div key={index} className={"da-step " + (selectedOptions[index] ? "filled" : "")}><span>{index + 1}</span>{selectedOptions[index]?.label[locale] ?? "…"}</div>)}
                </div>
                <div className="da-sequence-actions">
                  <button type="button" disabled={!selected.length || checked !== null} onClick={() => setSelected((previous) => previous.slice(0, -1))}><Undo2 size={15} /> {copy.undo}</button>
                  <button type="button" disabled={!selected.length || checked !== null} onClick={() => setSelected([])}><RotateCcw size={15} /> {copy.reset}</button>
                </div>
              </div>
            )}

            <div className="da-choices" aria-label={copy.choose}>
              {visibleOptions.map((option, index) => {
                const active = selected.includes(option.id);
                const hidden = current.mode === "sequence" && active;
                return (
                  <button key={option.id} type="button" onClick={() => pick(option.id)} disabled={checked !== null || hidden}
                    aria-pressed={active && current.mode !== "sequence"}
                    className={"da-choice " + (active && current.mode !== "sequence" ? "is-selected" : "") + (hidden ? " is-placed" : "")}>
                    <span className="da-choice-marker">{active && current.mode !== "sequence" ? <CheckCircle2 size={20} /> : String.fromCharCode(65 + index)}</span>
                    <span>{option.label[locale]}</span>
                  </button>
                );
              })}
            </div>
            {current.mode === "sequence" && <p className="da-help">{copy.help}</p>}
            {checked === null && <div className="da-hint-area">
              <button type="button" className="da-hint-button" disabled={hintOpen} onClick={() => setHintOpen(true)}><Lightbulb size={17} /> {copy.hintButton}</button>
              {hintOpen && <p className="da-hint-text" role="note">{current.hint[locale]}</p>}
            </div>}
            {checked === null ? (
              <button type="button" className="da-primary-action" disabled={selected.length !== current.answer.length} onClick={check}>{copy.check} <ArrowRight size={17} /></button>
            ) : (
              <div className={"da-feedback " + (checked ? "is-correct" : "is-retry")} aria-live="polite">
                <h3>{checked ? "✨ " + copy.correct : "💡 " + copy.incorrect}</h3>
                <strong>{copy.explanation}</strong><p>{current.feedback[locale]}</p>
                <div className="da-interest">
                  <span>{copy.interestQuestion}</span>
                  <button type="button" aria-pressed={attempts[current.id]?.enjoyed === true} onClick={() => setEnjoyed(true)}>♥ {copy.yes}</button>
                  <button type="button" aria-pressed={attempts[current.id]?.enjoyed === false} onClick={() => setEnjoyed(false)}>{copy.notNow}</button>
                </div>
                <div className="da-feedback-actions">
                  <button type="button" className="da-secondary-action" onClick={() => { setSelected([]); setHintOpen(false); setChecked(null); }}><RotateCcw size={16} /> {copy.retry}</button>
                  <button type="button" className="da-primary-action" onClick={nextMission}>{totalAttempted === 9 ? copy.report : copy.next} <ArrowRight size={16} /></button>
                </div>
              </div>
            )}
          </section>
        ) : showAssessment ? (
          <DiscoveryTransferAssessment key={ageBand} ageBand={ageBand} locale={locale} saved={transfers}
            onBack={backToMap}
            onSave={(id, record) => setTransfers(previous => ({ ...previous, [id]: record }))}
            onReport={openReport} />
        ) : showReport ? (
          <DiscoveryParentReport
            ageBand={ageBand}
            locale={locale}
            attempts={attempts}
            transfers={transfers}
            onStartAssessment={startAssessment}
            onBack={backToMap}
            onClear={clearLocalPractice}
            onOpen={openMission}
          />
        ) : (
          <section className="da-map" aria-labelledby="da-worlds-heading">
            <div className="da-section-heading"><div><span className="da-eyebrow">✧ {copy.ready}</span><h2 id="da-worlds-heading">{copy.worlds}</h2></div><button type="button" className="da-text-button" onClick={() => setShowReport(true)}>{copy.report} <ArrowRight size={16} /></button></div>
            <div className="da-world-grid">
              {ADVENTURE_WORLDS.map((world, index) => {
                const missions = availableMissions.filter((mission) => mission.world === world.id);
                const completed = missions.filter((mission) => attempts[mission.id]).length;
                return (
                  <article className={"da-world-card da-" + world.accent} key={world.id}>
                    <div className="da-world-illustration" aria-hidden="true"><span className="da-world-sun" /><span className="da-world-icon">{world.icon}</span><span className="da-floating-dot" /></div>
                    <div className="da-world-content"><span className="da-world-number">WORLD 0{index + 1} · {completed}/3 {copy.done}</span><h3>{world.title[locale]}</h3><p>{describeAdventureWorld(world, ageBand, locale)}</p>
                      <div className="da-mission-list">{missions.map((mission, missionIndex) => <button type="button" className="da-mission-row" key={mission.id} onClick={() => openMission(mission)}>
                        <span className="da-mission-index">{attempts[mission.id]?.bestCorrect ? "✓" : attempts[mission.id] ? "↻" : String(missionIndex + 1).padStart(2, "0")}</span>
                        <span>{mission.title[locale]}</span><ArrowRight size={16} aria-hidden="true"/>
                      </button>)}</div>
                    </div>
                  </article>
                );
              })}
            </div>
            <section className="dc-map-assessment" aria-label={copy.assessmentCta}>
              <div className="dc-map-assessment-symbol" aria-hidden="true">✦</div>
              <div><span className="dc-completion-eyebrow">NEXT LEVEL · {transferSummary.solved}/3</span>
                <h3>{copy.assessmentCta}</h3><p>{copy.assessmentSummary}</p>
                {practiceSolved !== 9 && <small>{copy.assessmentLocked} ({practiceSolved}/9)</small>}
              </div>
              <button type="button" className="da-primary-action" disabled={practiceSolved !== 9} onClick={startAssessment}>{copy.assessmentOpen} <ArrowRight size={17}/></button>
            </section>
            <div className="da-map-footer"><div><LockKeyhole size={21} /><p><strong>{copy.private}</strong><span>{copy.privateNote}</span></p></div><p>{copy.initial}</p><a href="/explorer">{copy.otherAges} <ArrowRight size={15} /></a>{totalAttempted > 0 && <button type="button" className="da-delete-action" onClick={clearLocalPractice}>{copy.clearPractice}</button>}</div>
          </section>
        )}
      </main>
      <footer className="da-footer"><span>AI for Students · Discovery Universe</span><span>Practice is evidence. Labels are not.</span></footer>
    </div>
  );
}
