import { ArrowLeft, LockKeyhole, Sparkles } from "lucide-react";
import AuthControls from "@/components/AuthControls";
import { assetUrls } from "@/lib/assets";
import { trpc } from "@/lib/trpc";

export default function ExplorerSharePage() {
  const token = window.location.pathname.split("/").filter(Boolean).at(-1) ?? "";
  const query = trpc.explorer.getShare.useQuery({ token }, { enabled: token.length >= 32 });
  const summary = query.data ? JSON.parse(query.data.summaryJson) as { completedCount?: number; skills?: string[] } : null;
  return <div className="explorer-page"><header className="explorer-header"><a className="mission-brand" href="/"><img src={assetUrls.mark} alt="" /><span><strong>AI</strong> for <em>Students</em></span></a><AuthControls /></header><main className="explorer-share-main">{query.isLoading ? <div className="explorer-share-state"><span className="mission-kicker"><Sparkles size={14} /> LOADING SNAPSHOT</span><h1>Opening the<br /><em>practice card.</em></h1></div> : !summary ? <div className="explorer-share-state"><LockKeyhole size={23} /><h1>This snapshot is<br /><em>no longer available.</em></h1><p>The parent may have revoked it, or its short sharing window has ended. Private evidence remains private.</p><a className="explorer-report-primary" href="/explorer"><ArrowLeft size={15} /> Explore the lab</a></div> : <div className="explorer-share-card"><span className="mission-kicker"><Sparkles size={14} /> AI EXPLORER LAB · PRACTICE SNAPSHOT</span><h1>Practice is<br /><em>in motion.</em></h1><p className="explorer-share-lead">{summary.completedCount ?? 0} varied missions completed.</p><div className="explorer-share-skills">{(summary.skills ?? []).map((skill, index) => <span key={skill}><b>0{index + 1}</b>{skill}</span>)}</div><div className="explorer-share-note"><LockKeyhole size={17} /><span>This card shows practice areas only. It contains no name, age, raw answer or prediction.</span></div><a className="explorer-report-primary" href="/explorer">Try the Explorer Lab <ArrowLeft size={15} /></a></div>}</main><footer className="mission-footer"><span>AI for Students</span><span>Practice is evidence. Labels are not.</span></footer></div>;
}
