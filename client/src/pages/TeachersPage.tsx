import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardCopy, GraduationCap, ShieldCheck, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import AuthControls from "@/components/AuthControls";
import { SEO } from "@/components/SEO";
import { downloadTextFile, printPlainText } from "@/lib/resourceExport";

type LessonTopic = "prompting" | "fact-checking" | "privacy" | "robotics";
const topics: Record<LessonTopic, {label:string; goal:string; warmup:string; practice:string; reflect:string; href:string}> = {
  prompting: {label:"Write clearer AI prompts",goal:"Students can add a goal, context, format and verification instruction to a prompt.",warmup:"Compare 'Tell me about space' with a request that explains the audience and desired response.",practice:"Pairs rewrite one vague prompt and explain why their revision is more useful.",reflect:"Which extra detail made the biggest difference, and what would you still check?",href:"/play"},
  "fact-checking": {label:"Verify AI-generated claims",goal:"Students can separate facts from assumptions and name a suitable independent source.",warmup:"Show a fictional AI claim and ask what evidence would make it trustworthy.",practice:"Teams underline checkable claims, find appropriate source types, and mark unresolved points.",reflect:"What made a source relevant? What remains uncertain?",href:"/play?game=fact"},
  privacy: {label:"Keep private data out of AI tools",goal:"Students can recognise and remove identifying details before using AI.",warmup:"Present a fictional prompt with a name, school and phone number; ask which details are unnecessary.",practice:"Students rewrite the fictional prompt to protect privacy while keeping the learning goal.",reflect:"Which information would you avoid sharing and who could you ask for help?",href:"/play?game=safety"},
  robotics: {label:"Plan, test and improve a robot route",goal:"Students can predict a simple route, test it and explain one revision.",warmup:"Ask learners to describe how a robot reaches a safe destination without skipping steps.",practice:"Small groups build a route, explain conditions and debug one wrong step.",reflect:"Which decision changed after observing the result?",href:"/robotics"},
};
const durations = [15,30,45] as const;

export default function TeachersPage() {
  const [topic,setTopic] = useState<LessonTopic>("prompting");
  const [duration,setDuration] = useState<number>(30);
  const [copied,setCopied] = useState(false);
  const lesson = topics[topic];
  const plan = useMemo(()=>{
    const warmup = Math.max(3,Math.round(duration*.2));
    const reflection = Math.max(3,Math.round(duration*.2));
    const practice = duration-warmup-reflection;
    return `AI FOR STUDENTS — CLASSROOM ACTIVITY PACK
Topic: ${lesson.label}
Duration: ${duration} minutes
Learning objective: ${lesson.goal}

1. WARM-UP (${warmup} min): ${lesson.warmup}
2. GUIDED PRACTICE (${practice} min): ${lesson.practice}
3. REFLECTION (${reflection} min): ${lesson.reflect}

Student practice link: https://aiforstudents.in${lesson.href}
Facilitator checklist:
- Use fictional or anonymised examples; do not paste student personal data.
- Allow students to explain their own reasoning before offering feedback.
- Check claims against authoritative sources; do not assume AI output is correct.
- Assess participation and reasoning, not intelligence or personality.
- Follow local school policy, accessibility needs and tool age requirements.
`;
  },[lesson,duration]);
  const copy = async()=>{try{await navigator.clipboard.writeText(plan);setCopied(true);toast.success("Lesson pack copied");}catch{toast.error("Copy unavailable. Select and copy the text below instead.");}};
  return <div className="topics-page">
    <SEO title="Free AI Literacy Lesson Planner for Teachers" description="Create a free 15, 30 or 45-minute AI literacy classroom activity covering prompts, fact-checking, privacy or robotics. No signup required." path="/teachers"/>
    <header className="game-header"><a className="game-brand" href="/"><strong>AI for <em>Students</em></strong></a><a className="game-return" href="/"><ArrowLeft size={15}/> Home</a><AuthControls/></header>
    <main className="topics-main">
      <section className="topics-hero"><span className="game-kicker">TEACHER SOLUTIONS / FREE RESOURCE</span><h1>Better AI literacy.<br/><em>Ready for the classroom.</em></h1><p>Create a short, editable learning activity using existing AI for Students practice games. Designed for discussion, source-checking and safe classroom use—not automated student grading.</p></section>
      <section className="learn-path-panel" aria-labelledby="teacher-builder-title">
        <div className="learn-panel-heading"><div><span className="game-kicker">CLASSROOM ACTIVITY BUILDER</span><h2 id="teacher-builder-title">Generate an activity pack</h2></div><GraduationCap size={24}/></div>
        <div style={{display:"grid",gap:20,marginTop:20}}>
          <div><label htmlFor="teacher-topic"><strong>Choose a learning objective</strong></label><select id="teacher-topic" style={{display:"block",width:"100%",maxWidth:540,padding:12,marginTop:8}} value={topic} onChange={e=>{setTopic(e.target.value as LessonTopic);setCopied(false);}}>{(Object.entries(topics) as [LessonTopic,typeof lesson][]).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}</select></div>
          <div><strong>Session length</strong><div className="topic-filters" role="group" aria-label="Session length">{durations.map(value=><button key={value} type="button" className={duration===value?"is-active":""} aria-pressed={duration===value} onClick={()=>{setDuration(value);setCopied(false);}}>{value} minutes</button>)}</div></div>
        </div>
        <div className="learn-card" style={{marginTop:24}}>
          <div className="learn-card-top"><span>FREE TEACHER PACK</span><span>{duration} MINUTES</span></div>
          <h2>{lesson.label}</h2><p><strong>Learning objective:</strong> {lesson.goal}</p>
          <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",fontFamily:"inherit",lineHeight:1.7,margin:"20px 0",fontSize:"0.95rem"}}>{plan}</pre>
          <div className="learn-card-footer"><button type="button" onClick={copy}>{copied?<Check size={16}/>:<ClipboardCopy size={16}/>} {copied?"Copied":"Copy classroom pack"}</button>
          <button type="button" onClick={()=>downloadTextFile("ai-literacy-"+topic+"-"+duration+"min.txt",plan)}><Download size={16}/> Download editable pack</button>
          <button type="button" onClick={()=>{if(!printPlainText("AI literacy classroom pack",plan)) toast.error("Allow pop-ups to print, or download the pack.");}}><Printer size={16}/> Print / Save PDF</button>
          <a href={lesson.href}>Preview student activity <ArrowRight size={16}/></a></div>
        </div>
      </section>
      <section aria-labelledby="teacher-resources-title"><h2 id="teacher-resources-title">More resources for educators</h2><div className="topic-grid"><a className="topic-card" href="/guides/how-to-check-ai-answers"><BookOpen size={19}/><div><strong>Fact-checking guide</strong><small>Source evaluation and uncertainty in plain language</small></div><ArrowRight size={16}/></a><a className="topic-card" href="/discovery-lab"><GraduationCap size={19}/><div><strong>Visual practice activities</strong><small>Choose short games for patterns, planning and experimentation</small></div><ArrowRight size={16}/></a></div></section>
      <aside className="learn-safety-note"><ShieldCheck size={19}/><p><strong>Teacher review required:</strong> Adapt activities to your students' ages, accessibility needs, local curriculum and school policies. The planner runs locally without collecting rosters, grades or student identifiers, and it does not provide verified learning-outcome scores.</p></aside>
      <p><a className="text-link" href="/contact">Need a classroom resource? Contact us <ArrowRight size={16}/></a></p>
    </main><footer className="game-page-footer"><span>AI for Students</span><a href="/contact">Contact</a></footer>
  </div>;
}
