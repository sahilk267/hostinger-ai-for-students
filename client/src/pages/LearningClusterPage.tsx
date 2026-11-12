import { ArrowLeft, ArrowRight, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { useParams } from "wouter";
import AuthControls from "@/components/AuthControls";
import { SEO } from "@/components/SEO";
import { getLearningCluster, learningClusters } from "@/data/learningClusters";
import { trackLearningEvent } from "@/lib/analytics";
import NotFound from "./NotFound";

export default function LearningClusterPage() {
  const {slug} = useParams<{slug:string}>();
  const cluster = getLearningCluster(slug??"");
  if (!cluster) return <NotFound/>;
  const path = "/resources/"+cluster.slug;
  return <div className="topics-page">
    <SEO title={cluster.title} description={cluster.description} path={path}/>
    <header className="game-header"><a className="game-brand" href="/"><strong>AI for <em>Students</em></strong></a><a className="game-return" href="/guides"><ArrowLeft size={16}/> Free guides</a><AuthControls/></header>
    <main className="topics-main">
      <section className="topics-hero"><span className="game-kicker">FREE LEARNING COLLECTION / AI FOR STUDENTS</span><h1>{cluster.title}</h1><p>{cluster.intro}</p><p><strong>For:</strong> {cluster.audience}</p></section>
      <section aria-labelledby="cluster-guides" className="learn-path-panel"><h2 id="cluster-guides">Learn the essentials</h2><p>Choose a guide that helps with your question before practising.</p>
        <div className="topic-grid">{cluster.guides.map(item=><a key={item.href} className="topic-card" href={item.href} onClick={()=>trackLearningEvent("resource_guide_click",{cluster:cluster.slug,destination:item.href})}><BookOpen size={18}/><div><strong>{item.title}</strong><small>{item.summary}</small></div><ArrowRight size={16}/></a>)}</div>
      </section>
      <section aria-labelledby="cluster-practice" className="learn-path-panel"><h2 id="cluster-practice">Put learning into practice</h2><p>Short activities with visible feedback. Activity results are practice records, not tests of intelligence.</p>
        <div className="topic-grid">{cluster.practice.map(item=><a key={item.href} className="topic-card" href={item.href} onClick={()=>trackLearningEvent("resource_practice_click",{cluster:cluster.slug,destination:item.href})}><Sparkles size={18}/><div><strong>{item.title}</strong><small>{item.why}</small></div><ArrowRight size={16}/></a>)}</div>
      </section>
      <section aria-labelledby="cluster-questions" className="learn-path-panel"><h2 id="cluster-questions">Common questions</h2>
        {cluster.questions.map(item=><article key={item.question} style={{padding:"14px 0",borderBottom:"1px solid #d5cdbd"}}><h3>{item.question}</h3><p>{item.answer}</p></article>)}
      </section>
      <aside className="learn-safety-note"><ShieldCheck size={18}/><p>Verify important AI claims against reliable sources. Follow school rules and external tools' age requirements. Games and plans are optional education resources, not validated assessments.</p></aside>
      <section aria-label="Other learning resources"><h2>Explore another learning collection</h2><div className="topic-grid">{learningClusters.filter(item=>item.slug!==cluster.slug).map(item=><a href={"/resources/"+item.slug} key={item.slug} className="topic-card"><div><strong>{item.title}</strong><small>{item.description}</small></div><ArrowRight size={16}/></a>)}</div></section>
    </main><footer className="game-page-footer"><span>AI for Students</span><a href="/teachers">Teacher resources</a></footer>
  </div>;
}
