import { useState } from "react";
import { ArrowLeft, ArrowRight, HeartHandshake, LockKeyhole, Printer, Sparkles } from "lucide-react";
import AuthControls from "@/components/AuthControls";
import { ADVENTURE_AGE_BANDS, type AdventureAgeBand, type AdventureLocale } from "@/data/discoveryAdventure";
import { getBrowserJourneyReport, readSelectedJourneyBand } from "@/data/discoveryJourney";
import "./phase14Journey.css";
import SiteFeedbackPanel from "@/components/SiteFeedbackPanel";

export default function ParentsGuidePage() {
  const [ageBand,setAgeBand]=useState<AdventureAgeBand>(()=>readSelectedJourneyBand(typeof window!=="undefined"?window.localStorage:undefined));
  const [locale,setLocale]=useState<AdventureLocale>("hinglish");
  const report=getBrowserJourneyReport(ageBand,typeof window!=="undefined"?window.localStorage:undefined);
  return <div className="phase14-page">
    <header className="phase14-page-header"><a href="/" className="phase14-wordmark">✦ AI for Students</a><nav aria-label="Parent navigation"><a href="/explorer/adventure">Adventure</a><a href="/my-journey">My Journey</a></nav><AuthControls/></header>
    <main className="phase14-page-main">
      <div className="phase14-page-eyebrow"><HeartHandshake size={17}/> FOR PARENTS & GUARDIANS</div>
      <h1>See the learning.<br/><em>Not a label.</em></h1>
      <p className="phase14-page-lede">Understand what the learner practised, what to explore next, and how to support curiosity at home. No payment, child account or formal test required.</p>
      <div className="phase14-parent-controls">
        <div><strong>Learning group</strong><div className="phase14-age-tabs" role="group" aria-label="Learning group">{ADVENTURE_AGE_BANDS.map(b=><button key={b.id} type="button" className={ageBand===b.id?"is-active":""} aria-pressed={ageBand===b.id} onClick={()=>setAgeBand(b.id)}>{b.id}</button>)}</div></div>
        <div><strong>Language</strong><div className="phase14-age-tabs" role="group" aria-label="Report language">{(["hinglish","hi","en"] as const).map(l=><button key={l} type="button" aria-pressed={locale===l} className={locale===l?"is-active":""} onClick={()=>setLocale(l)}>{l==="hi"?"हिन्दी":l==="en"?"English":"Hinglish"}</button>)}</div></div>
      </div>
      <section className="phase14-plan" aria-labelledby="phase14-plan-title">
        <div className="phase14-plan-head"><div><div className="phase14-page-eyebrow"><Sparkles size={16}/> FAMILY PRACTICE PLAN</div><h2 id="phase14-plan-title">Three small sessions. Useful next steps.</h2><p>{report.attempted===0?"No mission results yet, so these are exploratory activities—not personalised conclusions.":`Based on ${report.attempted} missions tried in this browser. These are task-specific observations, not natural talent scores.`}</p></div><span className="phase14-pill">{report.solved}/9 solved</span></div>
        <div className="phase14-session-grid">{report.growthPlan.map((step,i)=><article className="phase14-session" key={step.id}>
          <span className="phase14-session-number">SESSION {i+1} / 3</span>
          <div className="phase14-session-icon" aria-hidden="true">{step.icon}</div>
          <h3>{step.title[locale]}</h3><strong>{step.label[locale]}</strong>
          <p>{step.observation[locale]}</p>
          <h4>10-minute activity</h4><p>{step.activity[locale]}</p>
          <h4>Parent tip</h4><p>{step.coaching[locale]}</p>
          <h4>Ask together</h4><p>{step.familyPrompt[locale]}</p>
        </article>)}</div>
        <div className="phase14-journey-actions">
          <a className="button button--primary" href={`/explorer/adventure?age=${ageBand}&view=report`}>Open detailed private report <ArrowRight size={16}/></a>
          <a className="phase14-text-action" href={`/explorer/adventure?age=${ageBand}`}>Try a mission</a>
          <button type="button" className="phase14-text-action phase14-plain-button" onClick={()=>window.print()}><Printer size={17}/> Print family plan</button>
        </div>
      </section>
      <p className="phase14-trust-note"><LockKeyhole size={18}/> Results stay in this browser and may be shared across learners on the same device. They are editable, not verified, and should never be used for IQ, career or aptitude decisions.</p>
      <SiteFeedbackPanel/>
      <a href="/my-journey" className="phase14-text-action"><ArrowLeft size={16}/> Back to My Journey</a>
    </main>
  </div>;
}
