import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, Check, Eye, FlaskConical, RotateCcw, Sparkles, Wrench } from "lucide-react";
import { completeGame, GameId, startGame } from "@/lib/learningProgress";
import { trackLearningEvent } from "@/lib/analytics";
import { scoreVisualSession, visualSessionId, type VisualRoundEvent } from "@/lib/visualGameEngine";
import AuthControls from "@/components/AuthControls";
import { assetUrls } from "@/lib/assets";

type VisualGameId = "pattern-builder" | "memory-adventure" | "mini-scientist" | "bridge-builder" | "robot-programmer" | "traffic-controller" | "mission-commander" | "creative-studio" | "performance-arena";
type VisualGame = { id: VisualGameId; title: string; note: string; icon: typeof Brain; color: string };

const visualGames: VisualGame[] = [
  { id: "pattern-builder", title: "Pattern Builder", note: "Find the next color and shape", icon: Sparkles, color: "#f3b63f" },
  { id: "memory-adventure", title: "Memory Adventure", note: "Remember where the star was", icon: Brain, color: "#9a7bd1" },
  { id: "mini-scientist", title: "Mini Scientist", note: "Predict what the change will do", icon: FlaskConical, color: "#5b9f8a" },
  { id: "bridge-builder", title: "Bridge Builder", note: "Make a path that can hold", icon: Wrench, color: "#e87461" },
  { id: "robot-programmer", title: "Robot Programmer", note: "Guide a bot with arrows", icon: ArrowRight, color: "#6f8edc" },
  { id: "traffic-controller", title: "Traffic Controller", note: "Keep the moving colors safe", icon: Eye, color: "#e4aa38" },
  { id: "mission-commander", title: "Mission Commander", note: "Choose the next safe step", icon: Brain, color: "#5b9f8a" },
  { id: "creative-studio", title: "Creative Studio", note: "Build a balanced visual scene", icon: Sparkles, color: "#d886b5" },
  { id: "performance-arena", title: "Performance Arena", note: "Follow the silent beat", icon: Eye, color: "#6f8edc" },
];

const colors = ["#e87461", "#f3b63f", "#5b9f8a", "#6f8edc"];
const shapes = ["●", "◆", "■", "▲"];

function PatternRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const offset = round % 4;
  const answer = (offset + 2) % 4;
  const options = [0, 1, 2, 3].sort((a, index) => ((a + round * 3 + index) % 4) - ((a + round * 3) % 4));
  return <div className="visual-challenge"><div className="visual-sequence" aria-label="A repeating color and shape sequence">{[0, 1, 2, 3, 0, 1].map((item, index) => <span key={index} style={{ background: colors[(item + offset) % 4] }}>{shapes[(item + offset) % 4]}</span>)}<span className="visual-missing" aria-label="Missing item">?</span></div><p className="visual-prompt">Which tile comes next?</p><div className="visual-options">{options.map((item) => <button key={item} type="button" className="visual-tile" onClick={() => onResult(item === answer)} style={{ background: colors[(item + offset) % 4] }} aria-label={`Option ${item + 1}, ${shapes[(item + offset) % 4]}`}>{shapes[(item + offset) % 4]}</button>)}</div></div>;
}

function MemoryRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const target = (round * 2 + 1) % 6;
  const [revealed, setRevealed] = useState(true);
  useEffect(() => { setRevealed(true); const timer = window.setTimeout(() => setRevealed(false), 1600); return () => window.clearTimeout(timer); }, [round]);
  return <div className="visual-challenge"><div className="memory-grid" aria-label={revealed ? "Remember the highlighted tile" : "Choose the tile that was highlighted"}>{Array.from({ length: 6 }, (_, index) => <button key={index} type="button" className={`memory-tile ${revealed && index === target ? "is-target" : ""}`} disabled={revealed} onClick={() => onResult(index === target)} aria-label={`Memory tile ${index + 1}`}>{revealed ? (index === target ? "★" : "·") : "?"}</button>)}</div><p className="visual-prompt">{revealed ? "Look carefully…" : "Where was the star?"}</p></div>;
}

function BridgeRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const stableFirst = round % 2 === 0;
  return <div className="visual-challenge"><div className="bridge-options" aria-label="Choose the stronger bridge"><button type="button" className="bridge-card" onClick={() => onResult(stableFirst)} aria-label="Bridge option one"><span className="bridge-bank" /><span className="bridge-blocks"><i /><i /><i /><i /></span><span className="bridge-bank" /></button><button type="button" className="bridge-card" onClick={() => onResult(!stableFirst)} aria-label="Bridge option two"><span className="bridge-bank" /><span className="bridge-blocks bridge-weak"><i /><i /><i /><i /></span><span className="bridge-bank" /></button></div><p className="visual-prompt">Which path can hold?</p><div className="visual-options"><span className="visual-hint-chip">Look at the support blocks</span></div></div>;
}

function RobotRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const arrows = ["↑", "→", "↓", "←"];
  const answer = (round + 1) % 4;
  return <div className="visual-challenge"><div className="robot-grid" aria-label="Robot route grid"><span className="robot-cell robot-start">●</span><span className="robot-cell" /><span className="robot-cell robot-goal">★</span><span className="robot-cell" /><span className="robot-cell robot-wall" /><span className="robot-cell" /><span className="robot-cell" /><span className="robot-cell" /><span className="robot-cell" /></div><p className="visual-prompt">Which arrow starts the safe route?</p><div className="visual-options">{arrows.map((arrow, index) => <button key={arrow} type="button" className="arrow-choice" onClick={() => onResult(index === answer)} aria-label={`Arrow ${arrow}`}>{arrow}</button>)}</div></div>;
}

function TrafficRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const safeLane = round % 3;
  return <div className="visual-challenge"><div className="traffic-lanes" aria-label="Three traffic lanes">{[0, 1, 2].map((lane) => <button key={lane} type="button" className={`traffic-lane ${lane === safeLane ? "is-safe" : "is-busy"}`} onClick={() => onResult(lane === safeLane)} aria-label={`Traffic lane ${lane + 1}`}><span className="traffic-light" /><span className="traffic-car">▰</span><span className="traffic-arrow">→</span></button>)}</div><p className="visual-prompt">Which lane is safe now?</p><div className="visual-options"><span className="visual-hint-chip">Watch the color signal</span></div></div>;
}

function CommanderRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const correct = round % 3;
  const steps = [["●", "→", "★"], ["▲", "●", "◆"], ["◆", "★", "●"]];
  return <div className="visual-challenge"><div className="command-sequence" aria-label="Mission symbols">{steps[round % steps.length].map((step, index) => <span key={index}>{step}</span>)}</div><p className="visual-prompt">Choose the next safe step</p><div className="visual-options command-options">{["●", "★", "◆"].map((symbol, index) => <button key={symbol} type="button" className="command-choice" onClick={() => onResult(index === correct)} aria-label={`Mission choice ${symbol}`}>{symbol}</button>)}</div></div>;
}

function CreativeRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const target = round % 2;
  return <div className="visual-challenge"><div className="creative-canvas" aria-label="Visual design canvas"><span className="creative-dot dot-a" /><span className={`creative-dot dot-b ${target ? "is-high" : ""}`} /><span className="creative-dot dot-c" /></div><p className="visual-prompt">Which scene feels balanced?</p><div className="visual-options"><button type="button" className="creative-choice is-balanced" onClick={() => onResult(target === 0)} aria-label="Balanced scene one">◼ ◻ ◼</button><button type="button" className="creative-choice" onClick={() => onResult(target === 1)} aria-label="Balanced scene two">◻ ◼ ◻</button></div></div>;
}

function PerformanceRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const sequence = round % 2 ? ["●", "●", "◆"] : ["●", "◆", "●"];
  return <div className="visual-challenge"><div className="beat-sequence" aria-label="Silent beat sequence">{sequence.map((beat, index) => <span key={index} className={beat === "◆" ? "is-accent" : ""}>{beat}</span>)}</div><p className="visual-prompt">Which rhythm matches?</p><div className="visual-options">{[["●", "◆", "●"], ["●", "●", "◆"]].map((choice, index) => <button key={index} type="button" className="beat-choice" onClick={() => onResult(choice.join("") === sequence.join(""))} aria-label={`Rhythm choice ${index + 1}`}>{choice.map((beat, beatIndex) => <span key={beatIndex}>{beat}</span>)}</button>)}</div></div>;
}

function ScientistRound({ round, onResult }: { round: number; onResult: (correct: boolean) => void }) {
  const answer = round % 2 === 0 ? 0 : 1;
  return <div className="visual-challenge"><div className="science-scene"><div className="science-cup" style={{ height: `${42 + round * 4}px`, background: round % 2 ? "#e87461" : "#5b9f8a" }} /><div className="science-arrow">→</div><div className="science-cup predicted" style={{ height: `${answer ? 70 : 34}px`, background: answer ? "#e87461" : "#5b9f8a" }} /></div><p className="visual-prompt">What will happen after the change?</p><div className="visual-options"><button type="button" className="science-option" onClick={() => onResult(answer === 0)}><span className="science-dot small" /> It stays small</button><button type="button" className="science-option" onClick={() => onResult(answer === 1)}><span className="science-dot large" /> It grows</button></div></div>;
}

