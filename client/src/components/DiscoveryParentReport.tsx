import { ArrowLeft, ArrowRight, Award, CheckCircle2, FileText, LockKeyhole, Printer, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import {
  PRACTICE_STATUS_LABELS,
  buildAdventurePracticeReport,
  getAdventureSkillLabel,
} from "@/data/discoveryReport";
import { ADVENTURE_AGE_BANDS, type AdventureAgeBand, type AdventureAttempt, type AdventureLocale, type AdventureMission } from "@/data/discoveryAdventure";

const ui = {
  en: {
    eyebrow: "PRIVATE LEARNING EVIDENCE · DEMO",
    heading: "Parent & learner practice report",
    intro: "A transparent record of these nine activities—not a diagnosis, aptitude score, intelligence test or career predictor.",
    attempted: "Activities tried", solved: "Eventually solved", independent: "First try, no hints",
    secondTry: "Solved after retry", firstHint: "First try with hint", hints: "Hint-assisted submitted attempts",
    interest: "Learner said they enjoyed", total: "of 9",
    progress: "Progress through this age-band adventure",
    key: "What these numbers mean",
    keyBody: "A correct first answer, a hint-assisted answer and a later corrected answer are different kinds of practice evidence. The questions are not a validated assessment.",
    byWorld: "Learning evidence by world",
    solvedWorld: "Solved", firstWorld: "First try, no hint",
    evidence: "Activity-by-activity record",
    none: "No practice recorded yet for this world.",
    parent: "Conversation starters for families",
    parentNote: "Use these questions to encourage the learner to explain their thinking, not to label their abilities.",
    next: "A useful next activity",
    nextText: "Continue with an unattempted challenge or revisit an unsolved one.",
    open: "Open mission",
    interestTitle: "Interests volunteered by the learner",
    interestBody: "The learner explicitly said they enjoyed an activity in this world. Enjoyment is not a measure of talent.",
    pending: "Keep practicing to unlock the local milestone",
    completed: "Local adventure milestone achieved",
    earned: "All nine age-band missions were solved at least once. This is a browser-local practice record.",
    remaining: "missions still need a correct solution",
    notCredential: "NOT A VERIFIED CERTIFICATE • NOT ACCREDITED • NOT APTITUDE OR CAREER ADVICE",
    issued: "Completion date (from this browser)",
    source: "Source: local browser records; editable or removable by the device user. No server verification, identity checking or official credential.",
    print: "Print or save a private copy", clear: "Erase this browser's practice results",
    back: "Back to world map", noClaim: "No completion milestone is awarded for simply opening or attempting every activity.",
    noteAll: "Shared-device reminder: records from multiple children can mix in this browser. Clear them before another learner.",
    skill: "Practice area",
  },
  hi: {
    eyebrow: "निजी सीखने का रिकॉर्ड · डेमो",
    heading: "अभिभावक और विद्यार्थी की अभ्यास रिपोर्ट",
    intro: "इन नौ गतिविधियों का स्पष्ट रिकॉर्ड—यह IQ, व्यक्तित्व, योग्यता या करियर की भविष्यवाणी नहीं है।",
    attempted: "आज़माई गई गतिविधियाँ", solved: "आख़िरकार सही हुए", independent: "पहली बार बिना संकेत सही",
    secondTry: "फिर कोशिश में सही", firstHint: "पहली बार संकेत के साथ", hints: "संकेत लेकर जाँचे गए प्रयास",
    interest: "विद्यार्थी ने पसंद बताए", total: "कुल 9 में से",
    progress: "इस आयु वर्ग के अभ्यास की प्रगति",
    key: "इन संख्याओं का क्या मतलब है",
    keyBody: "पहला सही उत्तर, संकेत वाला उत्तर और सुधार के बाद सही उत्तर अलग अभ्यास परिणाम हैं। यह मान्यीकृत क्षमता परीक्षण नहीं है।",
    byWorld: "हर दुनिया के अनुसार अभ्यास",
    solvedWorld: "सही हुए", firstWorld: "पहली बार बिना संकेत",
    evidence: "गतिविधियों का अलग-अलग रिकॉर्ड",
    none: "इस दुनिया में अभी कोई अभ्यास नहीं हुआ।",
    parent: "परिवार के लिए बातचीत के सवाल",
    parentNote: "विद्यार्थी को अपना सोचने का तरीका समझाने दें, उसकी क्षमता का स्थायी लेबल न लगाएँ।",
    next: "अगली उपयोगी गतिविधि",
    nextText: "नई गतिविधि करें या अधूरी गतिविधि दोहराएँ।",
    open: "मिशन खोलें",
    interestTitle: "विद्यार्थी ने खुद जो रुचि बताई",
    interestBody: "विद्यार्थी ने खुद कहा कि इस दुनिया की गतिविधि पसंद आई। पसंद आना प्रतिभा का प्रमाण नहीं है।",
    pending: "स्थानीय उपलब्धि पाने के लिए अभ्यास जारी रखें",
    completed: "स्थानीय अभ्यास उपलब्धि पूरी हुई",
    earned: "इस आयु वर्ग के सभी नौ मिशन कम से कम एक बार सही हल हुए। यह ब्राउज़र का अभ्यास रिकॉर्ड है।",
    remaining: "मिशनों में अभी सही उत्तर चाहिए",
    notCredential: "सत्यापित प्रमाणपत्र नहीं • मान्यता प्राप्त नहीं • करियर/योग्यता सलाह नहीं",
    issued: "पूर्णता की तारीख़ (इस ब्राउज़र से)",
    source: "स्रोत: ब्राउज़र का स्थानीय रिकॉर्ड। उपयोगकर्ता इसे बदल या हटा सकता है। पहचान या सर्वर सत्यापन नहीं हुआ है।",
    print: "निजी रिपोर्ट प्रिंट या सेव करें", clear: "इस ब्राउज़र का अभ्यास रिकॉर्ड मिटाएँ",
    back: "दुनिया के नक्शे पर वापस", noClaim: "सिर्फ सभी गतिविधियाँ खोलने या आज़माने से उपलब्धि नहीं मिलेगी।",
    noteAll: "साझा डिवाइस पर अलग बच्चों के परिणाम मिल सकते हैं। अगले विद्यार्थी से पहले मिटाएँ।",
    skill: "अभ्यास क्षेत्र",
  },
  hinglish: {
    eyebrow: "PRIVATE LEARNING EVIDENCE · DEMO",
    heading: "Parent aur learner practice report",
    intro: "In 9 activities ka transparent record. Ye IQ, fixed talent, aptitude test ya career prediction nahi hai.",
    attempted: "Activities tried", solved: "Eventually solved", independent: "First try, no hint",
    secondTry: "Retry ke baad solved", firstHint: "First try with hint", hints: "Hint-assisted submitted attempts",
    interest: "Learner ne enjoy bola", total: "out of 9",
    progress: "Selected age-band practice progress",
    key: "Numbers ka meaning",
    keyBody: "First correct answer, hint-assisted answer aur retry ke baad correct alag evidence hain. Ye validated ability test nahi hai.",
    byWorld: "World-wise learning evidence",
    solvedWorld: "Solved", firstWorld: "First try, no hint",
    evidence: "Mission-wise practice record",
    none: "Is world mein abhi practice record nahi.",
    parent: "Parents ke liye conversation starters",
    parentNote: "Student ko apni thinking explain karne dein, permanent ability label nahi.",
    next: "Next useful activity",
    nextText: "Naya mission try karo ya unsolved mission revise karo.",
    open: "Mission open karo",
    interestTitle: "Learner ne khud interest bataya",
    interestBody: "Learner ne is world ki activity enjoy karne ko kaha. Enjoyment talent ka proof nahi.",
    pending: "Local milestone unlock karne ke liye practice complete karo",
    completed: "Local adventure milestone achieved",
    earned: "Is age band ke sab 9 missions kam se kam ek baar correctly solve hue. Ye browser-local practice record hai.",
    remaining: "missions abhi correctly solve karne hain",
    notCredential: "NOT A VERIFIED CERTIFICATE • NOT ACCREDITED • NO CAREER PREDICTION",
    issued: "Completion date (is browser se)",
    source: "Source: local browser record. User isko change/delete kar sakta hai. No server verification, identity check ya official credential.",
    print: "Private report print/save karo", clear: "Browser ka local practice data delete karo",
    back: "World map par wapas", noClaim: "Sirf saare missions attempt karne se milestone unlock nahi hoga.",
    noteAll: "Shared device par alag students ka record mix ho sakta hai. Next learner se pehle clear karo.",
    skill: "Practice area",
  },
} as const;

type Props = {
  ageBand: AdventureAgeBand;
  locale: AdventureLocale;
  attempts: Record<string, AdventureAttempt>;
  onBack: () => void;
  onClear: () => void;
  onOpen: (mission: AdventureMission) => void;
};

export default function DiscoveryParentReport({ ageBand, locale, attempts, onBack, onClear, onOpen }: Props) {
  const report = buildAdventurePracticeReport(ageBand, attempts);
  const copy = ui[locale];
  const band = ADVENTURE_AGE_BANDS.find((item) => item.id === ageBand);
  const remaining = report.total - report.solved;
  const completedDate = report.completedAt
    ? new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(report.completedAt))
    : null;

  return (
    <section className="da-parent-report" id="da-report-panel" tabIndex={-1} aria-labelledby="da-parent-report-title">
      <div className="da-report-toolbar">
        <button type="button" className="da-text-button" onClick={onBack}><ArrowLeft size={16} /> {copy.back}</button>
        <div className="da-report-controls">
          <button type="button" className="da-secondary-action" onClick={() => window.print()}><Printer size={16} /> {copy.print}</button>
          {report.attempted > 0 && <button type="button" className="da-delete-action" onClick={onClear}><Trash2 size={15} /> {copy.clear}</button>}
        </div>
      </div>

      <header className="da-report-cover">
        <span className="da-eyebrow"><FileText size={15} /> {copy.eyebrow}</span>
        <h2 id="da-parent-report-title">{copy.heading}</h2>
        <p>{copy.intro}</p>
        <strong className="da-age-pill">{band?.label[locale] ?? ageBand}</strong>
      </header>

      <div className="da-report-metrics" aria-label={copy.progress}>
        <div><strong>{report.attempted}/{report.total}</strong><span>{copy.attempted}</span></div>
        <div><strong>{report.solved}/{report.total}</strong><span>{copy.solved}</span></div>
        <div><strong>{report.independentFirst}</strong><span>{copy.independent}</span></div>
        <div><strong>{report.improvedAfterRetry}</strong><span>{copy.secondTry}</span></div>
      </div>

      <div className="da-progress-meter">
        <div className="da-progress-label"><strong>{copy.progress}</strong><span>{report.solved}/{report.total}</span></div>
        <div className="da-progress-track" role="progressbar" aria-label={copy.progress} aria-valuemin={0} aria-valuemax={report.total} aria-valuenow={report.solved}><div style={{ width: (100 * report.solved / Math.max(report.total, 1)) + "%" }} /></div>
      </div>

      <div className="da-report-methodology">
        <LockKeyhole size={20} />
        <div><strong>{copy.key}</strong><p>{copy.keyBody}</p>
          <p>{copy.firstHint}: {report.firstWithHint} · {copy.hints}: {report.totalHints} · {copy.interest}: {report.reportedEnjoyment}/{report.reviewedInterest}</p>
        </div>
      </div>

      <section aria-labelledby="da-world-report-heading" className="da-world-evidence">
        <h3 id="da-world-report-heading">{copy.byWorld}</h3>
        <div className="da-report-grid">
          {report.worldDetails.map((world) => <article className="da-report-card" key={world.id}>
            <span className="da-report-symbol" aria-hidden="true">{world.icon}</span>
            <h4>{world.title[locale]}</h4>
            <div className="da-world-progress"><span>{copy.solvedWorld}</span><strong>{world.solved}/3</strong></div>
            <div className="da-progress-track" aria-hidden="true"><div style={{ width: (world.solved / 3 * 100) + "%" }} /></div>
            <p className="da-world-small">{copy.firstWorld}: {world.independentFirst}/3</p>
            <div className="da-mission-evidence">
              {world.entries.map((row) => <div key={row.mission.id} className="da-evidence-row">
                <span aria-hidden="true">{row.attempt?.bestCorrect ? <CheckCircle2 size={16} /> : row.attempt ? <RotateCcw size={16} /> : "○"}</span>
                <div>
                  <strong>{row.mission.title[locale]}</strong>
                  <small>{getAdventureSkillLabel(row.mission.skill, locale)} · {PRACTICE_STATUS_LABELS[row.status][locale]}</small>
                </div>
              </div>)}
            </div>
          </article>)}
        </div>
      </section>

      <section className="da-parent-conversation" aria-labelledby="da-conversation-heading">
        <div className="da-panel-heading"><span>💬</span><div><h3 id="da-conversation-heading">{copy.parent}</h3><p>{copy.parentNote}</p></div></div>
        {report.worldDetails.map((world) => <p key={world.id}><strong>{world.title[locale]}:</strong> {world.familyPrompt[locale]}</p>)}
      </section>

      {report.worldDetails.filter((world) => world.enjoyed > 0).map((world) => <div className="da-enjoyed-note" key={world.id}>
        <span aria-hidden="true">{world.icon}</span>
        <div><strong>{copy.interestTitle}: {world.title[locale]}</strong><p>{copy.interestBody}</p></div>
      </div>)}

      {report.nextMission && <section className="da-suggestion" aria-labelledby="da-next-step-heading">
        <span className="da-eyebrow"><Sparkles size={15} /> {copy.next}</span>
        <h3 id="da-next-step-heading">{report.nextMission.title[locale]}</h3><p>{copy.nextText}</p>
        <button className="da-primary-action" type="button" onClick={() => onOpen(report.nextMission!)}>{copy.open}<ArrowRight size={16} /></button>
      </section>}

      <section className={"da-local-milestone" + (report.completed ? " is-earned" : "")} aria-label={report.completed ? copy.completed : copy.pending}>
        <div className="da-milestone-symbol"><Award size={36} aria-hidden="true" /></div>
        <div>
          <span className="da-eyebrow">DISCOVERY UNIVERSE · LOCAL PRACTICE MILESTONE</span>
          <h3>{report.completed ? copy.completed : copy.pending}</h3>
          <p>{report.completed ? copy.earned : remaining + " " + copy.remaining + ". " + copy.noClaim}</p>
          {completedDate && <p><strong>{copy.issued}:</strong> {completedDate}</p>}
          <strong className="da-noncredential">{copy.notCredential}</strong>
        </div>
      </section>
      <p className="da-privacy-footnote">{copy.source} {copy.noteAll}</p>
    </section>
  );
}
