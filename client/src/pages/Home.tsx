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
  const navItems = [
    {label:"Free Learning", href:"/learn"},
    {label:"Visual Practice", href:"/discovery-lab"},
    {label:"Parent Guidance", href:"/parents"},
    {label:"Teacher Solutions", href:"/teachers"},
    {label:"Free Guides", href:"/guides"},
    {label:"Access & Plans", href:"/plans"},
  ];
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="AI for Students home">
          <img src={markImage} alt="" className="brand-mark" />
          <span className="brand-type"><strong>AI</strong> for <em>Students</em></span>
        </a>
        <nav className={`desktop-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
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
  const filteredPrompts = useMemo(() => prompts.filter((prompt) => `${prompt.title} ${prompt.tag}`.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);


  return (
    <div className="app-shell" id="top">
      <Header />
      <main>
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <SectionLabel>THE PRACTICAL AI DESK</SectionLabel>
              <h1>Learn AI. Practise skills.<br /><span>Grow with guidance.</span></h1>
              <p className="hero-lede">Free AI lessons and visual learning games for students, practical guidance for parents, and ready-to-use classroom activities for teachers.</p>
              <div className="hero-actions">
                <a href="/start" className="button button--primary">Start a free learning journey <ArrowUpRight size={16} /></a>
                <a href="/learn" className="text-link">Start learning AI <ChevronRight size={16} /></a>
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
                {toolkit.map(({ icon: Icon, label, copy, color }, index) => <a href={index === 0 ? "/learn" : index === 1 ? "/study" : "/explorer"} className={`toolkit-row toolkit-row--${color}`} key={label}><span className="toolkit-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{copy}</small></span><ArrowUpRight size={16} /></a>)}
              </div>
            </div>
          </div>
          <div className="hero-bottom-note"><span>Scroll to find your next useful thing</span><span className="scroll-line" /></div>
        </section>

        <section className="path-section" id="learning-ecosystem" aria-labelledby="ecosystem-heading">
          <div className="container path-layout">
            <div className="path-intro">
              <SectionLabel>FOUR WAYS TO GET STARTED</SectionLabel>
              <h2 id="ecosystem-heading">One learning home.<br/><em>Four useful paths.</em></h2>
              <p>Choose the experience that fits today. Every path leads to real lessons, practice or helpful guidance—not a placeholder.</p>
              <a className="text-link" href="/guides">Browse free AI guides <ChevronRight size={16}/></a>
            </div>
            <div className="path-list">
              {[
                ["01","Free Learning","Short AI lessons, study workflows and practical guides","/learn","Learn an AI concept"],
                ["02","Visual Practice","Play patterns, robotics, reasoning and safe AI challenges","/start","Start your practice journey"],
                ["03","Parent Guidance","Choose an activity and discuss next steps together","/parents","Explore family activities"],
                ["04","Teacher Solutions","Build and copy a ready-to-adapt classroom activity","/teachers","Create a classroom pack"],
              ].map(([num,title,copy,href,cta])=><a className="path-row" href={href} key={num}>
                <span className="path-number">{num}</span>
                <span className="path-content"><strong>{title}</strong><small>{copy}</small></span>
                <span className="path-cta">{cta} <ArrowUpRight size={15}/></span>
              </a>)}
            </div>
          </div>
        </section>

        <section className="feature-section" id="study-with-ai">
          <div className="container feature-layout">
            <div className="feature-image-wrap"><img src={studyImage} alt="Study notes and flashcards arranged on a desk" /><span className="image-stamp">TRY THIS</span></div>
            <div className="feature-copy"><SectionLabel>STUDY WITH AI</SectionLabel><h2>Use AI as a<br /><em>thinking partner.</em></h2><p>Good study support does not give you an answer and disappear. It helps you ask a sharper question, spot a gap and practice until the idea is yours.</p><div className="check-list"><span><Check size={15} /> Explain a concept in your own words</span><span><Check size={15} /> Turn notes into active recall</span><span><Check size={15} /> Get feedback without losing your voice</span></div><div className="home-study-actions"><a href="/mission" className="button button--ink">Start a 5-minute mission <ArrowUpRight size={16} /></a><a href="/discovery-lab" className="text-link">Play visual logic games <ArrowUpRight size={15} /></a></div></div>
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
          <div className="container split-layout"><div className="split-copy"><SectionLabel>FIELD NOTES / 03</SectionLabel><h2>Make room for<br /><em>better work.</em></h2><p>We test tools, simplify workflows and explain the trade-offs. You get a useful starting point—not another endless list of “best AI tools”.</p><a href="/guides" className="button button--primary">Open free field notes <ArrowUpRight size={16} /></a></div><div className="field-note-list"><div className="field-note-rail">A SMALLER, CLEARER AI HABIT</div><div className="field-note"><span className="field-note-num">01</span><div><strong>Tool cards with context</strong><p>What it does, who it helps, what to watch out for and where to start.</p></div><ArrowUpRight size={16} /></div><div className="field-note"><span className="field-note-num">02</span><div><strong>Templates you can actually use</strong><p>Study planners, CV checklists and prompts built around real tasks.</p></div><ArrowUpRight size={16} /></div><div className="field-note"><span className="field-note-num">03</span><div><strong>Safety without the lecture</strong><p>Clear guidance on privacy, verification and keeping your own voice.</p></div><ArrowUpRight size={16} /></div></div></div>
        </section>

        <section className="career-section" id="career"><div className="container career-layout"><div className="career-visual"><img src={careerImage} alt="Career notes, a laptop and interview cue cards" /><span className="image-caption image-caption--dark"><span>CAREER NOTE 04</span><strong>The future skill is knowing what to ask.</strong></span></div><div className="career-copy"><SectionLabel>CAREER & SKILLS / 04</SectionLabel><h2>Make your next<br /><em>move clearer.</em></h2><p>From your first CV to your next interview, use AI to practice, sharpen and prepare—while the final thinking stays yours.</p><a href="/guides" className="text-link">See career resources <ArrowUpRight size={16} /></a></div></div></section>

        <section className="path-section" id="free-learning-collections" aria-labelledby="free-collections-title">
          <div className="container path-layout">
            <div className="path-intro"><SectionLabel>LEARN / PRACTISE / REFLECT</SectionLabel><h2 id="free-collections-title">Find the right<br/><em>learning path.</em></h2><p>Focused free collections for real questions, each connecting practical reading with a playable activity or a family or classroom resource.</p></div>
            <div className="path-list">
              {[
                ["01","AI study skills","Learn to revise, prompt and verify without copying","/resources/ai-study-skills"],
                ["02","AI safety and fact-checking","Safer AI habits and practical source checks","/resources/ai-safety-and-fact-checking"],
                ["03","Visual learning and robotics","Explore visual patterns, predictions and robot routes","/resources/visual-ai-and-robotics"]
              ].map(([num,title,summary,href])=><a key={href} className="path-row" href={href}><span className="path-number">{num}</span><span className="path-content"><strong>{title}</strong><small>{summary}</small></span><span className="path-cta">Open collection <ArrowUpRight size={15}/></span></a>)}
            </div>
          </div>
        </section>
        <section className="path-section" id="free-ai-guides"><div className="container"><div className="path-intro"><SectionLabel>FREE AI LEARNING GUIDES</SectionLabel><h2>Useful answers.<br /><em>Stronger habits.</em></h2><p>Read practical guides for studying with AI, writing clearer prompts, checking claims and helping children use AI safely. Each guide includes an example and a real next step.</p><a className="button button--ink" href="/guides">Explore all free guides <ArrowUpRight size={16}/></a></div><div className="path-list">{[["How to use AI for studying","/guides/how-to-use-ai-for-studying"],["Better AI prompts for students","/guides/ai-prompts-for-students"],["How to fact-check AI answers","/guides/how-to-check-ai-answers"],["AI safety for kids and parents","/guides/ai-safety-for-kids-and-parents"]].map(([title,href],index)=><a className="path-row" href={href} key={href}><span className="path-number">0{index+1}</span><span className="path-content"><strong>{title}</strong><small>Free step-by-step guide and activity</small></span><span className="path-cta">Read guide <ArrowUpRight size={15}/></span></a>)}</div></div></section>

        <section className="newsletter-section" id="newsletter"><div className="container newsletter-layout"><div className="newsletter-symbol"><img src={markImage} alt="" /><span>FREE GUIDE<br />STARTER KIT</span></div><div className="newsletter-copy"><SectionLabel>THE FREE AI STARTER KIT</SectionLabel><h2>One practical idea.<br /><em>A better next step.</em></h2><p>Get started immediately with free guides to study prompts, source checking and responsible AI habits. No email or account is required.</p><a href="/guides" className="button button--ink">Open free AI guides <ArrowUpRight size={16}/></a><small>Free to read. No newsletter subscription is collected on this page.</small></div></div></section>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><div className="footer-brand"><img src={markImage} alt="" /><strong>AI for Students</strong><p>Learn the tool. Keep the thinking.</p></div><div className="footer-links"><a href="/learn">Free Learning</a><a href="/start">Start a Challenge</a><a href="/discovery-lab">Visual Practice</a><a href="/parents">Parent Guidance</a><a href="/teachers">Teacher Solutions</a><a href="/guides">Free Guides</a><a href="/resources/ai-study-skills">Study Resources</a><a href="/study">Study with AI</a><a href="/progress">Progress</a><a href="/contact">Contact</a><a href="/plans">Access & Plans</a></div><div className="footer-meta"><span>Made for curious minds.</span><span>© 2026 AI for Students</span></div></div></footer>
    </div>
  );
}
