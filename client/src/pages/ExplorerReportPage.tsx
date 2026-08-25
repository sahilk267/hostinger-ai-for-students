import { useMemo } from "react";
import { ArrowLeft, Copy, LockKeyhole, Share2, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import AuthControls from "@/components/AuthControls";
import { assetUrls } from "@/lib/assets";
import { EXPLORER_AGE_BANDS, EXPLORER_PILOT_MISSIONS, type ExplorerAgeBand } from "@/data/explorerLab";

const STORAGE_KEY = "aifs-explorer-pilot-v1";
const AGE_KEY = "aifs-explorer-age-band";

type RecordMap = Record<string, { completedAt: string; evidence: Record<string, string> }>;

function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export default function ExplorerReportPage() {
  const ageBand = readLocal<string>(AGE_KEY, "") as ExplorerAgeBand;
  const records = readLocal<RecordMap>(STORAGE_KEY, {});
  const missions = EXPLORER_PILOT_MISSIONS.filter((mission) => mission.ageBand === ageBand);
  const completed = missions.filter((mission) => records[mission.id]);
  const skillSignals = useMemo(() => {
    const counts = new Map<string, number>();
    completed.forEach((mission) => counts.set(mission.skill, (counts.get(mission.skill) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [completed]);
  const ageLabel = EXPLORER_AGE_BANDS.find((band) => band.id === ageBand)?.label ?? "Explorer";

  const share = async () => {
    const text = `My AI Explorer Lab snapshot: ${completed.length} practice missions completed in ${ageLabel}. It shows what I practiced, not a fixed label or prediction.`;
    try {
      if (navigator.share) await navigator.share({ title: "AI Explorer Lab snapshot", text });
      else { await navigator.clipboard.writeText(text); toast.success("Snapshot line copied"); }
    } catch { toast.error("Sharing was cancelled or unavailable"); }
  };

  return <div className="explorer-page"><header className="explorer-header"><a className="mission-brand" href="/"><img src={assetUrls.mark} alt="" /><span><strong>AI</strong> for <em>Students</em></span></a><a className="mission-back" href="/explorer"><ArrowLeft size={15} /> Back to Explorer Lab</a><AuthControls /></header><main className="explorer-report-main"><section className="explorer-report-hero"><div><span className="mission-kicker"><Sparkles size={14} /> PARENT VIEW · PRIVATE BY DEFAULT</span><h1>A snapshot of<br /><em>practice in motion.</em></h1><p>This view describes what the learner practiced in the Explorer Lab. It is not a psychological assessment, school grade, IQ score or prediction of a future career.</p></div><div className="explorer-report-lock"><LockKeyhole size={18} /><strong>Handle with care</strong><span>Use this as a conversation starter. Notice effort, ask what felt interesting and offer the next experiment without comparing children.</span></div></section>
    {completed.length < 3 ? <section className="explorer-report-empty"><Trophy size={24} /><h2>Complete three varied missions first.</h2><p>A single activity is not enough to describe a recurring practice signal. Complete at least three different missions, then return here with the learner and discuss what they noticed.</p><a className="explorer-report-primary" href="/explorer">Continue exploring <ArrowLeft size={15} /></a></section> : <>
      <section className="explorer-report-summary"><div className="explorer-report-summary-head"><div><span className="mission-section-label">EARLY PRACTICE SNAPSHOT</span><h2>{completed.length} missions, {skillSignals.length} practice areas.</h2></div><span className="explorer-report-badge"><Trophy size={17} /> {ageBand} years</span></div><p>These are observations from completed evidence. They become more useful when repeated in a different context and discussed with the learner.</p><div className="explorer-report-signals">{skillSignals.map(([skill, count], index) => <div key={skill}><span>0{index + 1}</span><strong>{skill}</strong><small>{count} evidenced {count === 1 ? "mission" : "missions"}</small></div>)}</div></section>
      <section className="explorer-report-next"><div><span className="mission-section-label">NEXT CONVERSATION</span><h2>Ask, don’t label.</h2><p>“Which mission felt most like you?” “What would you try differently next time?” “Where could we practice this skill in real life?”</p></div><div className="explorer-next-list"><span><b>01</b> Celebrate the learner’s explanation, not just the result.</span><span><b>02</b> Offer a new context before deciding a pattern is real.</span><span><b>03</b> Let the learner disagree with the snapshot.</span></div></section>
      <section className="explorer-report-actions-panel"><div><span className="mission-section-label">SHARING</span><h2>Share the journey,<br /><em>not private evidence.</em></h2><p>Only a short, non-identifying summary is shared. Raw responses, age details and personal information stay out of the share text.</p></div><div className="explorer-report-buttons"><button type="button" className="explorer-share" onClick={share}><Share2 size={15} /> Share snapshot</button><button type="button" className="explorer-reset" onClick={() => { window.print(); }}><Copy size={15} /> Print or save privately</button></div></section>
    </>}
  </main><footer className="mission-footer"><span>AI for Students</span><span>Practice is evidence. Labels are not.</span></footer></div>;
}
