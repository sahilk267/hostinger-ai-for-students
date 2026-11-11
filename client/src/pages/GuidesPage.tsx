import { ArrowLeft, ArrowRight, BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import AuthControls from "@/components/AuthControls";
import { SEO } from "@/components/SEO";
import { publicGuides } from "@/data/publicGuides";

export default function GuidesPage() {
  const [query, setQuery] = useState("");
  const guides = useMemo(() => publicGuides.filter((guide) =>
    [guide.title, guide.description, guide.category].join(" ").toLowerCase().includes(query.trim().toLowerCase())
  ), [query]);
  return <div className="topics-page">
    <SEO title="Free AI Guides for Students, Beginners and Parents" description="Explore free, practical AI learning guides: smarter studying, prompts, fact-checking, exam revision and AI safety for families." path="/guides" />
    <header className="game-header"><a className="game-brand" href="/"><strong>AI for <em>Students</em></strong></a><a className="game-return" href="/"><ArrowLeft size={16} /> Home</a><AuthControls /></header>
    <main className="topics-main">
      <section className="topics-hero"><span className="game-kicker">FREE STUDENT LEARNING RESOURCES</span><h1>AI guides you can<br /><em>actually use.</em></h1><p>Practical how-to guides, reusable prompt examples, safety checks and a related activity in every guide. Free to read, without sign-in.</p>
        <div className="topics-search"><Search size={18}/><input aria-label="Search free AI guides" placeholder="Find a guide about studying, prompts, safety..." value={query} onChange={event => setQuery(event.target.value)} /></div>
      </section>
      <section aria-label="Free AI guides" className="topic-grid">
        {guides.map((guide) => <a key={guide.slug} href={`/guides/${guide.slug}`} className="topic-card"><BookOpen size={18} /><div><small>{guide.category}</small><strong>{guide.title}</strong><small>{guide.description}</small></div><ArrowRight size={18}/></a>)}
      </section>
      {guides.length === 0 && <p className="topics-empty">No matching guides. Try a broader search.</p>}
      <section className="learn-safety-note"><BookOpen size={19}/><p>Use these resources to build skills, not to outsource assignments. Verify important claims and respect your school rules.</p></section>
      <a className="text-link" href="/topics">Browse all 120 AI learning topics <ArrowRight size={16}/></a>
    </main>
    <footer className="game-page-footer"><span>AI for Students</span><a href="/contact">Contact</a></footer>
  </div>;
}
