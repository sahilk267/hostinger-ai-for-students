/* Study Desk Editorial: warm paper, ink typography, saffron signals, asymmetric learning-desk composition. */
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  GraduationCap,
  Menu,
  Search,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import AuthControls from "@/components/AuthControls";
import { assetUrls } from "@/lib/assets";

const heroImage = assetUrls.hero;
const studyImage = assetUrls.study;
const careerImage = assetUrls.career;
const markImage = assetUrls.mark;

const prompts = [
  { id: "explain", label: "STUDY / 01", title: "Make a difficult idea feel simple", body: "Explain [topic] like I am learning it for the first time. Use one everyday analogy, three examples and a five-question quiz. Show the reasoning.", tag: "Understand" },
  { id: "revise", label: "STUDY / 02", title: "Turn notes into a revision plan", body: "Turn these notes into a focused revision plan. Identify five key ideas, gaps to revisit and one active-recall activity for each.", tag: "Revise" },
  { id: "feedback", label: "STUDY / 03", title: "Get feedback without losing your voice", body: "Review my draft for clarity and structure. Point out confusing parts, ask improvement questions and suggest edits without rewriting it completely.", tag: "Improve" },
  { id: "quiz", label: "STUDY / 04", title: "Practice before you look at answers", body: "Create eight questions about [topic], one at a time. Wait for my answer, give a hint before the solution and explain the mistake without shaming me.", tag: "Practice" },
  { id: "socratic", label: "STUDY / 05", title: "Use a Socratic study partner", body: "Help me understand [concept] by asking one question at a time. Do not give the answer immediately; use my responses to choose the next question.", tag: "Think" },
  { id: "essay", label: "WRITING / 06", title: "Build an argument map", body: "Turn this essay question into a claim, three supporting reasons, evidence I need and one fair counterargument. Flag anything that still needs research.", tag: "Structure" },
  { id: "voice", label: "WRITING / 07", title: "Polish the draft, keep the author", body: "Improve grammar and clarity in this draft while preserving my tone and ideas. Show the meaningful changes and explain any change that alters emphasis.", tag: "Edit" },
  { id: "sources", label: "RESEARCH / 08", title: "Separate claims from evidence", body: "Break this passage into factual claims, opinions and assumptions. For each factual claim, tell me what source or check would be needed before I rely on it.", tag: "Check" },
  { id: "research-plan", label: "RESEARCH / 09", title: "Start a source-led research plan", body: "Create a research plan for [question]. Suggest search terms, source types, inclusion criteria and a table for recording claim, evidence and confidence.", tag: "Investigate" },
  { id: "compare", label: "RESEARCH / 10", title: "Compare two sources fairly", body: "Compare these sources by claim, evidence, date, expertise and limitations. Do not choose a winner based only on confident language.", tag: "Compare" },
  { id: "debug", label: "CODING / 11", title: "Debug with hypotheses first", body: "Help me debug this code. First restate the expected behavior, list the three most likely causes and propose the smallest test for each before suggesting a fix.", tag: "Debug" },
  { id: "review", label: "CODING / 12", title: "Review code for risk", body: "Review this code for correctness, input validation, privacy and maintainability. Rank findings by severity and show a minimal safe improvement for each.", tag: "Review" },
  { id: "career-cv", label: "CAREER / 13", title: "Turn experience into evidence", body: "Convert these responsibilities into achievement-focused CV bullets using action, task, result and evidence. Do not invent numbers; mark missing details as questions.", tag: "CV" },
  { id: "interview", label: "CAREER / 14", title: "Practice a realistic interview", body: "Interview me for [role] one question at a time. Ask follow-ups, wait for my answer, then give feedback on clarity, evidence and relevance.", tag: "Prepare" },
  { id: "brief", label: "CREATION / 15", title: "Turn an idea into a useful brief", body: "Turn this idea into a creative brief with audience, purpose, key message, constraints, references and a definition of success. Ask before assuming.", tag: "Create" },
  { id: "workflow", label: "WORKFLOW / 16", title: "Design a repeatable AI workflow", body: "Design a safe workflow for [task] with input, prompt, review checkpoint, human decision and final output. Highlight where private data should not be pasted.", tag: "Workflow" },
  { id: "privacy", label: "SAFETY / 17", title: "Check privacy before sharing", body: "Review this text for personal, confidential or identifying information. Classify each risk and suggest a redacted version without weakening the task.", tag: "Privacy" },
  { id: "decision", label: "SAFETY / 18", title: "Keep the human in the decision", body: "Help me compare these options by criteria, uncertainty and trade-offs. Do not make the final decision for me; finish with questions I should answer.", tag: "Judgment" },
];

