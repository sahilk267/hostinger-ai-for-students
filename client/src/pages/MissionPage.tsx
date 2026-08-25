import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clipboard, Copy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AuthControls from "@/components/AuthControls";
import { assetUrls } from "@/lib/assets";

type Mission = {
  id: string;
  label: string;
  title: string;
  description: string;
  prompt: (task: string) => string;
  checks: string[];
};

const missions: Mission[] = [
  {
    id: "unstuck",
    label: "UNSTUCK IN 5 MINUTES",
    title: "Turn a messy task into a clear next move",
    description: "For an assignment, project or personal problem that feels too vague to start.",
    prompt: (task) => `Act as a thinking partner, not a shortcut. Help me make progress on this task: ${task}\n\nFirst, restate the goal in one sentence. Then ask up to three clarifying questions. After I answer, give me a small first step, a draft structure and a checklist for reviewing my own work. Clearly label assumptions and do not invent facts.`,
    checks: ["Is the goal specific enough to finish?", "Which assumptions need confirmation?", "What part must remain my own thinking?"],
  },
  {
    id: "study",
    label: "STUDY SPRINT",
    title: "Convert confusion into a practice session",
    description: "For a difficult chapter, lecture or concept you need to actually understand.",
    prompt: (task) => `Be my learning coach for this topic: ${task}\n\nDo not give me a long lecture. Start by asking what I already understand. Build a 15-minute practice session with one plain-language explanation, one analogy, three retrieval questions and one application task. Wait for my answers before revealing solutions, and point out misconceptions gently.`,
    checks: ["Did I explain the idea in my own words?", "Can I apply it to a new example?", "Which misconception should I revisit?"],
  },
  {
    id: "real-world",
    label: "REAL-WORLD CHECK",
    title: "Make an AI answer safer to use",
    description: "For research, recommendations or decisions where a confident answer is not enough.",
    prompt: (task) => `Help me investigate this question responsibly: ${task}\n\nSeparate known information, assumptions and unknowns. Suggest what evidence would change the conclusion, what sources I should check and what could make the answer misleading. Do not present generated claims as verified facts. Finish with a decision or follow-up checklist for a human.`,
    checks: ["What is the original evidence?", "What could be missing or biased?", "What decision still belongs to a human?"],
  },
];

function copyText(text: string, message: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(message)).catch(() => toast.error("Please select and copy the text manually"));
}

export default function MissionPage() {
  const [missionId, setMissionId] = useState("unstuck");
  const [task, setTask] = useState("");
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const mission = useMemo(() => missions.find((item) => item.id === missionId) ?? missions[0], [missionId]);
  const output = task.trim() ? mission.prompt(task.trim()) : "";

  const startMission = () => {
    if (task.trim().length < 8) {
      toast.error("Add a little more detail so the mission can be useful");
      return;
    }
    setStarted(true);
    setCompleted(false);
  };

  const finishMission = () => {
    setCompleted(true);
    const key = "aifs-missions-completed";
    const previous = Number(localStorage.getItem(key) || "0");
    localStorage.setItem(key, String(previous + 1));
    toast.success("Mission complete — your workflow is ready to use");
  };

  return (
    <div className="mission-page">
      <header className="mission-header">
        <a className="mission-brand" href="/"><img src={assetUrls.mark} alt="" /><span><strong>AI</strong> for <em>Students</em></span></a>
        <a className="mission-back" href="/"><ArrowLeft size={15} /> Back to the desk</a>
        <AuthControls />
      </header>
      <main className="mission-main">
        <section className="mission-hero">
          <div>
            <span className="mission-kicker"><Sparkles size={14} /> THE 5-MINUTE MISSION STUDIO</span>
            <h1>Bring a real task.<br /><em>Leave with a way forward.</em></h1>
            <p>Not another quiz. Choose a mission, describe what is actually in front of you and build an AI workflow you can use without handing over your judgment.</p>
          </div>
          <div className="mission-proof"><span>01</span><strong>Describe</strong><small>the task in your own words</small><span>02</span><strong>Build</strong><small>a useful AI starting point</small><span>03</span><strong>Review</strong><small>before you trust the output</small></div>
        </section>

        <section className="mission-studio" aria-label="Mission Studio">
          <div className="mission-sidebar">
            <span className="mission-section-label">CHOOSE YOUR MISSION</span>
            {missions.map((item) => <button key={item.id} type="button" className={`mission-option ${mission.id === item.id ? "is-selected" : ""}`} onClick={() => { setMissionId(item.id); setStarted(false); setCompleted(false); }}><span>{item.label}</span><strong>{item.title}</strong><small>{item.description}</small><ArrowRight size={15} /></button>)}
            <div className="mission-side-note"><Clipboard size={16} /><span>Your result stays in this browser unless you choose to copy or share it.</span></div>
          </div>
          <div className="mission-workspace">
            {!started ? <>
              <div className="mission-workspace-top"><span>{mission.label}</span><span>STEP 01 / 03</span></div>
              <h2>{mission.title}</h2>
              <p className="mission-question">What are you trying to do? Be specific enough that another person could understand the situation.</p>
              <textarea value={task} onChange={(event) => setTask(event.target.value)} placeholder="Example: I have two hours to prepare for a biology test, but I keep memorising terms without understanding how they connect." aria-label="Describe your real task" />
              <div className="mission-workspace-footer"><small>{task.trim().length}/500 characters</small><button type="button" className="mission-button" onClick={startMission}>Build my mission <ArrowRight size={16} /></button></div>
            </> : <>
              <div className="mission-workspace-top"><span>{mission.label}</span><span>STEP 02 / 03</span></div>
              <h2>Your starting workflow is ready.</h2>
              <p className="mission-question">Copy it into your AI tool, then keep the review questions beside you. The point is progress you can inspect—not a magic answer.</p>
              <div className="mission-output"><p>{output}</p><button type="button" className="mission-copy" onClick={() => copyText(output, "Workflow copied")}>{completed ? <Check size={15} /> : <Copy size={15} />} {completed ? "Mission complete" : "Copy workflow"}</button></div>
              <div className="mission-review"><div className="mission-review-heading"><span>STEP 03 / REVIEW BEFORE YOU USE IT</span><small>Three questions to keep the thinking yours</small></div>{mission.checks.map((check, index) => <div className="mission-check" key={check}><span>0{index + 1}</span><p>{check}</p></div>)}</div>
              <div className="mission-workspace-footer"><button type="button" className="mission-reset" onClick={() => { setStarted(false); setCompleted(false); }}><RefreshCw size={15} /> Try another task</button><button type="button" className="mission-button" onClick={finishMission} disabled={completed}>{completed ? "Saved in this session" : "Mark mission complete"}<Check size={16} /></button></div>
            </>}
          </div>
        </section>
        <section className="mission-share"><div><span className="mission-section-label">WHY THIS IS DIFFERENT</span><h2>AI should help you move,<br /><em>not make you disappear.</em></h2></div><p>Every mission produces three things: a better request, a review habit and a small action you can take now. That is the loop we are building across the platform.</p><button type="button" className="mission-share-button" onClick={() => copyText(`I completed a ${mission.label.toLowerCase()} on AI for Students.`, "Share line copied")}>Share this mission <ArrowRight size={15} /></button></section>
      </main>
      <footer className="mission-footer"><span>AI for Students</span><span>Learn the tool. Keep the thinking.</span></footer>
    </div>
  );
}
