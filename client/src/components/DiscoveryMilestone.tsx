import { useEffect, useRef } from "react";
import { ArrowLeft, Award, CheckCircle2, ClipboardCheck, Printer, ShieldAlert, Sparkles } from "lucide-react";
import { ADVENTURE_AGE_BANDS, type AdventureAgeBand, type AdventureLocale } from "@/data/discoveryAdventure";
import type { buildAdventurePracticeReport } from "@/data/discoveryReport";
import "./discoveryCompletion.css";

const words = {
  en: {
    edition: "DISCOVERY UNIVERSE · LEARNING SHOWCASE",
    name: "Learning milestone",
    line: "Curiosity in action. Thinking you can explain.",
    achieved: "All twelve practice tasks completed",
    introduction: "A record of practice across three learning worlds, followed by three new action-and-reason challenges.",
    mission: "Practice missions", transfer: "Reasoning challenges", first: "New challenges correct on first try",
    worlds: "Learning worlds explored", date: "Recorded completion date",
    private: "Private browser-local recognition",
    disclaimer: "NOT AN ACCREDITED OR VERIFIED CERTIFICATE",
    foot: "Based on editable data stored in this browser. No identity verification, independent assessment, official accreditation or public credential. Never use this milestone to make career or aptitude decisions.",
    print: "Print this private milestone", back: "Back to family report",
    age: "Learning group", achievement: "Discovery Practice Finisher",
    explain: "A moment to celebrate effort and thoughtful revision—not a rank or intelligence score.",
    keepGoing: "Your next chapter", familyPlan: "Keep building these skills with three short family activities, ordered by this browser's practice evidence.",
    openPlan: "Open my family growth plan",
  },
  hi: {
    edition: "डिस्कवरी यूनिवर्स · सीखने की झलक",
    name: "सीखने की उपलब्धि",
    line: "नई जिज्ञासा। समझाकर बताई गई सोच।",
    achieved: "सभी बारह अभ्यास कार्य पूरे हुए",
    introduction: "तीन सीखने की दुनियाओं में अभ्यास और तीन नई परिस्थिति-आधारित तर्क चुनौतियों का रिकॉर्ड।",
    mission: "अभ्यास मिशन", transfer: "तर्क चुनौतियाँ", first: "पहले प्रयास में नई चुनौतियाँ सही",
    worlds: "खोजी गई दुनिया", date: "इस ब्राउज़र की पूर्णता तारीख़",
    private: "इस ब्राउज़र की निजी उपलब्धि",
    disclaimer: "मान्यता प्राप्त या सत्यापित प्रमाणपत्र नहीं",
    foot: "ब्राउज़र के बदल सकने वाले डेटा पर आधारित है। पहचान, स्वतंत्र परीक्षा या आधिकारिक मान्यता सत्यापित नहीं हुई। इससे करियर या क्षमता का निष्कर्ष न निकालें।",
    print: "निजी उपलब्धि प्रिंट करें", back: "परिवार की रिपोर्ट देखें",
    age: "सीखने का समूह", achievement: "डिस्कवरी अभ्यास पूरा किया",
    explain: "प्रयास और सुधार का उत्सव—रैंकिंग या बुद्धि के अंक नहीं।",
    keepGoing: "आगे क्या करें", familyPlan: "इस ब्राउज़र के अभ्यास के अनुसार तय की गई तीन छोटी पारिवारिक गतिविधियों से सीख जारी रखें।",
    openPlan: "परिवार का अभ्यास प्लान देखें",
  },
  hinglish: {
    edition: "DISCOVERY UNIVERSE · LEARNING SHOWCASE",
    name: "Learning milestone",
    line: "Curiosity in action. Thinking ko explain karo.",
    achieved: "Saare 12 practice tasks complete hue",
    introduction: "3 learning worlds mein practice aur 3 naye action-and-reason challenges ka record.",
    mission: "Practice missions", transfer: "Reasoning challenges", first: "New challenges first try solved",
    worlds: "Worlds explored", date: "Browser ki completion date",
    private: "Private browser-local recognition",
    disclaimer: "NOT AN ACCREDITED OR VERIFIED CERTIFICATE",
    foot: "Ye browser ke editable data par based hai. Identity, independent assessment ya accreditation verify nahi hui. Career ya aptitude decision ke liye use mat karo.",
    print: "Private milestone print karo", back: "Family report par wapas",
    age: "Learning group", achievement: "Discovery Practice Finisher",
    explain: "Effort aur thoughtful revision celebrate karo—ye rank ya IQ score nahi hai.",
    keepGoing: "Next chapter", familyPlan: "Browser ke practice evidence ke basis par ordered 3 family activities se continue karo.",
    openPlan: "Family growth plan dekho",
  },
} as const;

