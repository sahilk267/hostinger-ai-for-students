import { ArrowLeft, ArrowRight, BookOpen, Check, GraduationCap, ShieldCheck, Users } from "lucide-react";
import AuthControls from "@/components/AuthControls";
import { SEO } from "@/components/SEO";
import { trackLearningEvent } from "@/lib/analytics";

const offers = [
  {title:"Student Learning",audience:"Students",status:"Available free",icon:BookOpen,features:["Free AI guides and introductory lessons","Visual practice, AI literacy games and reflection","A starter journey and local progress history"],href:"/start",cta:"Start free learning"},
  {title:"Parent Guidance",audience:"Families",status:"Available free",icon:Users,features:["Five-day family activity planner","Observed, device-local practice check-ins","Downloadable family practice resources"],href:"/parents",cta:"Explore parent guidance"},
  {title:"Teacher Solutions",audience:"Educators",status:"Available free",icon:GraduationCap,features:["Classroom activity builder","Three editable, multi-session lesson collections","Print, copy and download resource packs"],href:"/teachers",cta:"Explore teacher resources"},
];
export default function PlansPage() {
  return <div className="topics-page">
    <SEO title="Free AI Learning Resources and Future Family & Teacher Plans" description="Explore free AI lessons, visual games, family activity plans and teacher classroom resources. Optional paid plans are only being researched, not available for purchase." path="/plans"/>
    <header className="game-header"><a className="game-brand" href="/"><strong>AI for <em>Students</em></strong></a><a className="game-return" href="/"><ArrowLeft size={16}/> Home</a><AuthControls/></header>
    <main className="topics-main">
      <section className="topics-hero"><span className="game-kicker">VALUE & ACCESS / TRANSPARENT PRODUCT PLANS</span><h1>Start free.<br/><em>Keep learning.</em></h1><p>The core learning, family activities and classroom tools listed here are currently free in the source application. There is no paid checkout, active family subscription or teacher licence on this page.</p></section>
      <section aria-labelledby="free-offers" className="learn-path-panel"><h2 id="free-offers">What you can use today</h2><div className="topic-grid">{offers.map(offer=>{const Icon=offer.icon;return <article className="learn-card" key={offer.title}>
        <div className="learn-card-top"><span>{offer.audience.toUpperCase()}</span><span>{offer.status}</span></div><Icon size={21}/><h3>{offer.title}</h3>
        <ul>{offer.features.map(feature=><li key={feature}><Check size={15} style={{display:"inline",marginRight:8}}/>{feature}</li>)}</ul>
        <div className="learn-card-footer"><a href={offer.href} onClick={()=>trackLearningEvent("adult_plan_resource_click",{plan:offer.audience.toLowerCase(),destination:offer.href})}>{offer.cta} <ArrowRight size={16}/></a></div>
      </article>})}</div></section>
      <section aria-labelledby="future-options" className="learn-path-panel">
        <h2 id="future-options">Optional premium features under consideration</h2>
        <p>These are research ideas only. They are not launched features, paid subscriptions or promises of future availability.</p>
        <div className="topic-grid">
          <article className="learn-card"><span className="game-kicker">FAMILY / IDEA</span><h3>Parent-managed learning toolkit</h3><p>Possible extras: consent-aware multiple child profiles, richer parent-approved weekly activity plans, offline family packs and additional reviewed content.</p><p><strong>Status:</strong> Exploring demand and privacy requirements. No price has been set.</p></article>
          <article className="learn-card"><span className="game-kicker">EDUCATORS / IDEA</span><h3>Educator workflow toolkit</h3><p>Possible extras: editable lesson libraries, classroom assignment workflows and privacy-safe aggregate reporting.</p><p><strong>Status:</strong> Exploring teacher pilots. No school licence or checkout is live.</p></article>
        </div>
      </section>
      <section aria-labelledby="adult-feedback-title" className="learn-path-panel">
        <h2 id="adult-feedback-title">Help prioritise the next adult tools</h2>
        <p>For parents and educators aged 18+ only. Choose a real need, then send optional feedback through our existing contact form. This is not a waitlist, purchase request or subscription.</p>
        <div className="topic-grid">
          {[
            {label:"Parent: printable weekly activity packs",audience:"family",topic:"family-packs",question:"Would offline family activities be useful?"},
            {label:"Parent: reviewed progress conversations",audience:"family",topic:"family-summary",question:"Which family guidance would be worth improving?"},
            {label:"Teacher: more editable lesson collections",audience:"educator",topic:"teacher-lessons",question:"Which AI literacy lesson topics do you actually need?"},
            {label:"Teacher: classroom planning workflow",audience:"educator",topic:"teacher-workflow",question:"Which time-consuming classroom task should we solve first?"}
          ].map(item=><article className="learn-card" key={item.topic}>
            <div className="learn-card-top"><span>{item.audience.toUpperCase()} / RESEARCH</span><span>NO PURCHASE</span></div>
            <h3>{item.label}</h3>
            <p>{item.question}</p>
            <div className="learn-card-footer"><a href={"/contact?topic="+item.topic} onClick={()=>trackLearningEvent("adult_research_feedback_click",{category:item.topic})}>Share optional feedback <ArrowRight size={16}/></a></div>
          </article>)}
        </div>
        <p style={{marginTop:16}}>Please don't include children's names, school records, learning profiles or student contact information.</p>
      </section>
      <section className="learn-safety-note"><ShieldCheck size={19}/><p><strong>Our boundary:</strong> Basic AI safety, core student practice and open learning guidance should remain accessible. Future adult-managed features require privacy and product validation. No intelligence scores, diagnoses or individual child-targeted advertising.</p></section>
      <p><a href="/contact" className="text-link">Adult educators and parents can share feedback through our contact page <ArrowRight size={16}/></a></p>
    </main><footer className="game-page-footer"><span>AI for Students</span><a href="/">Home</a></footer>
  </div>;
}