const toolkit = [
  { icon: BookOpen, label: "Learn AI", copy: "Start with the essentials", color: "sage" },
  { icon: GraduationCap, label: "Study smarter", copy: "Prompts for real learning", color: "saffron" },
  { icon: BriefcaseBusiness, label: "Build your edge", copy: "Career and skill workflows", color: "clay" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span className="section-label__bar" />
      <span>{children}</span>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const navItems = ["Learn AI", "Study with AI", "Prompts", "Tools", "Career"];
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="AI for Students home">
          <img src={markImage} alt="" className="brand-mark" />
          <span className="brand-type"><strong>AI</strong> for <em>Students</em></span>
        </a>
        <nav className={`desktop-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">
          {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>{item}</a>)}
        </nav>
        <div className="header-actions">
          <a className="header-link" href="/progress">Your progress <ArrowUpRight size={14} /></a>
          <AuthControls />
          <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Prompt copied to your clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Please select and copy the prompt manually");
    }
  };
  return <button className={`copy-button ${copied ? "is-copied" : ""}`} onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy prompt"}</button>;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activePrompt, setActivePrompt] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const filteredPrompts = useMemo(() => prompts.filter((prompt) => `${prompt.title} ${prompt.tag}`.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

  const submitNewsletter = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubmitted(true);
    toast.success("You are on the list. Your starter kit is on its way.");
  };

  return (
    <div className="app-shell" id="top">
      <Header />
      <main>
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <SectionLabel>THE PRACTICAL AI DESK</SectionLabel>
              <h1>Learn the tool.<br /><span>Keep the thinking.</span></h1>
              <p className="hero-lede">A clear, useful place for students and curious learners to understand AI, build better habits and get unstuck—without handing over the work that makes learning matter.</p>
              <div className="hero-actions">
                <a href="/mission" className="button button--primary">Solve a real task <ArrowUpRight size={16} /></a>
                <a href="#prompts" className="text-link">Browse prompts <ChevronRight size={16} /></a><a href="/topics" className="text-link">Explore 120 topics <ChevronRight size={16} /></a>
              </div>
              <div className="hero-note"><span className="note-pin" /> No hype. No shortcuts. Just useful next steps.</div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-frame">
                <img src={heroImage} alt="A warm study desk with notes and an AI toolkit" />
                <div className="image-caption"><span>FIELD NOTE 01</span><strong>Your best AI workflow starts with a better question.</strong></div>
              </div>
              <div className="toolkit-stack" aria-label="Quick learning paths">
                <div className="stack-heading"><span>Today's toolkit</span><Sparkles size={15} /></div>
                {toolkit.map(({ icon: Icon, label, copy, color }, index) => <a href={index === 1 ? "/play" : "#learn-ai"} className={`toolkit-row toolkit-row--${color}`} key={label}><span className="toolkit-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{copy}</small></span><ArrowUpRight size={16} /></a>)}
              </div>
            </div>
          </div>
          <div className="hero-bottom-note"><span>Scroll to find your next useful thing</span><span className="scroll-line" /></div>
        </section>

        <section className="path-section" id="learn-ai">
          <div className="container path-layout">
            <div className="path-intro"><SectionLabel>START WHERE YOU ARE</SectionLabel><h2>Choose a path,<br /><em>not a rabbit hole.</em></h2><p>AI is a tool. The right workflow is what makes it useful. Pick the problem in front of you and we will point you toward a sensible first move.</p></div>
            <div className="path-list">
              {[
                ["01", "I want to understand AI", "Plain-language lessons for the curious beginner", "Learn the essentials"],
                ["02", "I want to study better", "Prompts and workflows that protect your thinking", "Explore study tools"],
                ["03", "I want to get career-ready", "Practical help for CVs, interviews and new skills", "Build your edge"],
              ].map(([num, title, copy, cta]) => <a className="path-row" href={num === "02" ? "/play" : "#prompts"} key={num}><span className="path-number">{num}</span><span className="path-content"><strong>{title}</strong><small>{copy}</small></span><span className="path-cta">{cta} <ArrowUpRight size={15} /></span></a>)}
            </div>
          </div>
        </section>

        <section className="feature-section" id="study-with-ai">
          <div className="container feature-layout">
            <div className="feature-image-wrap"><img src={studyImage} alt="Study notes and flashcards arranged on a desk" /><span className="image-stamp">TRY THIS</span></div>
            <div className="feature-copy"><SectionLabel>STUDY WITH AI</SectionLabel><h2>Use AI as a<br /><em>thinking partner.</em></h2><p>Good study support does not give you an answer and disappear. It helps you ask a sharper question, spot a gap and practice until the idea is yours.</p><div className="check-list"><span><Check size={15} /> Explain a concept in your own words</span><span><Check size={15} /> Turn notes into active recall</span><span><Check size={15} /> Get feedback without losing your voice</span></div><a href="/mission" className="button button--ink">Start a 5-minute mission <ArrowUpRight size={16} /></a></div>
          </div>
        </section>

        <section className="mission-teaser-section" id="mission-studio"><div className="container mission-teaser"><div className="mission-teaser-copy"><SectionLabel>NEW / MISSION STUDIO</SectionLabel><h2>Don’t just read about AI.<br /><em>Use it on something real.</em></h2><p>Bring an assignment, confusing topic, CV problem or decision. In five minutes, turn it into a clear workflow with a review habit built in.</p><a href="/mission" className="button button--primary">Try your first mission <ArrowUpRight size={16} /></a></div><div className="mission-teaser-board"><div className="teaser-board-top"><span>LIVE WORKFLOW</span><span>01 — 03</span></div><div className="teaser-step is-done"><span>✓</span><strong>Describe the real task</strong><small>in your own words</small></div><div className="teaser-step"><span>02</span><strong>Build a useful starting point</strong><small>without giving away your judgment</small></div><div className="teaser-step"><span>03</span><strong>Review before you trust it</strong><small>with three questions that matter</small></div><div className="teaser-board-note">Your output is yours to copy, use and improve.</div></div></div></section>

        <section className="prompt-section" id="prompts">
          <div className="container">
            <div className="section-heading-row"><div><SectionLabel>THE PROMPT SHELF</SectionLabel><h2>Start with a better<br /><em>first draft.</em></h2></div><div className="search-box"><Search size={17} /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search the shelf" aria-label="Search prompts" /></div></div>
            <div className="prompt-count" aria-live="polite">Showing {filteredPrompts.length} of {prompts.length} prompts</div><div className="prompt-grid">{filteredPrompts.map((prompt, index) => <article className={`prompt-card ${activePrompt === index ? "is-active" : ""}`} key={prompt.id} onMouseEnter={() => setActivePrompt(index)}><div className="prompt-card-top"><span>{prompt.label}</span><span className="prompt-tag">{prompt.tag}</span></div><h3>{prompt.title}</h3><p>“{prompt.body}”</p><div className="prompt-card-footer"><CopyPrompt text={prompt.body} /><span className="prompt-index">0{index + 1}</span></div></article>)}</div>
            {filteredPrompts.length === 0 && <div className="empty-state"><CircleHelp size={21} /><span>No prompt found yet. Try “study”, “revise” or “feedback”.</span></div>}
            <div className="shelf-footer"><span>18 practical prompts across study, research, writing, coding, career and responsible AI.</span><a className="text-link" href="/topics">Open the full library <ArrowUpRight size={15} /></a></div>
          </div>
        </section>

        <section className="split-section" id="tools">
          <div className="container split-layout"><div className="split-copy"><SectionLabel>FIELD NOTES / 03</SectionLabel><h2>Make room for<br /><em>better work.</em></h2><p>We test tools, simplify workflows and explain the trade-offs. You get a useful starting point—not another endless list of “best AI tools”.</p><a href="#newsletter" className="button button--primary">Get the weekly field note <ArrowUpRight size={16} /></a></div><div className="field-note-list"><div className="field-note-rail">A SMALLER, CLEARER AI HABIT</div><div className="field-note"><span className="field-note-num">01</span><div><strong>Tool cards with context</strong><p>What it does, who it helps, what to watch out for and where to start.</p></div><ArrowUpRight size={16} /></div><div className="field-note"><span className="field-note-num">02</span><div><strong>Templates you can actually use</strong><p>Study planners, CV checklists and prompts built around real tasks.</p></div><ArrowUpRight size={16} /></div><div className="field-note"><span className="field-note-num">03</span><div><strong>Safety without the lecture</strong><p>Clear guidance on privacy, verification and keeping your own voice.</p></div><ArrowUpRight size={16} /></div></div></div>
        </section>

        <section className="career-section" id="career"><div className="container career-layout"><div className="career-visual"><img src={careerImage} alt="Career notes, a laptop and interview cue cards" /><span className="image-caption image-caption--dark"><span>CAREER NOTE 04</span><strong>The future skill is knowing what to ask.</strong></span></div><div className="career-copy"><SectionLabel>CAREER & SKILLS / 04</SectionLabel><h2>Make your next<br /><em>move clearer.</em></h2><p>From your first CV to your next interview, use AI to practice, sharpen and prepare—while the final thinking stays yours.</p><a href="#newsletter" className="text-link">See career resources <ArrowUpRight size={16} /></a></div></div></section>

        <section className="newsletter-section" id="newsletter"><div className="container newsletter-layout"><div className="newsletter-symbol"><img src={markImage} alt="" /><span>INDEX TAB<br />EVERY WEEK</span></div><div className="newsletter-copy"><SectionLabel>THE DESK, IN YOUR INBOX</SectionLabel><h2>One useful AI idea.<br /><em>Every week.</em></h2><p>Join a small, thoughtful newsletter with one prompt, one workflow and one thing worth knowing. No noise.</p>{submitted ? <div className="success-box"><Check size={18} /><span>You're on the list. Check your inbox for the starter kit.</span></div> : <form onSubmit={submitNewsletter} className="newsletter-form"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Your email address" /><button type="submit" className="button button--ink">Join the desk <ArrowUpRight size={16} /></button></form>}<small>By subscribing, you agree to receive practical AI notes. Unsubscribe anytime.</small></div></div></section>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><img src={markImage} alt="" /><strong>AI for Students</strong><p>Learn the tool. Keep the thinking.</p></div><div className="footer-links"><a href="#learn-ai">Learn AI</a><a href="#study-with-ai">Study</a><a href="#prompts">Prompts</a><a href="#tools">Tools</a><a href="#newsletter">Newsletter</a><a href="/contact">Contact</a><a href="/progress">Progress</a></div><div className="footer-meta"><span>Made for curious minds.</span><span>© 2026 AI for Students</span></div></div></footer>
    </div>
  );
}
