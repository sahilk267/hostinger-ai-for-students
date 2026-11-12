import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import type { GameId } from "@/lib/learningProgress";
import { getGameFollowUp } from "@/lib/gameFollowUps";

/** Common, non-diagnostic completion guidance based on which activity finished. */
export default function CompletionNextSteps({ gameId }: { gameId: GameId }) {
  const next = getGameFollowUp(gameId);
  return <section aria-label="What to practise next" className="game-completion-next" style={{marginTop:24,padding:"20px 22px",borderRadius:15,background:"#f4eee0",border:"1px solid #dacebb",textAlign:"left",color:"#29271e"}}>
    <span style={{display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:700,letterSpacing:".08em"}}><CheckCircle2 size={16}/> YOUR NEXT LEARNING STEP</span>
    <h3 style={{margin:"12px 0 8px",fontSize:"1.3rem"}}>{next.title}</h3>
    <p style={{lineHeight:1.6,margin:"0 0 16px"}}>{next.prompt}</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"center"}}>
      <a className="button button--ink" href={next.href}>Try next activity <ArrowRight size={16}/></a>
      <a className="text-link" href="/progress"><BookOpen size={16}/> View practice history</a>
      <a className="text-link" href="/start">Explore learning paths</a>
    </div>
    <p style={{margin:"14px 0 0",fontSize:12}}>This is an optional practice suggestion, not a test of intelligence or a prediction.</p>
  </section>;
}
