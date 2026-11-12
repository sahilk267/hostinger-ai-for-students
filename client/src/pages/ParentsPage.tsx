import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, ClipboardCheck, HeartHandshake, Lightbulb, ShieldCheck, Download, Printer, CalendarDays } from "lucide-react";
import AuthControls from "@/components/AuthControls";
import { SEO } from "@/components/SEO";
import { downloadTextFile, printPlainText } from "@/lib/resourceExport";
import { getLearningProgress, type GameId } from "@/lib/learningProgress";
import { buildFamilyPracticeSnapshot, formatFamilySnapshot, type FamilyPracticeSnapshot } from "@/lib/familyPracticeSummary";
import { publicUrl } from "@/lib/siteUrl";

const activities = [
  { goal: "Make AI answers easier to verify", ages: "8+", duration: "10 minutes", href: "/play?game=fact", action: "Pick one claim and look for the original source together.", reflect: "Which part was a fact, and which was still uncertain?" },
  { goal: "Practise visual patterns", ages: "5–15", duration: "5 minutes", href: "/discovery-lab?game=pattern-builder", action: "Let your child describe the shape or color rule before choosing.", reflect: "What changed after trying a different approach?" },
  { goal: "Plan a robot route", ages: "5–15", duration: "10 minutes", href: "/robotics", action: "Ask what should happen first, what could go wrong, and how to revise a route.", reflect: "Which step would you test next?" },
  { goal: "Protect private information", ages: "8+", duration: "10 minutes", href: "/play?game=safety", action: "Use imaginary examples to practise removing private details from prompts.", reflect: "What should we never share with an AI tool?" },
] as const;

