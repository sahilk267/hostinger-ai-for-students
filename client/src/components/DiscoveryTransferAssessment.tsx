import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BrainCircuit, CheckCircle2, CircleHelp, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { ADVENTURE_AGE_BANDS, type AdventureAgeBand, type AdventureLocale } from "@/data/discoveryAdventure";
import { evaluateTransferChallenge, gradeTransferChallenge, getTransferChallenges, submitTransferAttempt, summarizeTransfer, type TransferAttempt } from "@/data/discoveryTransfer";
import "./discoveryCompletion.css";

const words = {
  en: {
    eyebrow: "NEXT LEVEL · APPLY WHAT YOU LEARNED",
    title: "The Thinking Challenge",
    description: "Three fresh situations. For each, choose an action AND the reason behind it. No hints; revising is always allowed.",
    disclosure: "This is self-guided browser practice, not an exam, intelligence test or verified qualification.",
    decision: "1 · What would you do?", reason: "2 · Why is that a good decision?",
    check: "Check my reasoning", next: "Next challenge", report: "See my learning report",
    back: "Back to adventure", correct: "Both parts fit!", retry: "Not quite yet",
    answer: "What this situation teaches", retryButton: "Revise both choices",
    status: "New-situation practice", solved: "Solved", untried: "Not yet solved",
    first: "First-try solutions", completed: "All three transfer challenges solved!",
    note: "Both the decision and its explanation must be correct. A retry counts as improvement, not as a first-try solution.",
    parent: "Try this together at home", progress: "Challenges solved", done: "Already solved",
    reviewBoth: "Recheck the action AND why it helps. Try a different pair.",
    reviewAction: "Revisit the action. Think about the next practical step.",
    reviewReason: "Revisit the reason. Does it explain why your action works?",
    noSpoiler: "The worked explanation appears after both parts are solved, so you can try again independently.",
  },
  hi: {
    eyebrow: "अगला स्तर · सीखी बातें लागू करें",
    title: "सोचने की चुनौती",
    description: "तीन नए हालात। हर बार निर्णय और उसका कारण दोनों चुनें। संकेत नहीं हैं, दोबारा प्रयास कर सकते हैं।",
    disclosure: "यह इस ब्राउज़र का स्व-अभ्यास है, परीक्षा, IQ टेस्ट या सत्यापित योग्यता नहीं।",
    decision: "1 · आप क्या करेंगे?", reason: "2 · यह निर्णय क्यों अच्छा है?",
    check: "मेरा तर्क जाँचें", next: "अगली चुनौती", report: "अपनी रिपोर्ट देखें",
    back: "एडवेंचर में वापस", correct: "दोनों हिस्से सही हैं!", retry: "फिर सोचें",
    answer: "इस हालात से क्या सीखा", retryButton: "दोनों चुनाव फिर करें",
    status: "नई परिस्थिति का अभ्यास", solved: "सही हल हुआ", untried: "अभी सही नहीं",
    first: "पहले प्रयास में सही", completed: "तीनों नई चुनौतियाँ हल हुईं!",
    note: "निर्णय और कारण दोनों सही चाहिए। फिर प्रयास में सही होना सुधार है, पहली बार सही होना नहीं।",
    parent: "घर पर साथ में आज़माएँ", progress: "हल हुई चुनौतियाँ", done: "पहले से हल है",
    reviewBoth: "निर्णय और उसका कारण दोनों फिर जाँचें। एक नया जोड़ा चुनें।",
    reviewAction: "निर्णय दोबारा सोचें। अगला उपयोगी कदम क्या है?",
    reviewReason: "कारण दोबारा सोचें। यह निर्णय क्यों मदद करेगा?",
    noSpoiler: "दोनों हिस्से सही होने के बाद पूरा समाधान दिखेगा, ताकि आप खुद फिर कोशिश कर सकें।",
  },
  hinglish: {
    eyebrow: "NEXT LEVEL · JO SEEKHA USE APPLY KARO",
    title: "Thinking Challenge",
    description: "3 fresh situations. Har baar action aur uska reason dono choose karo. No hints; retry allowed hai.",
    disclosure: "Ye self-guided browser practice hai, IQ test, verified exam ya official qualification nahi.",
    decision: "1 · Aap kya karoge?", reason: "2 · Ye decision sahi kyon hai?",
    check: "Reasoning check karo", next: "Next challenge", report: "Learning report dekho",
    back: "Adventure par wapas", correct: "Dono parts sahi!", retry: "Ek baar aur socho",
    answer: "Is situation se kya seekha", retryButton: "Dono choices revise karo",
    status: "New situation practice", solved: "Solved", untried: "Abhi solve nahi",
    first: "First-try solutions", completed: "Saare 3 transfer challenges solve ho gaye!",
    note: "Decision aur reason dono correct chahiye. Retry improvement hai, first-try success nahi.",
    parent: "Ghar par saath try karo", progress: "Challenges solved", done: "Already solved",
    reviewBoth: "Action aur reason dono phir check karo. Naya pair try karo.",
    reviewAction: "Action revise karo. Practical next step kya hoga?",
    reviewReason: "Reason revise karo. Kya ye explain karta hai ki action helpful kyon hai?",
    noSpoiler: "Dono parts solve hone ke baad hi full explanation dikhega, taaki aap khud retry kar sako.",
  },
} as const;

