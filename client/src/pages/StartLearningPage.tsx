import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Compass, GraduationCap, RefreshCcw, Sparkles } from "lucide-react";
import AuthControls from "@/components/AuthControls";
import { SEO } from "@/components/SEO";
import { getLearningProgress, isLearningProgressStorageAvailable, type GameId } from "@/lib/learningProgress";

const paths: { id: string; name: string; description: string; lesson: string; practice: string; gameId: GameId; reflect: string }[] = [
  { id:"patterns",name:"Think with patterns",description:"Start with visual logic and explain what repeats.",lesson:"/learn",practice:"/discovery-lab?game=pattern-builder",gameId:"pattern-builder",reflect:"Which part of the sequence changed, and which part stayed the same?" },
  { id:"science",name:"Make a small prediction",description:"Observe a change, predict a result and compare.",lesson:"/learn",practice:"/discovery-lab?game=mini-scientist",gameId:"mini-scientist",reflect:"What did you predict? What surprised you?" },
  { id:"robotics",name:"Plan like a robot",description:"Practise step-by-step instructions and revisions.",lesson:"/learn",practice:"/discovery-lab?game=robot-programmer",gameId:"robot-programmer",reflect:"Which instruction would you change for your next attempt?" },
  { id:"responsible-ai",name:"Check an AI answer",description:"Learn the difference between a confident claim and evidence.",lesson:"/guides/how-to-check-ai-answers",practice:"/play?game=fact",gameId:"fact-check-quest",reflect:"Which claim still needs an independent source?" },
];

export default function StartLearningPage() {
  const [choice, setChoice] = useState(0);
  const [canSaveLocally, setCanSaveLocally] = useState(true);
  const [completions, setCompletions] = useState<Record<string,number>>({});
  const refresh = () => {
    const history = getLearningProgress();
    setCompletions(Object.fromEntries(paths.map(path=>[path.gameId,history[path.gameId].completions])));
  };
  useEffect(() => { refresh(); setCanSaveLocally(isLearningProgressStorageAvailable()); const onFocus = () => { refresh(); setCanSaveLocally(isLearningProgressStorageAvailable()); }; window.addEventListener("focus",onFocus); return () => window.removeEventListener("focus",onFocus); }, []);
  const selected = paths[choice];
  const finished = (completions[selected.gameId] ?? 0)>0;
  const other = paths.find(p=>p.gameId!==selected.gameId && !(completions[p.gameId]>0)) ?? paths[(choice+1)%paths.length];
  return <div className="topics-page">
    <SEO title="Start Learning AI — Your First Practice Journey" description="Choose a free five-minute learning journey, practise with visual games or fact-checking and get your next learning activity. No account required." path="/start"/>
    <header className="game-header"><a className="game-brand" href="/"><strong>AI for <em>Students</em></strong></a><a className="game-return" href="/"><ArrowLeft size={16}/> Back home</a><AuthControls/></header>
    <main className="topics-main">
      <section className="topics-hero"><span className="game-kicker">YOUR FIRST LEARNING JOURNEY</span><h1>Choose. Practise.<br/><em>Try again.</em></h1><p>Pick something interesting, try one short activity and reflect on what happened. No signup required. Practice records on this device show what you tried, not your intelligence.</p></section>
      {!canSaveLocally && <aside className="learn-safety-note" role="status"><p><strong>Progress saving unavailable:</strong> Your browser is blocking local storage. Games can still be played, but completion and this device\u2019s practice history may not be saved. Enable site storage to keep your progress.</p></aside>}
      <section className="learn-path-panel" aria-labelledby="choose-learning-path">
        <div className="learn-panel-heading"><div><span className="game-kicker">STEP 1 / CHOOSE YOUR FIRST GOAL</span><h2 id="choose-learning-path">What would you like to explore?</h2></div><Compass size={23}/></div>
        <div className="topic-filters" role="group" aria-label="Learning path">
          {paths.map((path,index)=><button type="button" key={path.id} className={choice===index?"is-active":""} aria-pressed={choice===index} onClick={()=>setChoice(index)}>{path.name}{completions[path.gameId]>0?" ✓":""}</button>)}
        </div>
        <div className="learn-card" style={{marginTop:24}}>
          <div className="learn-card-top"><span>{finished?"COMPLETED ON THIS DEVICE":"READY TO TRY"}</span><span>SHORT PRACTICE</span></div>
          <h2>{selected.name}</h2><p>{selected.description}</p>
          <div className="learn-try"><BookOpen size={18}/><span><strong>STEP 2 / PREPARE</strong> Read a short lesson or explore an example, then try the challenge yourself.</span></div>
          <div className="learn-card-footer"><a href={selected.lesson}>Read a learning guide <ArrowRight size={15}/></a><a href={selected.practice}>Open practice game <ArrowRight size={15}/></a></div>
        </div>
      </section>
      <section className="learn-path-panel" aria-labelledby="journey-reflection">
        <div className="learn-panel-heading"><div><span className="game-kicker">STEP 3 / REVIEW YOUR PRACTICE</span><h2 id="journey-reflection">{finished?"You completed this practice":"When you finish, check your progress"}</h2></div>{finished?<CheckCircle2 size={24}/>:<RefreshCcw size={24}/>}</div>
        <p><strong>Reflection question:</strong> {selected.reflect}</p>
        <p>{finished?"A completion is recorded on this device. Consider what you would do differently, or explore another activity.":"After you finish a round, come back here to see the recorded completion. You can retry as often as you like."}</p>
        <div className="learn-card-footer">
          <button type="button" onClick={refresh}><RefreshCcw size={16}/> Check completion</button>
          {finished?<a href={other.practice}>Try next: {other.name} <ArrowRight size={16}/></a>:<a href={selected.practice}>Start practice <ArrowRight size={16}/></a>}
          <a href="/progress">View all practice history <ArrowRight size={16}/></a>
        </div>
      </section>
      <aside className="learn-safety-note"><GraduationCap size={18}/><p>Keep learning in your own words. Completion counts are not ability or career predictions. If you're a younger learner, ask a trusted adult to help you choose age-appropriate activities.</p></aside>
      <div className="topic-grid"><a className="topic-card" href="/parents"><Sparkles size={18}/><div><strong>Parents: practise together</strong><small>Get a free five-day activity plan</small></div><ArrowRight size={15}/></a><a className="topic-card" href="/teachers"><BookOpen size={18}/><div><strong>Teachers: plan a lesson</strong><small>Create a reusable classroom activity pack</small></div><ArrowRight size={15}/></a></div>
    </main><footer className="game-page-footer"><span>AI for Students</span><a href="/guides">Free Guides</a></footer>
  </div>;
}
