import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardCopy, GraduationCap, ShieldCheck, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import AuthControls from "@/components/AuthControls";
import { SEO } from "@/components/SEO";
import { downloadTextFile, printPlainText } from "@/lib/resourceExport";
import { classroomCollections, formatClassroomCollection } from "@/data/classroomCollections";
import { publicUrl } from "@/lib/siteUrl";

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
  const [collectionId,setCollectionId] = useState(classroomCollections[0].id);
  const collection = classroomCollections.find(item=>item.id===collectionId) ?? classroomCollections[0];
  const collectionText = useMemo(()=>formatClassroomCollection(collection),[collection]);
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

Student practice link: ${publicUrl(lesson.href)}
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
      <section className="learn-path-panel" aria-labelledby="teacher-collections-title">
        <div className="learn-panel-heading"><div><span className="game-kicker">CURATED CLASSROOM SERIES / FREE</span><h2 id="teacher-collections-title">Teach across several sessions</h2></div><BookOpen size={22}/></div>
        <p>Choose a reviewed-for-structure teaching sequence with a learning objective, real activity and reflection prompt for each session. These are adaptable starting points, not curriculum-accredited courses.</p>
        <div className="topic-filters" role="group" aria-label="Classroom collections">
          {classroomCollections.map(item=><button type="button" key={item.id} className={collectionId===item.id?"is-active":""} aria-pressed={collectionId===item.id} onClick={()=>setCollectionId(item.id)}>{item.title}</button>)}
        </div>
        <div className="learn-card" style={{marginTop:22}}>
          <div className="learn-card-top"><span>{collection.sessions.length} CONNECTED SESSIONS</span><span>TEACHER-ADAPTABLE</span></div>
          <h2>{collection.title}</h2><p>{collection.description}</p><p><strong>Suggested audience:</strong> {collection.audience}</p>
          <h3>Learning outcomes</h3>
          <ul>{collection.outcomes.map(outcome=><li key={outcome}>{outcome}</li>)}</ul>
        </div>
        <div className="topic-grid" style={{marginTop:22}}>{collection.sessions.map((session,index)=><article className="learn-card" key={session.title}>
          <div className="learn-card-top"><span>SESSION {index+1}</span><span>{session.minutes} MINUTES</span></div>
          <h3>{session.title}</h3><p><strong>Objective:</strong> {session.goal}</p><p>{session.activity}</p>
          <div className="learn-try"><BookOpen size={16}/><span><strong>Reflect:</strong> {session.reflect}</span></div>
          <div className="learn-card-footer"><a href={session.href}>Open learning activity <ArrowRight size={15}/></a></div>
        </article>)}</div>
        <div className="learn-card-footer" style={{marginTop:22}}>
          <button type="button" onClick={()=>downloadTextFile("ai-literacy-collection-"+collection.id+".txt",collectionText)}><Download size={16}/> Download collection</button>
          <button type="button" onClick={()=>{if(!printPlainText(collection.title,collectionText)) toast.error("Allow pop-ups or use Download.");}}><Printer size={16}/> Print / Save PDF</button>
          <button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(collectionText);toast.success("Collection copied");}catch{toast.error("Clipboard unavailable. Try downloading.");}}}><ClipboardCopy size={16}/> Copy collection</button>
        </div>
      </section>
      <section aria-labelledby="teacher-resources-title"><h2 id="teacher-resources-title">More resources for educators</h2><div className="topic-grid"><a className="topic-card" href="/guides/how-to-check-ai-answers"><BookOpen size={19}/><div><strong>Fact-checking guide</strong><small>Source evaluation and uncertainty in plain language</small></div><ArrowRight size={16}/></a><a className="topic-card" href="/discovery-lab"><GraduationCap size={19}/><div><strong>Visual practice activities</strong><small>Choose short games for patterns, planning and experimentation</small></div><ArrowRight size={16}/></a></div></section>
      <aside className="learn-safety-note"><ShieldCheck size={19}/><p><strong>Teacher review required:</strong> Adapt activities to your students' ages, accessibility needs, local curriculum and school policies. The planner runs locally without collecting rosters, grades or student identifiers, and it does not provide verified learning-outcome scores.</p></aside>
      <p><a className="text-link" href="/plans">See free educator resources and future plan research <ArrowRight size={16}/></a></p>
      <p><a className="text-link" href="/contact">Need a classroom resource? Contact us <ArrowRight size={16}/></a></p>
    </main><footer className="game-page-footer"><span>AI for Students</span><a href="/contact">Contact</a></footer>
  </div>;
}