type Props = {
  ageBand: AdventureAgeBand;
  locale: AdventureLocale;
  saved: Record<string, TransferAttempt>;
  onSave: (id: string, record: TransferAttempt) => void;
  onBack: () => void;
  onReport: () => void;
};
export default function DiscoveryTransferAssessment({ ageBand, locale, saved, onSave, onBack, onReport }: Props) {
  const challenges = useMemo(() => getTransferChallenges(ageBand), [ageBand]);
  const [active, setActive] = useState(0);
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [result, setResult] = useState<ReturnType<typeof gradeTransferChallenge> | null>(null);
  const current = challenges[active];
  const copy = words[locale];
  const summary = summarizeTransfer(ageBand, saved);
  const band = ADVENTURE_AGE_BANDS.find(item => item.id === ageBand);

  if (!current) return null;
  const alreadySolved = Boolean(saved[current.id]?.solved);

  const move = (index: number) => {
    setActive(index);
    setDecision("");
    setReason("");
    setResult(null);
  };
  const check = () => {
    if (!decision || !reason || alreadySolved || result !== null) return;
    const correct = evaluateTransferChallenge(current, decision, reason);
    onSave(current.id, submitTransferAttempt(saved[current.id], current, decision, reason, new Date().toISOString()));
    setResult({ ...gradeTransferChallenge(current, decision, reason), correct });
  };
  const goNext = () => {
    const next = challenges.findIndex((challenge, index) => index > active && !saved[challenge.id]?.solved);
    const other = challenges.findIndex(challenge => !saved[challenge.id]?.solved);
    if (next >= 0) move(next);
    else if (other >= 0) move(other);
    else onReport();
  };
  return <section className="dc-transfer" id="da-transfer-panel" tabIndex={-1} aria-labelledby="dc-transfer-title">
    <button type="button" className="da-text-button" onClick={onBack}><ArrowLeft size={17} /> {copy.back}</button>
    <div className="dc-transfer-hero">
      <span className="dc-completion-eyebrow"><BrainCircuit size={17} /> {copy.eyebrow}</span>
      <h2 id="dc-transfer-title">{copy.title}</h2>
      <p>{copy.description}</p>
      <div className="dc-transfer-meta"><span>{band?.label[locale]}</span><span><CheckCircle2 size={16}/> {summary.solved}/{summary.total} {copy.progress}</span></div>
    </div>
    <div className="dc-transfer-steps" role="group" aria-label={copy.status}>
      {challenges.map((challenge, index) => <button type="button" key={challenge.id}
        aria-pressed={index === active} className={"dc-transfer-tab" + (index === active ? " is-current" : "")}
        onClick={() => move(index)}>
        <span>{saved[challenge.id]?.solved ? <CheckCircle2 size={19} /> : challenge.icon}</span>
        <strong>{index + 1}</strong><small>{saved[challenge.id]?.solved ? copy.solved : copy.untried}</small>
      </button>)}
    </div>

    <article className="dc-transfer-question" key={current.id}>
      <div className="dc-transfer-question-title"><span className="dc-transfer-icon" aria-hidden="true">{current.icon}</span><div><span>{active + 1} / {challenges.length} · {current.world}</span><h3>{current.title[locale]}</h3></div></div>
      <p className="dc-transfer-story">{current.situation[locale]}</p>
      <fieldset className="dc-transfer-options" disabled={alreadySolved || result !== null}>
        <legend>{copy.decision}</legend>
        <p>{current.question[locale]}</p>
        {current.decisions.map(option => <label key={option.id} className={"dc-transfer-choice" + (decision === option.id ? " is-selected" : "")}>
          <input type="radio" name={"decision-" + current.id} value={option.id} checked={decision === option.id} onChange={() => setDecision(option.id)}/>
          <span>{option.label[locale]}</span>
        </label>)}
      </fieldset>
      <fieldset className="dc-transfer-options" disabled={alreadySolved || result !== null}>
        <legend>{copy.reason}</legend>
        <p>{current.whyQuestion[locale]}</p>
        {current.reasons.map(option => <label key={option.id} className={"dc-transfer-choice" + (reason === option.id ? " is-selected" : "")}>
          <input type="radio" name={"reason-" + current.id} value={option.id} checked={reason === option.id} onChange={() => setReason(option.id)}/>
          <span>{option.label[locale]}</span>
        </label>)}
      </fieldset>

      {result === null && !alreadySolved && <button type="button" className="da-primary-action" onClick={check} disabled={!decision || !reason}>{copy.check}<ArrowRight size={17} /></button>}
      {(result !== null || alreadySolved) && <div className={"dc-transfer-feedback" + (result?.correct === false ? " is-revise" : "")} role="status" aria-live="polite">
        <strong>{result?.correct === false ? <RotateCcw size={18}/> : <BadgeCheck size={19}/>} {result?.correct === false ? copy.retry : copy.correct}</strong>
        {(result?.correct || alreadySolved) ? <>
          <p><b>{copy.answer}:</b> {current.explanation[locale]}</p>
          <p><b>{copy.parent}:</b> {current.parentActivity[locale]}</p>
        </> : result ? <>
          <p>{!result.decisionCorrect && !result.reasonCorrect ? copy.reviewBoth : !result.decisionCorrect ? copy.reviewAction : copy.reviewReason}</p>
          <p className="dc-transfer-no-spoiler">{copy.noSpoiler}</p>
        </> : null}
        <div className="dc-transfer-feedback-actions">
          {result?.correct === false && <button className="da-secondary-action" type="button" onClick={() => {setDecision("");setReason("");setResult(null)}}><RotateCcw size={16}/>{copy.retryButton}</button>}
          {(result?.correct === true || alreadySolved) && <button className="da-primary-action" type="button" onClick={goNext}>{summary.completed ? copy.report : copy.next}<ArrowRight size={16}/></button>}
        </div>
      </div>}
    </article>
    {summary.completed && <div className="dc-transfer-finished"><Sparkles size={23}/><strong>{copy.completed}</strong><button type="button" onClick={onReport}>{copy.report}<ArrowRight size={16}/></button></div>}
    <div className="dc-transfer-disclaimer"><ShieldCheck size={18}/><p>{copy.note} {copy.disclosure}</p></div>
  </section>;
}
