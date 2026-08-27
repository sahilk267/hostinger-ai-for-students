/* Study Desk Editorial progress page: private local progress, paper cards, useful milestones and no public leaderboard. */
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import LocalAuthDialog from "@/components/LocalAuthDialog";
import { trpc } from "@/lib/trpc";
import AuthControls from "@/components/AuthControls";
import { ArrowLeft, ArrowRight, Award, BarChart3, Check, LockKeyhole, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { getLearningProgress, GameId, LearningProgress, resetLearningProgress } from "@/lib/learningProgress";
import { trackLearningEvent } from "@/lib/analytics";

const gameMeta: { id: GameId; label: string; note: string; total: number; href: string }[] = [
  { id: "prompt-detective", label: "Prompt Detective", note: "Build better requests", total: 30, href: "/play" },
  { id: "fact-check-quest", label: "Fact Check Quest", note: "Verify before you trust", total: 30, href: "/play?game=fact" },
  { id: "ai-safety-lab", label: "AI Safety Lab", note: "Make the safer move", total: 30, href: "/play?game=safety" },
  { id: "prompt-workshop", label: "Prompt Workshop", note: "Build, don't guess", total: 30, href: "/play?game=workshop" },
  { id: "source-hunt", label: "Source Hunt", note: "Sequence the check", total: 30, href: "/play?game=source-hunt" },
  { id: "bias-buster", label: "Bias Buster", note: "Notice hidden assumptions", total: 30, href: "/play?game=bias-buster" },
  { id: "ai-decoder", label: "AI Decoder", note: "Translate the machine", total: 30, href: "/play?game=ai-decoder" },
  { id: "data-detective", label: "Data Detective", note: "Read the number", total: 30, href: "/play?game=data-detective" },
  { id: "creative-director", label: "Creative Director", note: "Shape the brief", total: 30, href: "/play?game=creative-director" },
  { id: "code-coach", label: "Code Coach", note: "Review with care", total: 30, href: "/play?game=code-coach" },
  { id: "decision-studio", label: "Decision Studio", note: "Keep humans deciding", total: 30, href: "/play?game=decision-studio" },
  { id: "tool-match", label: "Tool Matchmaker", note: "Choose the right fit", total: 30, href: "/play?game=tool-match" },
  { id: "robotics", label: "Robot Route Builder", note: "Plan, test and repair a robot system", total: 8, href: "/robotics" },
];

const badgeMeta = [
  { id: "first", label: "First case", note: "Complete one learning game", icon: Sparkles },
  { id: "detective", label: "Sharp eye", note: "Score 24/30 in Prompt Detective", icon: Trophy },
  { id: "evidence", label: "Evidence finder", note: "Complete Fact Check Quest", icon: SearchIcon },
  { id: "safety", label: "Safety first", note: "Complete AI Safety Lab", icon: LockKeyhole },
  { id: "desk", label: "Desk regular", note: "Complete all thirteen games", icon: Award },
  { id: "robot", label: "Systems builder", note: "Complete Robot Route Builder", icon: WrenchIcon },
];
function WrenchIcon(props: { size?: number }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={props.size || 18} height={props.size || 18}><path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.1-.5-.5-2.1z" /></svg>; }
function SearchIcon(props: { size?: number }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={props.size || 18} height={props.size || 18}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /><path d="M8.5 11h5" /></svg>; }

export default function ProgressPage() {
  const [progress, setProgress] = useState<LearningProgress>(() => getLearningProgress());
  const { isAuthenticated } = useAuth();
  const [synced, setSynced] = useState(false);
  const progressQuery = trpc.learning.list.useQuery(undefined, { enabled: isAuthenticated });
  const syncGuest = trpc.learning.syncGuest.useMutation();
  const explorerAttemptsQuery = trpc.explorer.attempts.useQuery(undefined, { enabled: isAuthenticated });
  useEffect(() => {
    if (!progressQuery.data?.length) return;
    setProgress((current) => {
      const merged = { ...current };
      for (const row of progressQuery.data) {
        const game = row.gameId as GameId;
        if (!merged[game]) continue;
        merged[game] = { ...merged[game], attempts: Math.max(merged[game].attempts, row.attempts), completions: Math.max(merged[game].completions, row.completions), bestScore: Math.max(merged[game].bestScore, row.bestScore), lastScore: Math.max(merged[game].lastScore, row.lastScore) };
      }
      return merged;
    });
  }, [progressQuery.data]);
  useEffect(() => {
    if (!isAuthenticated || synced || !progressQuery.data) return;
    syncGuest.mutate({ rows: Object.entries(progress).map(([gameId, item]) => ({ gameId, attempts: item.attempts, completions: item.completions, bestScore: item.bestScore, lastScore: item.lastScore })) }, { onSuccess: () => setSynced(true) });
  }, [isAuthenticated, progressQuery.data, progress, synced, syncGuest]);
  const completed = gameMeta.filter((game) => progress[game.id].completions > 0).length;
  const totalAttempts = Object.values(progress).reduce((sum, game) => sum + game.attempts, 0);
  const reset = () => { resetLearningProgress(); setProgress(getLearningProgress()); trackLearningEvent("learning_progress_reset"); };
  return <div className="progress-page"><header className="progress-header"><a className="game-brand" href="/"><span className="progress-logo">✦</span><span><strong>AI</strong> for <em>Students</em></span></a><a className="game-return" href="/"><ArrowLeft size={15} /> Back to the desk</a><AuthControls /></header><main className="progress-main"><div className="progress-top"><div><span className="game-kicker">YOUR LEARNING DESK</span><h1>Keep track of<br /><em>what is sticking.</em></h1><p>{isAuthenticated ? "Your progress is saved to your account and available when you return." : "Your progress stays on this device. Play as a guest, or sign in to keep it across devices."}</p>{!isAuthenticated && <LocalAuthDialog label="Sign in to save this progress" className="text-link account-save-link" />}</div><div className="progress-stats"><div><strong>{completed}/{gameMeta.length}</strong><small>games complete</small></div><div><strong>{totalAttempts}</strong><small>sessions started</small></div></div></div><section className="dashboard-section"><div className="dashboard-section-head"><span className="game-kicker">THE SHELF / 01</span><h2>Learning<br /><em>in motion.</em></h2></div><div className="dashboard-games">{gameMeta.map((game) => { const item = progress[game.id]; return <a className="dashboard-game" href={game.href} key={game.id}><div className="dashboard-game-top"><span>{game.label}</span><BarChart3 size={16} /></div><strong>{item.bestScore}<small> / {game.total}</small></strong><p>{item.completions ? `${item.completions} completed · ${game.note}` : `Not started · ${game.note}`}</p><div className="dashboard-bar"><span style={{ width: `${Math.min(100, (item.bestScore / game.total) * 100)}%` }} /></div><span className="dashboard-action">{item.completions ? "Play again" : "Open game"} <ArrowRight size={14} /></span></a>; })}</div></section>{isAuthenticated && <section className="dashboard-section explorer-progress-card"><div className="dashboard-section-head"><span className="game-kicker">EXPLORER LAB / PRIVATE EVIDENCE</span><h2>Practice that<br /><em>travels with you.</em></h2></div><div className="explorer-progress-card-body"><div><strong>{explorerAttemptsQuery.data?.length ?? 0}</strong><span>saved Explorer missions</span><small>Only parent-consented evidence appears here.</small></div><a className="dashboard-action" href="/explorer/report">Open private report <ArrowRight size={14} /></a></div></section>}<section className="dashboard-section dashboard-badges">
<div className="dashboard-section-head"><span className="game-kicker">THE PINBOARD / 02</span><h2>Small marks<br /><em>of progress.</em></h2></div><div className="badge-grid">{badgeMeta.map((badge) => { const earned = badge.id === "first" ? completed > 0 : badge.id === "detective" ? progress["prompt-detective"].bestScore >= 4 : badge.id === "evidence" ? progress["fact-check-quest"].completions > 0 : badge.id === "safety" ? progress["ai-safety-lab"].completions > 0 : badge.id === "robot" ? progress.robotics.completions > 0 : completed === gameMeta.length; const Icon = badge.icon; return <div className={`badge-card ${earned ? "is-earned" : ""}`} key={badge.id}><span className="badge-icon">{earned ? <Icon size={19} /> : <LockKeyhole size={17} />}</span><strong>{badge.label}</strong><small>{badge.note}</small>{earned && <span className="badge-earned"><Check size={12} /> Earned</span>}</div>; })}</div></section><div className="progress-footer-actions"><a className="text-link" href="/play"><ArrowLeft size={15} /> Back to learning games</a><button className="reset-progress" onClick={reset}><RotateCcw size={14} /> Reset local progress</button></div></main><footer className="game-page-footer"><span>AI for Students</span><span>Learn the tool. Keep the thinking.</span></footer></div>;
}
