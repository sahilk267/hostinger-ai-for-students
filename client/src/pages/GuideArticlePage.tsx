import { ArrowLeft, ArrowRight, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "wouter";
import { toast } from "sonner";
import AuthControls from "@/components/AuthControls";
import { SEO } from "@/components/SEO";
import { getPublicGuide, publicGuides } from "@/data/publicGuides";
import NotFound from "./NotFound";
import { learningClusters } from "@/data/learningClusters";
import { trackLearningEvent } from "@/lib/analytics";
import { guideExercises } from "@/data/guideExercises";
import GuideSkillCheckCard from "@/components/GuideSkillCheckCard";
import { publicUrl } from "@/lib/siteUrl";

export default function GuideArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = getPublicGuide(slug || "");
  const [checked, setChecked] = useState<number[]>([]);
  const structuredData = useMemo(() => guide ? {
    "@context": "https://schema.org", "@type": "Article", headline: guide.title,
    description: guide.description, inLanguage: "en",
    author: { "@type": "Organization", name: "AI for Students" },
    publisher: { "@type": "Organization", name: "AI for Students" },
    mainEntityOfPage: publicUrl(`/guides/${guide.slug}`),
    isAccessibleForFree: true,
  } : undefined, [guide]);
  if (!guide) return <NotFound />;
  const more = publicGuides.filter((item) => item.slug !== guide.slug).slice(0, 3);
  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(guide.example); toast.success("Example prompt copied"); }
    catch { toast.error("Copy unavailable. Select the prompt text to copy it."); }
  };
  return <div className="topics-page">
    <SEO title={guide.title} description={guide.description} path={`/guides/${guide.slug}`} type="article" jsonLd={structuredData} />
    <header className="game-header"><a className="game-brand" href="/"><strong>AI for <em>Students</em></strong></a><a className="game-return" href="/guides"><ArrowLeft size={16} /> All guides</a><AuthControls /></header>
    <main className="topics-main">
      <article>
        <header className="topics-hero"><span className="game-kicker">{guide.category.toUpperCase()} / FREE HOW-TO GUIDE</span><h1>{guide.title}</h1><p>{guide.intro}</p></header>
        <section aria-label="Step-by-step guide" style={{ maxWidth: 840, margin: "2.5rem auto" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: 24 }}>Step-by-step: what to do</h2>
          {guide.steps.map((step, index) => <section key={step.heading} style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #d5cdbd" }}>
            <span className="game-kicker">STEP {index + 1} OF {guide.steps.length}</span><h3 style={{ fontSize: "1.35rem", margin: "8px 0" }}>{step.heading}</h3>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 750 }}>{step.body}</p>
          </section>)}
          <section aria-labelledby="worked-exercises-title" className="learn-path-panel" style={{margin:"32px 0"}}>
            <h2 id="worked-exercises-title">Worked examples and practice</h2>
            <p>These fictional exercises help you practise the skill yourself. No name, account or private text is required.</p>
            {(guideExercises[guide.slug] ?? []).map((exercise,index)=><article key={exercise.label} style={{padding:"18px 0",borderBottom:"1px solid #d5cdbd"}}>
              <span className="game-kicker">EXERCISE {index+1}</span>
              <h3>{exercise.label}</h3>
              <p><strong>Situation:</strong> {exercise.scenario}</p>
              <p><strong>Your task:</strong> {exercise.task}</p>
              <details style={{marginTop:12}}><summary style={{cursor:"pointer",fontWeight:700}}>Show one possible approach</summary><p>{exercise.modelApproach}</p></details>
              <p><strong>Check your work:</strong> {exercise.check}</p>
            </article>)}
          </section>
          <GuideSkillCheckCard key={guide.slug} slug={guide.slug} practiceHref={guide.relatedHref} />
          <section style={{ padding: 24, background: "#e9e6dc", borderRadius: 14, margin: "36px 0" }}>
            <h2 style={{ fontSize: "1.5rem" }}>Try this example prompt</h2>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.75, margin: "18px 0" }}>{guide.example}</p>
            <button type="button" className="button button--ink" onClick={copyPrompt}><Copy size={16} /> Copy example prompt</button>
          </section>
          <section aria-label="Practical checklist">
            <h2 style={{ fontSize: "1.5rem" }}>Before you finish: a quick checklist</h2>
            <p>Tick each item as you practise. These ticks stay only on this page.</p>
            {guide.checklist.map((item, index) => <label key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", cursor: "pointer" }}>
              <input type="checkbox" checked={checked.includes(index)} onChange={() => setChecked((current) => current.includes(index) ? current.filter((i) => i !== index) : [...current, index])} />
              <span>{item}</span>
            </label>)}
            {checked.length === guide.checklist.length && <p role="status"><CheckCircle2 size={16} /> Checklist complete. Now apply the ideas to a real task.</p>}
          </section>
          <div style={{ marginTop: 36 }}><a className="button button--primary" href={guide.relatedHref} onClick={()=>trackLearningEvent("guide_practice_click",{guide:guide.slug,destination:guide.relatedHref})}>Put this into practice <ExternalLink size={16}/></a><p>{guide.relatedLabel}</p></div>
        </section>
      </article>
      <section aria-label="Related learning collections" className="learn-path-panel"><h2>Choose a connected learning path</h2><div className="topic-grid">{learningClusters.filter(cluster=>cluster.guides.some(item=>item.href==="/guides/"+guide.slug)).map(cluster=><a href={"/resources/"+cluster.slug} className="topic-card" key={cluster.slug}><div><strong>{cluster.title}</strong><small>{cluster.description}</small></div><ArrowRight size={16}/></a>)}</div></section>
      <section style={{ marginTop: 48 }}><h2 style={{ fontSize: "1.7rem", marginBottom: 20 }}>Keep learning</h2><div className="topic-grid">{more.map(item => <a className="topic-card" href={`/guides/${item.slug}`} key={item.slug}><div><small>{item.category}</small><strong>{item.title}</strong></div><ArrowRight size={16}/></a>)}</div></section>
      <p style={{ marginTop: 36 }}><a className="text-link" href="/guides"><ArrowLeft size={16}/> Browse every free guide</a></p>
    </main>
    <footer className="game-page-footer"><span>AI for Students</span><a href="/contact">Contact</a></footer>
  </div>;
}
