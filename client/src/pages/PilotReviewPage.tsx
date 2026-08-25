import { useMemo, useState } from "react";
import { ArrowLeft, Check, ClipboardCheck, LockKeyhole, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { EXPLORER_AGE_BANDS } from "@/data/explorerLab";
import AuthControls from "@/components/AuthControls";
import { assetUrls } from "@/lib/assets";

const STORAGE_KEY = "aifs-explorer-pilot-feedback-v1";
const modules = ["Plan Rescue", "Missing Clue", "Three Ways", "Friend Explain", "Rule Change", "Try Again"] as const;
const difficulties = ["Too easy", "About right", "Too hard", "Not clear"] as const;
const clarityOptions = ["Understood without reading help", "Needed read-aloud or facilitator help", "Could not understand the task"] as const;
type Feedback = { ageBand: string; module: string; device: string; difficulty: string; clarity: string; confusion: string; revision: string; createdAt: string };

function readFeedback(): Feedback[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function PilotReviewPage() {
  const [feedback, setFeedback] = useState<Feedback[]>(() => readFeedback());
  const [ageBand, setAgeBand] = useState("");
  const [module, setModule] = useState("");
  const [device, setDevice] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [clarity, setClarity] = useState("");
  const [confusion, setConfusion] = useState("");
  const [revision, setRevision] = useState("");
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [saved, setSaved] = useState(false);
  const complete = Boolean(ageBand && module && device && difficulty && clarity && privacyConfirmed);
  const reviewSummary = useMemo(() => feedback.reduce<Record<string, number>>((all, item) => ({ ...all, [item.difficulty]: (all[item.difficulty] || 0) + 1 }), {}), [feedback]);
  const moduleCounts = useMemo(() => feedback.reduce<Record<string, number>>((all, item) => ({ ...all, [item.module]: (all[item.module] || 0) + 1 }), {}), [feedback]);

  const save = () => {
    if (!complete) return;
    const next = [...feedback, { ageBand, module, device: device.slice(0, 80), difficulty, clarity, confusion: confusion.trim().slice(0, 240), revision: revision.trim().slice(0, 240), createdAt: new Date().toISOString() }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setFeedback(next); setSaved(true); setConfusion(""); setRevision(""); setPrivacyConfirmed(false); toast.success("Anonymous review saved on this device");
  };

  return <div className="pilot-review-page"><header className="mission-header"><a className="mission-brand" href="/"><img src={assetUrls.mark} alt="" /><span><strong>AI</strong> for <em>Students</em></span></a><a className="mission-back" href="/explorer"><ArrowLeft size={15} /> Back to Explorer</a><AuthControls /></header><main className="pilot-review-main">
    <section className="pilot-review-hero"><div><span className="mission-kicker"><Sparkles size={14} /> FACILITATOR WORKSPACE / PILOT ONLY</span><h1>Observe the play.<br /><em>Improve the mission.</em></h1><p>Capture what was easy, confusing or inaccessible without recording a child’s name, contact details, answer history or raw work.</p></div><div className="pilot-review-privacy"><LockKeyhole size={19} /><div><strong>Local-only notes</strong><span>This worksheet stays in this browser. Export or share it only after removing anything identifying.</span></div></div></section>
    <section className="pilot-review-grid"><form className="pilot-review-form" onSubmit={(event) => { event.preventDefault(); save(); }}><div className="pilot-review-section-label">ONE ANONYMOUS SESSION</div><div className="pilot-review-fields"><label>Age band<select value={ageBand} onChange={(event) => setAgeBand(event.target.value)} required><option value="">Choose one</option>{EXPLORER_AGE_BANDS.map((band) => <option key={band.id} value={band.id}>{band.id} — {band.label}</option>)}</select></label><label>Mission family<select value={module} onChange={(event) => setModule(event.target.value)} required><option value="">Choose one</option>{modules.map((item) => <option key={item}>{item}</option>)}</select></label><label>Device or setup<input value={device} onChange={(event) => setDevice(event.target.value)} placeholder="e.g. tablet + read-aloud" maxLength={80} required /></label><label>Difficulty<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} required><option value="">Choose one</option>{difficulties.map((item) => <option key={item}>{item}</option>)}</select></label><label>Comprehension support<select value={clarity} onChange={(event) => setClarity(event.target.value)} required><option value="">Choose one</option>{clarityOptions.map((item) => <option key={item}>{item}</option>)}</select></label></div><label>What caused confusion? <span>Do not include names or copied answers.</span><textarea value={confusion} onChange={(event) => setConfusion(event.target.value)} placeholder="Describe the screen, instruction or interaction—not the child." maxLength={240} /></label><label>Suggested revision <span>Keep it about the mission, not the learner.</span><textarea value={revision} onChange={(event) => setRevision(event.target.value)} placeholder="Short wording, visual or interaction change…" maxLength={240} /></label><label className="pilot-review-check"><input type="checkbox" checked={privacyConfirmed} onChange={(event) => setPrivacyConfirmed(event.target.checked)} required /><span>I confirm this note contains no identifying information or raw child evidence.</span></label><button className="mission-button" type="submit" disabled={!complete}><Save size={16} /> Save anonymous review</button>{saved && <p className="pilot-review-success" role="status"><Check size={15} /> Saved locally. Add another session or review the summary.</p>}</form>
      <aside className="pilot-review-summary"><div className="pilot-review-section-label">REVIEW STATUS</div><div className="pilot-review-count"><strong>{feedback.length}</strong><span>anonymous session notes</span></div>{feedback.length === 0 ? <p className="pilot-review-empty"><ClipboardCheck size={18} /> No pilot notes yet. Run five to ten varied sessions before changing difficulty claims.</p> : <div className="pilot-review-totals">{difficulties.map((item) => <div key={item}><span>{item}</span><strong>{reviewSummary[item] || 0}</strong></div>)}</div>}<div className="pilot-review-module-status"><strong>Mission evidence status</strong>{modules.map((item) => <div key={item}><span>{item}</span><small>{moduleCounts[item] || 0} notes · {moduleCounts[item] ? "facilitator approval pending" : "needs session evidence"}</small></div>)}</div><div className="pilot-review-boundary"><strong>Not a diagnosis</strong><p>These notes review the product experience. They must never become a label, IQ estimate, career prediction or child profile.</p></div></aside></section>
  </main><footer className="mission-footer"><span>AI for Students</span><span>Practice is evidence. Labels are not.</span></footer></div>;
}