type Report = ReturnType<typeof buildAdventurePracticeReport>;
type Props = { locale: AdventureLocale; ageBand: AdventureAgeBand; report: Report; onBack: () => void };

export default function DiscoveryMilestone({ locale, ageBand, report, onBack }: Props) {
  const headingRef = useRef<HTMLElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  if (!report.showcaseReady) return null;
  const copy = words[locale];
  const band = ADVENTURE_AGE_BANDS.find(item => item.id === ageBand);
  const date = report.showcaseCompletedAt
    ? new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(new Date(report.showcaseCompletedAt))
    : null;
  return <section className="dc-certificate-view" ref={headingRef} tabIndex={-1} id="da-report-panel" aria-labelledby="dc-certificate-title">
    <div className="dc-certificate-actions">
      <button className="da-secondary-action" type="button" onClick={onBack}><ArrowLeft size={16}/>{copy.back}</button>
      <button className="da-primary-action" type="button" onClick={() => window.print()}><Printer size={17}/>{copy.print}</button>
    </div>

    <article className="dc-certificate" aria-label={copy.private}>
      <div className="dc-certificate-orbit dc-certificate-orbit-one" aria-hidden="true"/>
      <div className="dc-certificate-orbit dc-certificate-orbit-two" aria-hidden="true"/>
      <div className="dc-certificate-inner">
        <div className="dc-certificate-topline"><span className="dc-certificate-logo">✦</span><span>{copy.edition}</span><span className="dc-certificate-star" aria-hidden="true">✧✦✧</span></div>
        <div className="dc-certificate-medallion" aria-hidden="true"><Award size={52}/><span>12/12</span></div>
        <p className="dc-certificate-kicker">{copy.private}</p>
        <h2 id="dc-certificate-title">{copy.name}</h2>
        <p className="dc-certificate-line">{copy.line}</p>
        <div className="dc-certificate-achievement"><Sparkles size={18}/>{copy.achievement}</div>
        <div className="dc-certificate-age">{copy.age}: <strong>{band?.label[locale] ?? ageBand}</strong></div>
        <p className="dc-certificate-intro">{copy.introduction}</p>
        <div className="dc-certificate-stats">
          <div><CheckCircle2 size={21}/><strong>{report.solved}/9</strong><span>{copy.mission}</span></div>
          <div><ClipboardCheck size={21}/><strong>{report.transfer.solved}/3</strong><span>{copy.transfer}</span></div>
          <div><Sparkles size={21}/><strong>{report.transfer.firstTry}/3</strong><span>{copy.first}</span></div>
        </div>
        <div className="dc-certificate-worlds">
          {report.worldDetails.map(world => <span key={world.id}>{world.icon} {world.title[locale]}</span>)}
        </div>
        <p className="dc-certificate-done">{copy.achieved}</p>
        <p className="dc-certificate-explain">{copy.explain}</p>
        {date && <p className="dc-certificate-date">{copy.date}: <strong>{date}</strong></p>}
        <div className="dc-certificate-disclaimer"><ShieldAlert size={18}/><div><strong>{copy.disclaimer}</strong><p>{copy.foot}</p></div></div>
      </div>
    </article>
    <div className="dc-certificate-next">
      <div><strong><Sparkles size={18}/>{copy.keepGoing}</strong><p>{copy.familyPlan}</p></div>
      <button className="da-secondary-action" type="button" onClick={onBack}>{copy.openPlan}<ArrowLeft size={16}/></button>
    </div>
  </section>;
}