export default function ParentsPage() {
  const [selected, setSelected] = useState(0);
  const [sessionMinutes, setSessionMinutes] = useState(10);
  const [practice, setPractice] = useState<{attempts:number;completions:number}[]>([]);
  const [snapshot, setSnapshot] = useState<FamilyPracticeSnapshot | null>(null);
  const refreshPractice = () => {
    const recorded = getLearningProgress();
    setSnapshot(buildFamilyPracticeSnapshot(recorded));
    const games: GameId[] = ["fact-check-quest","pattern-builder","robotics","ai-safety-lab"];
    setPractice(games.map(id=>({attempts:recorded[id].attempts,completions:recorded[id].completions})));
  };
  useEffect(()=>{
    refreshPractice();
    const handleFocus = () => refreshPractice();
    window.addEventListener("focus",handleFocus);
    return () => window.removeEventListener("focus",handleFocus);
  }, []);
  const item = activities[selected];
  const week = useMemo(() => Array.from({length: 5}, (_, day) => {
    const activity = activities[(selected + day) % activities.length];
    const discussion = day === 4 ? "What strategy would you reuse next week?" : activity.reflect;
    return {day: day + 1, activity, discussion};
  }), [selected]);
  const plan = useMemo(() => [
    "AI FOR STUDENTS — FAMILY PRACTICE WEEK",
    "Five short sessions — " + sessionMinutes + " minutes per day",
    "Starting focus: " + item.goal,
    "Use age-appropriate supervision and adapt or skip any activity.",
    "",
    ...week.flatMap(({day,activity,discussion})=> [
      "DAY " + day + ": " + activity.goal,
      "Activity: " + activity.action,
      "Open: " + publicUrl(activity.href),
      "Reflect together: " + discussion,
      "",
    ]),
    "Family check-in: Which activity felt useful? What should we try differently?",
    "This plan is for practice, not an assessment, diagnosis or prediction.",
    "Avoid uploading identifying information about a child.",
  ].join("\n"), [item, sessionMinutes, week]);
  const related = useMemo(() => [
    { title: "See practice history", href: "/progress", detail: "Local progress and optional account sync; not a psychological assessment." },
    { title: "Read the family AI safety guide", href: "/guides/ai-safety-for-kids-and-parents", detail: "Privacy, supervision, source checking and schoolwork boundaries." },
    { title: "Explore Discovery Lab", href: "/discovery-lab", detail: "Visual-first challenges with retry and reflection." },
  ], []);
  return <div className="topics-page">
    <SEO title="Parent Guidance: Safe AI Learning Activities for Kids" description="Practical parent-child AI activities, visual practice suggestions and privacy-conscious guidance. Explore free family resources without a child profile." path="/parents" />
    <header className="game-header"><a className="game-brand" href="/"><strong>AI for <em>Students</em></strong></a><a className="game-return" href="/"><ArrowLeft size={15}/> Home</a><AuthControls/></header>
    <main className="topics-main">
      <section className="topics-hero"><span className="game-kicker">PARENT GUIDANCE / FREE FAMILY ACTIVITIES</span><h1>Help them practise.<br/><em>Keep their curiosity.</em></h1><p>Choose one short activity, explore it together and discuss what the child tried. Progress is a record of practice—not an IQ score, diagnosis or prediction.</p></section>
      <section className="learn-path-panel" aria-labelledby="family-activity-title">
        <div className="learn-panel-heading"><div><span className="game-kicker">START WITH ONE CONVERSATION</span><h2 id="family-activity-title">Choose an activity for today</h2></div><HeartHandshake size={23}/></div>
        <div className="topic-filters" role="group" aria-label="Family practice activities">
          {activities.map((activity, index)=><button key={activity.goal} type="button" aria-pressed={selected === index} className={selected===index?"is-active":""} onClick={()=>setSelected(index)}>{activity.goal}</button>)}
        </div>
        <div className="learn-card" style={{marginTop:24}}>
          <div className="learn-card-top"><span>{item.ages}</span><span>{item.duration}</span></div>
          <h2>{item.goal}</h2>
          <p><strong>Try together:</strong> {item.action}</p>
          <div className="learn-try"><Lightbulb size={18}/><span><strong>Afterwards, ask:</strong> {item.reflect}</span></div>
          <div className="learn-card-footer"><a href={item.href}>Open activity <ArrowRight size={16}/></a></div>
        </div>
      </section>
      <section className="learn-path-panel" aria-labelledby="family-practice-snapshot">
        <div className="learn-panel-heading"><div><span className="game-kicker">OBSERVED PRACTICE / THIS DEVICE</span><h2 id="family-practice-snapshot">See what has been tried</h2></div><ClipboardCheck size={21}/></div>
        <p>These are activity records saved locally on this device. They are not an ability assessment, and they may not include activity on other devices.</p>
        <div className="topic-grid">{activities.map((activity,index)=><article className="learn-card" key={activity.goal}>
          <div className="learn-card-top"><span>ACTIVITY {index+1}</span><span>{practice[index]?.completions??0} completed rounds</span></div>
          <h3>{activity.goal}</h3>
          <p>{practice[index]?.attempts??0} starts recorded. {practice[index]?.completions ? "Discuss one strategy used in the activity." : "There is no completed round on this device yet."}</p>
          <div className="learn-card-footer"><a href={activity.href}>Explore this activity <ArrowRight size={15}/></a></div>
        </article>)}</div>
        <button type="button" className="button button--ink" onClick={refreshPractice} style={{marginTop:18}}>Refresh practice records</button>
      </section>
      <section className="learn-path-panel" aria-labelledby="family-check-in-title">
        <div className="learn-panel-heading"><div><span className="game-kicker">FAMILY CHECK-IN / LAST RECORDED ACTIVITY</span><h2 id="family-check-in-title">A practical learning conversation</h2></div><HeartHandshake size={23}/></div>
        <p>{snapshot?.summary ?? "Read the available practice records on this device."}</p>
        <div className="topic-grid">
          <article className="learn-card"><div className="learn-card-top"><span>ACTIVITY COVERAGE</span></div><h3>{snapshot?.gamesTried ?? 0} different games started</h3><p>{snapshot?.gamesCompleted ?? 0} different games completed at least once. These are lifetime records on this device, not this week's scores.</p></article>
          <article className="learn-card"><div className="learn-card-top"><span>LAST SEVEN DAYS</span></div><h3>{snapshot?.recentGames.length ?? 0} recently visited activities</h3><p>Only the latest visit per game is saved. This is not a count of all sessions or total study time.</p></article>
        </div>
        <h3 style={{marginTop:22}}>Recently visited</h3>
        {snapshot?.recentGames.length ? <ul>{snapshot.recentGames.map(game=><li key={game.id}>{game.title} — {game.lastPlayed.slice(0,10)} (latest recorded visit)</li>)}</ul> : <p>No last-played timestamps found for the past seven days.</p>}
        <div className="learn-card" style={{marginTop:20}}>
          <span className="game-kicker">NEXT FAMILY CONVERSATION</span>
          <h3>{snapshot?.nextSuggestion.title ?? "Explore a short challenge"}</h3>
          <p>{snapshot?.nextSuggestion.prompt ?? "Discuss what you notice while playing."}</p>
          <div className="learn-card-footer"><a href={snapshot?.nextSuggestion.href ?? "/start"}>Try together <ArrowRight size={16}/></a></div>
        </div>
        <div className="learn-card-footer" style={{marginTop:18}}>
          <button type="button" onClick={refreshPractice}>Refresh check-in</button>
          <button type="button" disabled={!snapshot} onClick={()=>snapshot && downloadTextFile("ai-for-students-family-check-in.txt",formatFamilySnapshot(snapshot))}><Download size={16}/> Download summary</button>
          <button type="button" disabled={!snapshot} onClick={()=>{if(snapshot && !printPlainText("Family practice check-in",formatFamilySnapshot(snapshot))) alert("Allow pop-ups to print or use Download.");}}><Printer size={16}/> Print summary</button>
        </div>
        <p style={{marginTop:12}}>This summary stays on your device unless you choose to download or print it. It does not infer intelligence, strengths or future careers.</p>
      </section>
      <section className="learn-path-panel" aria-labelledby="family-week-title">
        <div className="learn-panel-heading"><div><span className="game-kicker">FAMILY PLAN / NO LOGIN REQUIRED</span><h2 id="family-week-title">Build your five-day practice week</h2></div><CalendarDays size={22}/></div>
        <p>Choose a starting focus above, then pick a realistic daily duration. The activities rotate to provide varied practice and family conversations.</p>
        <div className="topic-filters" role="group" aria-label="Daily session length">
          {[5,10,15].map(minutes=><button key={minutes} type="button" className={sessionMinutes===minutes?"is-active":""} aria-pressed={sessionMinutes===minutes} onClick={()=>setSessionMinutes(minutes)}>{minutes} minutes/day</button>)}
        </div>
        <div className="topic-grid">
          {week.map(({day,activity,discussion})=><article className="learn-card" key={day}>
            <div className="learn-card-top"><span>DAY {day}</span><span>{sessionMinutes} MINUTES</span></div>
            <h3>{activity.goal}</h3><p>{activity.action}</p><p><strong>Ask:</strong> {discussion}</p>
            <div className="learn-card-footer"><a href={activity.href}>Open this practice <ArrowRight size={15}/></a></div>
          </article>)}
        </div>
        <div className="learn-card-footer" style={{marginTop:22}}>
          <button type="button" onClick={()=>downloadTextFile("ai-for-students-family-week.txt",plan)}><Download size={16}/> Download family plan</button>
          <button type="button" onClick={()=>{if(!printPlainText("Family practice week",plan)) alert("Allow pop-ups to print your plan, or use Download.");}}><Printer size={16}/> Print or save as PDF</button>
        </div>
        <p style={{marginTop:12}}>The plan is generated in your browser and isn't submitted to our server.</p>
      </section>
      <section aria-labelledby="parent-next-steps"><h2 id="parent-next-steps">Your family learning toolkit</h2><div className="topic-grid">{related.map((link,index)=><a className="topic-card" href={link.href} key={link.href}>{index===0?<ClipboardCheck size={19}/>:index===1?<ShieldCheck size={19}/>:<BookOpen size={19}/>}<div><strong>{link.title}</strong><small>{link.detail}</small></div><ArrowRight size={17}/></a>)}</div></section>
      <aside className="learn-safety-note"><ShieldCheck size={19}/><p><strong>Important:</strong> Supervise age-appropriate use, follow the AI tool's age requirements and school rules, and avoid entering identifiable child information. Activity suggestions are non-diagnostic and are not medical or educational assessments.</p></aside>
      <p><a className="text-link" href="/plans">See free features and future family plan ideas <ArrowRight size={16}/></a></p>
      <p><a className="text-link" href="/teachers">Are you an educator? See free classroom tools <ArrowRight size={16}/></a></p>
    </main>
    <footer className="game-page-footer"><span>AI for Students</span><a href="/contact">Contact</a></footer>
  </div>;
}
