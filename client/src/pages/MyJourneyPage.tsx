import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Home, LockKeyhole, Sparkles } from "lucide-react";
import AuthControls from "@/components/AuthControls";
import { DiscoveryJourneyCard } from "@/components/DiscoveryJourneyCard";
import { getLearningProgress } from "@/lib/learningProgress";
import "./phase14Journey.css";

export default function MyJourneyPage() {
  const [games] = useState(()=>getLearningProgress());
  const gamesTried=Object.values(games).filter(game=>game.attempts>0).length;
  const gamesComplete=Object.values(games).filter(game=>game.completions>0).length;
  return <div className="phase14-page">
    <header className="phase14-page-header"><a href="/" className="phase14-wordmark">✦ AI for Students</a><nav aria-label="Journey navigation"><a href="/explorer/adventure">Adventure</a><a href="/for-parents">For parents</a><a href="/progress">All games</a></nav><AuthControls/></header>
    <main className="phase14-page-main">
      <div className="phase14-page-eyebrow"><Sparkles size={18}/> YOUR LEARNING DESK</div>
      <h1>One place for your<br/><em>next learning step.</em></h1>
      <p className="phase14-page-lede">See Discovery Adventure and practice games together. Every learner progresses differently—this is a practice record, not an ability ranking.</p>
      <DiscoveryJourneyCard/>
      <div className="phase14-two-cards">
        <section className="phase14-simple-card"><div className="phase14-card-icon"><BookOpen/></div><h2>Practice games</h2><p><strong>{gamesComplete}</strong> game types completed · {gamesTried} tried on this browser. Signed-in game progress may also appear on the full progress page.</p><a href="/progress">Explore all games <ArrowRight size={16}/></a></section>
        <section className="phase14-simple-card"><div className="phase14-card-icon"><Home/></div><h2>For your family</h2><p>The practice report includes three ten-minute activities, observations from these tasks and questions to ask together.</p><a href="/for-parents">Open the parent guide <ArrowRight size={16}/></a></section>
      </div>
      <p className="phase14-trust-note"><LockKeyhole size={17}/> Discovery Adventure stays on this device and is not tied to a learner identity. Use the Adventure clear button before another child uses the same browser.</p>
      <a href="/" className="phase14-text-action"><ArrowLeft size={16}/> Back to the main desk</a>
    </main>
  </div>;
}
