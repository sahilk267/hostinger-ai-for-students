import { useState } from "react";
import { ArrowRight, BookOpen, LockKeyhole, Sparkles } from "lucide-react";
import { ADVENTURE_AGE_BANDS, type AdventureAgeBand } from "@/data/discoveryAdventure";
import { getBrowserJourneyReport, nextJourneyAction, readSelectedJourneyBand } from "@/data/discoveryJourney";

function browserStorage() {return typeof window!=="undefined"?window.localStorage:undefined;}
export function DiscoveryJourneyCard() {
  const [ageBand,setAgeBand]=useState<AdventureAgeBand>(()=>readSelectedJourneyBand(browserStorage()));
  const report=getBrowserJourneyReport(ageBand,browserStorage());
  const next=nextJourneyAction(report);
  return <section className="phase14-journey-card" aria-labelledby="phase14-journey-title">
    <div className="phase14-journey-top">
      <div><span className="phase14-eyebrow"><Sparkles size={15}/> DISCOVERY ADVENTURE · DEVICE-ONLY</span>
        <h2 id="phase14-journey-title">Your next adventure is ready.</h2>
        <p>Choose your learning group. This snapshot is from this browser only—signing in does not sync Discovery Adventure results.</p>
      </div>
      <div className="phase14-age-tabs" role="group" aria-label="Learning group">
        {ADVENTURE_AGE_BANDS.map(b=><button key={b.id} type="button" aria-pressed={ageBand===b.id}
          className={ageBand===b.id?"is-active":""} onClick={()=>setAgeBand(b.id)}>{b.id}</button>)}
      </div>
    </div>
    <div className="phase14-journey-metrics">
      <div><strong>{report.solved}/9</strong><span>Missions solved</span></div>
      <div><strong>{report.transfer.solved}/3</strong><span>Thinking challenges</span></div>
      <div><strong>{report.showcaseReady?"Ready":"In progress"}</strong><span>Private milestone</span></div>
    </div>
    <div className="phase14-meter"><span style={{width:`${Math.round(report.solved/9*100)}%`}} /></div>
    <div className="phase14-journey-actions">
      <a className="button button--primary" href={next.href}>{next.label}<ArrowRight size={16}/></a>
      <a className="phase14-text-action" href={`/explorer/adventure?age=${ageBand}&view=report`}><BookOpen size={17}/> Open family plan</a>
      <a className="phase14-text-action" href="/for-parents"><LockKeyhole size={16}/> Guide for parents</a>
    </div>
    <p className="phase14-local-note">Shared device? Another learner's local results can appear here. Clear Adventure practice between learners. Not a test or a verified certificate.</p>
  </section>;
}