export default function DiscoveryLabPage() {
  const [gameId, setGameId] = useState<VisualGameId>(() => { const requested = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("game") : null; return visualGames.some((item) => item.id === requested) ? requested as VisualGameId : "pattern-builder"; });
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState(() => visualSessionId("pattern-builder"));
  const [sessionStartedAt, setSessionStartedAt] = useState(() => Date.now());
  const [events, setEvents] = useState<VisualRoundEvent[]>([]);
  const game = useMemo(() => visualGames.find((item) => item.id === gameId) || visualGames[0], [gameId]);
  const begin = (next: VisualGameId) => { const nextSessionId = visualSessionId(next); const startedAt = Date.now(); setGameId(next); setStarted(true); setRound(0); setScore(0); setResult(null); setSessionId(nextSessionId); setSessionStartedAt(startedAt); setEvents([{ sessionId: nextSessionId, gameId: next, round: 0, action: "start" }]); startGame(next as GameId); trackLearningEvent("visual_game_started", { game: next }); };
  const answer = (correct: boolean) => { const event: VisualRoundEvent = { sessionId, gameId, round: round + 1, action: "choose", correct, elapsedMs: Date.now() - sessionStartedAt }; const nextEvents = [...events, event]; const summary = scoreVisualSession(nextEvents, 5); const nextScore = summary.score; setEvents(nextEvents); setScore(nextScore); setResult(correct ? 1 : 0); trackLearningEvent("visual_game_answer", { game: gameId, round: round + 1, correct }); window.setTimeout(() => { if (round === 4) { const completedEvents = [...nextEvents, { sessionId, gameId, round: 5, action: "complete" as const }]; const completedSummary = scoreVisualSession(completedEvents, 5); completeGame(gameId as GameId, completedSummary.score); trackLearningEvent("visual_game_completed", { game: gameId, score: completedSummary.score, rounds: completedSummary.rounds, quality: completedSummary.quality }); setStarted(false); setResult(completedSummary.score); } else { setRound((value) => value + 1); setResult(null); } }, 550); };
  return <div className="visual-lab-page"><header className="mission-header"><a className="mission-brand" href="/"><img src={assetUrls.mark} alt="" /><span><strong>AI</strong> for <em>Students</em></span></a><a className="mission-back" href="/play"><ArrowLeft size={15} /> Back to games</a><AuthControls /></header><main className="visual-lab-main"><section className="visual-lab-hero"><div><span className="mission-kicker"><Eye size={14} /> DISCOVERY LAB / PLAY FIRST</span><h1>Think with your eyes.<br /><em>Try, notice, discover.</em></h1><p>No long reading. No typing. Use colors, shapes, memory and simple choices to explore how you solve a challenge today.</p></div><div className="visual-lab-boundary"><strong>Practice only</strong><span>These activities are not IQ tests, diagnoses or career predictions.</span></div></section><section className="visual-lab-grid"><aside className="visual-game-list" aria-label="Visual discovery games"><span className="visual-section-label">CHOOSE A WORLD</span>{visualGames.map(({ id, title, note, icon: Icon, color }) => <button key={id} type="button" className={gameId === id ? "is-active" : ""} onClick={() => begin(id)}><span className="visual-game-icon" style={{ background: color }}><Icon size={18} /></span><span><strong>{title}</strong><small>{note}</small></span></button>)}</aside><section className="visual-board"><div className="visual-board-top"><span>ROUND {Math.min(round + 1, 5)} / 5</span><span>{game.title}</span></div>{!started && result === null ? <div className="visual-start"><div className="visual-start-symbol" style={{ background: game.color }}><Sparkles size={32} /></div><h2>{game.title}</h2><p>{game.note}. Tap the shapes, tiles or outcomes—words are only helpers.</p><button className="mission-button" type="button" onClick={() => begin(gameId)}>Start visual challenge</button></div> : started ? <>{gameId === "pattern-builder" && <PatternRound round={round} onResult={answer} />}{gameId === "memory-adventure" && <MemoryRound round={round} onResult={answer} />}{gameId === "mini-scientist" && <ScientistRound round={round} onResult={answer} />}{gameId === "bridge-builder" && <BridgeRound round={round} onResult={answer} />}{gameId === "robot-programmer" && <RobotRound round={round} onResult={answer} />}{gameId === "traffic-controller" && <TrafficRound round={round} onResult={answer} />}{gameId === "mission-commander" && <CommanderRound round={round} onResult={answer} />}{gameId === "creative-studio" && <CreativeRound round={round} onResult={answer} />}{gameId === "performance-arena" && <PerformanceRound round={round} onResult={answer} />}{result !== null && <div className={`visual-feedback ${result ? "is-good" : "is-try"}`} role="status">{result ? <><Check size={18} /> Nice noticing. Try the next one.</> : <>Try another pattern. You are learning by testing.</>}</div>}</> : <div className="visual-complete"><Check size={28} /><h2>Challenge complete</h2><strong>{result} / 5</strong><p>Based on this play only. Explore another world to build more varied evidence.</p><button className="mission-button" type="button" onClick={() => begin(gameId)}><RotateCcw size={16} /> Play again</button></div>}</section></section></main><footer className="mission-footer"><span>AI for Students</span><span>Practice is evidence. Labels are not.</span></footer></div>;
}
