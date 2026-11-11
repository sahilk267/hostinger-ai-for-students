import { useState } from "react";
import { ArrowLeft, ArrowRight, HeartHandshake, LockKeyhole, Printer, Sparkles } from "lucide-react";
import AuthControls from "@/components/AuthControls";
import { ADVENTURE_AGE_BANDS, type AdventureAgeBand, type AdventureLocale } from "@/data/discoveryAdventure";
import { parentGuideCopy } from "@/data/parentGuideCopy";
import { getBrowserJourneyReport, readSelectedJourneyBand, safeJourneyStorage } from "@/data/discoveryJourney";
import SiteFeedbackPanel from "@/components/SiteFeedbackPanel";
import "./phase14Journey.css";

export default function ParentsGuidePage() {
  const [ageBand,setAgeBand]=useState<AdventureAgeBand>(()=>readSelectedJourneyBand(safeJourneyStorage()));
  const [locale,setLocale]=useState<AdventureLocale>("hinglish");
  const copy=parentGuideCopy[locale];
  const report=getBrowserJourneyReport(ageBand,safeJourneyStorage());
  return <div className="phase14-page phase14-parent-page" lang={locale==="hi"?"hi-IN":locale==="hinglish"?"en-IN":"en"}>
    <header className="phase14-page-header">
      <a href="/" className="phase14-wordmark">✦ AI for Students</a>
      <nav aria-label={copy.introLabel}>
        <a href="/explorer/adventure">{copy.navAdventure}</a>
        <a href="/my-journey">{copy.navJourney}</a>
      </nav>
      <AuthControls label="Game account"/>
    </header>
    <main className="phase14-page-main">
      <div className="phase14-page-eyebrow"><HeartHandshake size={17}/>{copy.introLabel}</div>
      <h1>{copy.title}<br/><em>{copy.titleEmphasis}</em></h1>
      <p className="phase14-page-lede">{copy.lead}</p>
      <div className="phase14-parent-controls">
        <div>
          <strong>{copy.ageGroup}</strong>
          <div className="phase14-age-tabs" role="group" aria-label={copy.ageGroup}>
            {ADVENTURE_AGE_BANDS.map(b=><button key={b.id} type="button"
              className={ageBand===b.id?"is-active":""} aria-pressed={ageBand===b.id}
              onClick={()=>setAgeBand(b.id)}>{b.id}</button>)}
          </div>
        </div>
        <div>
          <strong>{copy.language}</strong>
          <div className="phase14-age-tabs" role="group" aria-label={copy.language}>
            {(["hinglish","hi","en"] as const).map(l=><button key={l} type="button"
              aria-pressed={locale===l} className={locale===l?"is-active":""}
              onClick={()=>setLocale(l)}>{l==="hi"?"हिन्दी":l==="en"?"English":"Hinglish"}</button>)}
          </div>
        </div>
      </div>
      <section className="phase14-plan" aria-labelledby="phase14-plan-title">
        <div className="phase14-plan-head">
          <div>
            <div className="phase14-page-eyebrow"><Sparkles size={16}/>{copy.planLabel}</div>
            <h2 id="phase14-plan-title">{copy.planTitle}</h2>
            <p>{report.attempted===0?copy.noEvidence:copy.evidence(report.attempted)}</p>
          </div>
          <span className="phase14-pill">{report.solved}/9 {copy.solved}</span>
        </div>
        <div className="phase14-session-grid">
          {report.growthPlan.map((step,i)=><article className="phase14-session" key={step.id}>
            <span className="phase14-session-number">{copy.session} {i+1} / 3</span>
            <div className="phase14-session-icon" aria-hidden="true">{step.icon}</div>
            <h3>{step.title[locale]}</h3><strong>{step.label[locale]}</strong>
            <p>{step.observation[locale]}</p>
            <h4>{copy.activity}</h4><p>{step.activity[locale]}</p>
            <h4>{copy.parentTip}</h4><p>{step.coaching[locale]}</p>
            <h4>{copy.ask}</h4><p>{step.familyPrompt[locale]}</p>
          </article>)}
        </div>
        <div className="phase14-journey-actions">
          <a className="button button--primary" href={`/explorer/adventure?age=${ageBand}&view=report`}>
            {copy.openReport}<ArrowRight size={16}/>
          </a>
          <a className="phase14-text-action" href={`/explorer/adventure?age=${ageBand}`}>{copy.tryMission}</a>
          <button type="button" className="phase14-text-action phase14-plain-button" onClick={()=>window.print()}>
            <Printer size={17}/>{copy.print}
          </button>
        </div>
      </section>
      <p className="phase14-trust-note"><LockKeyhole size={18}/>{copy.trust}</p>
      {locale!=="en" && <p className="phase14-feedback-language-note">{copy.feedbackEnglish}</p>}
      <SiteFeedbackPanel/>
      <a href="/my-journey" className="phase14-text-action"><ArrowLeft size={16}/>{copy.back}</a>
    </main>
  </div>;
}
