import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Copy, LockKeyhole, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AuthControls from "@/components/AuthControls";
import { dailyJourney } from "@/data/dailyJourney";
import { assetUrls } from "@/lib/assets";

const STORAGE_KEY = "aifs-30-day-journey-v2";
type JourneyState = { startedOn: string; completedDays: number[]; lastCompletedOn: string | null; evidenceByDay: Record<string, string> };
const todayKey = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
const daysBetween = (from: string, to: string) => { const [fy, fm, fd] = from.split("-").map(Number); const [ty, tm, td] = to.split("-").map(Number); return Math.floor((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000); };
const initialState = (): JourneyState => ({ startedOn: todayKey(), completedDays: [], lastCompletedOn: null, evidenceByDay: {} });

function loadState(): JourneyState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as JourneyState : initialState();
  } catch { return initialState(); }
}

function saveState(state: JourneyState) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

export default function JourneyPage() {
  const [state, setState] = useState<JourneyState>(() => loadState());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [response, setResponse] = useState("");
  const [checkedWork, setCheckedWork] = useState(false);
  const [checkedReview, setCheckedReview] = useState(false);
  const [formError, setFormError] = useState("");
  const today = todayKey();
  const elapsedDay = Math.min(30, Math.max(1, daysBetween(state.startedOn, today) + 1));
  const completedToday = state.lastCompletedOn === today;
  const nextSequentialDay = state.completedDays.length + 1;
  const availableDay = completedToday ? 0 : Math.min(elapsedDay, nextSequentialDay);
  const activeDay = selectedDay || (availableDay || Math.min(30, state.completedDays[state.completedDays.length - 1] || 1));
  const active = dailyJourney[activeDay - 1];
  const isCompleted = state.completedDays.includes(activeDay);
  const isLocked = !isCompleted && (availableDay === 0 || activeDay > availableDay);
  const progressPercent = Math.round((state.completedDays.length / 30) * 100);
  const arcProgress = useMemo(() => dailyJourney.filter((day) => state.completedDays.includes(day.day)).reduce<Record<string, number>>((all, day) => ({ ...all, [day.arc]: (all[day.arc] || 0) + 1 }), {}), [state.completedDays]);

  const completeDay = () => {
    if (isLocked || isCompleted || completedToday) return;
    if (response.trim().length < 40) { setFormError("Write at least 40 characters so there is real work behind this milestone."); return; }
    if (!checkedWork || !checkedReview) { setFormError("Complete both checks before claiming today’s milestone."); return; }
    const next = { ...state, completedDays: [...state.completedDays, activeDay].sort((a, b) => a - b), lastCompletedOn: today, evidenceByDay: { ...state.evidenceByDay, [activeDay]: response.trim() } };
    saveState(next); setState(next); setFormError(""); toast.success(`Day ${activeDay} milestone earned`);
  };

  const share = async () => {
    const text = `I completed Day ${active.day} of the 30-Day AI Skill Journey: ${active.title}. My milestone: ${active.outcome}.`;
    try {
      if (typeof navigator.share === "function") await navigator.share({ title: "30-Day AI Skill Journey", text });
      else await navigator.clipboard.writeText(text);
      toast.success(typeof navigator.share === "function" ? "Milestone shared" : "Milestone text copied");
    } catch { toast.error("Sharing was cancelled"); }
  };

  return <div className="journey-page"><header className="journey-header"><a className="mission-brand" href="/"><img src={assetUrls.mark} alt="" /><span><strong>AI</strong> for <em>Students</em></span></a><a className="mission-back" href="/"><ArrowLeft size={15} /> Back to the desk</a><AuthControls /></header><main className="journey-main">
    <section className="journey-hero"><div><span className="mission-kicker"><Sparkles size={14} /> THE 30-DAY AI SKILL JOURNEY</span><h1>One useful habit.<br /><em>Every single day.</em></h1><p>Build proof that you can use AI thoughtfully: one real-world milestone per day, one day at a time. Day 2 does not open until tomorrow.</p></div><div className="journey-progress-card"><div className="journey-progress-top"><span>YOUR JOURNEY</span><strong>{state.completedDays.length} / 30</strong></div><div className="journey-progress-track"><span style={{ width: `${progressPercent}%` }} /></div><small>{completedToday ? "Today’s milestone is complete. Come back tomorrow." : availableDay ? `Day ${availableDay} is ready for you.` : "Your next milestone opens tomorrow."}</small></div></section>
    <section className="journey-layout"><aside className="journey-map"><div className="journey-map-top"><span>THE SKILL MAP</span><CalendarDays size={16} /></div>{["FOUNDATIONS", "STUDY SYSTEMS", "RESEARCH & EVIDENCE", "BUILD & CREATE", "CODE & AUTOMATION", "CAREER & LIFE"].map((arc) => <div className="journey-arc" key={arc}><div><strong>{arc}</strong><small>{arcProgress[arc] || 0} / 5 complete</small></div><div className="journey-days">{dailyJourney.filter((day) => day.arc === arc).map((day) => { const done = state.completedDays.includes(day.day); const locked = !done && (day.day > availableDay || completedToday); return <button type="button" key={day.day} className={`journey-day ${done ? "is-done" : ""} ${day.day === activeDay ? "is-active" : ""} ${locked ? "is-locked" : ""}`} onClick={() => setSelectedDay(day.day)} aria-label={`Day ${day.day}: ${day.title}${locked ? ", locked" : ""}`}><span>{locked ? <LockKeyhole size={11} /> : done ? <Check size={12} /> : day.day}</span></button>; })}</div></div>)}</aside>
      <section className="journey-detail"><div className="journey-detail-top"><span>DAY {String(active.day).padStart(2, "0")} / {active.arc}</span>{isLocked ? <span className="journey-lock"><LockKeyhole size={13} /> Opens tomorrow</span> : isCompleted ? <span className="journey-earned"><Check size={13} /> Milestone earned</span> : <span><Clock3 size={13} /> One mission today</span>}</div><h2>{active.title}</h2><p className="journey-outcome"><strong>YOU WILL LEAVE WITH</strong>{active.outcome}</p><div className={`journey-action-card ${isLocked ? "is-locked" : ""}`}><div className="journey-action-label">TODAY’S ACTION</div><p>{active.action}</p>{active.explorerPilotKey && !isLocked && <a className="journey-explorer-link" href={`/explorer?mission=${active.explorerPilotKey}`}><Sparkles size={15} /> Play the matching Explorer mission <ArrowRight size={15} /></a>}{isLocked ? <div className="journey-locked-message"><LockKeyhole size={18} /><span>{completedToday ? "You have completed today’s milestone." : `Finish the previous day and return tomorrow to unlock Day ${active.day}.`}</span></div> : isCompleted ? <div className="journey-completed-note"><Check size={17} /> You submitted your work for this milestone.</div> : <div className="journey-exercise"><label htmlFor="journey-evidence">SHOW YOUR WORK <span>What did you write, test or decide?</span></label><textarea id="journey-evidence" value={response} onChange={(event) => { setResponse(event.target.value); setFormError(""); }} placeholder="Write the output you created or the decision you made. Be specific enough that your future self can recognize the work." maxLength={800} /><small>{response.trim().length}/40 minimum characters</small><label className="journey-check"><input type="checkbox" checked={checkedWork} onChange={(event) => setCheckedWork(event.target.checked)} /> I completed the action above on a real task.</label><label className="journey-check"><input type="checkbox" checked={checkedReview} onChange={(event) => setCheckedReview(event.target.checked)} /> I reviewed the result and kept my own judgment.</label>{formError && <p className="journey-form-error" role="alert">{formError}</p>}<button type="button" className="mission-button" onClick={completeDay}>Submit today’s work <ArrowRight size={16} /></button></div>}</div><div className="journey-proof"><span className="mission-section-label">YOUR PROOF</span><p>{active.proof}</p>{isCompleted && <div className="journey-share-card"><div><span>AI FOR STUDENTS</span><strong>DAY {active.day} MILESTONE</strong><small>{active.title}</small></div><button type="button" onClick={share} aria-label="Share milestone"><Share2 size={17} /></button></div>}{isCompleted && <button type="button" className="journey-copy" onClick={() => navigator.clipboard.writeText(`I completed Day ${active.day}: ${active.title} — ${active.outcome}`)}><Copy size={14} /> Copy milestone line</button>}</div></section></section>
    <div className="journey-note"><strong>Why one a day?</strong><span>Because the goal is not to finish a content library. It is to build a habit you can carry into study, work and everyday decisions.</span></div>
  </main><footer className="mission-footer"><span>AI for Students</span><span>Learn the tool. Keep the thinking.</span></footer></div>;
}
