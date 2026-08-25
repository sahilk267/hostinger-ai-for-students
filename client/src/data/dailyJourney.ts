export type JourneyDay = {
  day: number;
  arc: string;
  title: string;
  outcome: string;
  action: string;
  proof: string;
  explorerPilotKey?: string;
};

export const dailyJourney: JourneyDay[] = [
  { day: 1, arc: "FOUNDATIONS", title: "Ask a question that can actually help", outcome: "A clear request for a real task", action: "Rewrite one vague task with a goal, audience and format.", proof: "My request has a goal, context and usable output.", explorerPilotKey: "plan-rescue" },
  { day: 2, arc: "FOUNDATIONS", title: "Give AI the missing context", outcome: "A context card you can reuse", action: "Add audience, constraints, examples and what success looks like.", proof: "I can tell AI what matters before it starts." },
  { day: 3, arc: "FOUNDATIONS", title: "Make the output easy to inspect", outcome: "A structured response format", action: "Ask for headings, assumptions, confidence and next actions.", proof: "I can review the shape of an answer, not just its tone." },
  { day: 4, arc: "FOUNDATIONS", title: "Spot a confident guess", outcome: "A hallucination warning checklist", action: "Mark which claims need a source, calculation or human confirmation.", proof: "I know where confidence is not evidence." },
  { day: 5, arc: "FOUNDATIONS", title: "Earn your first skill stamp", outcome: "Your Foundations milestone card", action: "Use your improved prompt on a small real task and record what changed.", proof: "I improved a real task without outsourcing my judgment." },
  { day: 6, arc: "STUDY SYSTEMS", title: "Turn notes into active recall", outcome: "A five-question practice set", action: "Convert one page of notes into questions before looking at answers.", proof: "I can practice retrieval instead of rereading.", explorerPilotKey: "missing-clue" },
  { day: 7, arc: "STUDY SYSTEMS", title: "Learn through your own explanation", outcome: "A teach-back paragraph", action: "Explain a difficult idea in your words, then ask AI to find the gap.", proof: "I can locate what I do not understand yet." },
  { day: 8, arc: "STUDY SYSTEMS", title: "Build a realistic study sprint", outcome: "A focused 25-minute plan", action: "Set one outcome, two practice blocks and a stopping rule.", proof: "My study plan fits the time I actually have." },
  { day: 9, arc: "STUDY SYSTEMS", title: "Get feedback without losing your voice", outcome: "A revision priority list", action: "Ask for three high-impact changes, not a full rewrite.", proof: "I can improve work while keeping ownership." },
  { day: 10, arc: "STUDY SYSTEMS", title: "Earn your Study Systems stamp", outcome: "Your study workflow card", action: "Complete one recall, teach-back and revision loop.", proof: "I used AI to practice, not to skip learning." },
  { day: 11, arc: "RESEARCH & EVIDENCE", title: "Break a big question into claims", outcome: "A research question map", action: "Separate the main question into smaller claims that can be checked.", proof: "I know exactly what needs evidence.", explorerPilotKey: "friend-explain" },
  { day: 12, arc: "RESEARCH & EVIDENCE", title: "Find the right kind of source", outcome: "A source-selection plan", action: "Match each claim to a primary, official, academic or contextual source.", proof: "I choose sources for the claim, not convenience." },
  { day: 13, arc: "RESEARCH & EVIDENCE", title: "Compare sources without picking a vibe", outcome: "A fair comparison table", action: "Compare date, expertise, evidence, limitations and incentives.", proof: "I can explain why a source deserves trust." },
  { day: 14, arc: "RESEARCH & EVIDENCE", title: "Verify a number", outcome: "A transparent calculation check", action: "Recalculate one statistic from its original values or method.", proof: "I checked the method, not just the answer." },
  { day: 15, arc: "RESEARCH & EVIDENCE", title: "Earn your Evidence stamp", outcome: "A claim-to-source trail", action: "Publish a mini finding with claim, source, uncertainty and next check.", proof: "Someone else could audit how I reached this conclusion." },
  { day: 16, arc: "BUILD & CREATE", title: "Turn an idea into a brief", outcome: "A one-page creative brief", action: "Define audience, purpose, message, constraints and success.", proof: "My idea is clear enough for someone else to build.", explorerPilotKey: "three-ways" },
  { day: 17, arc: "BUILD & CREATE", title: "Prototype before polishing", outcome: "A rough first version", action: "Ask AI for three rough options, then choose and improve one yourself.", proof: "I used speed for exploration, not borrowed originality." },
  { day: 18, arc: "BUILD & CREATE", title: "Give useful creative direction", outcome: "A reference and constraint board", action: "Describe what to keep, avoid, match and intentionally change.", proof: "I can direct a tool with taste and boundaries." },
  { day: 19, arc: "BUILD & CREATE", title: "Edit for the audience", outcome: "A before-and-after improvement", action: "Test whether the work is clear to a person who lacks your context.", proof: "I can make work more useful, not merely more polished." },
  { day: 20, arc: "BUILD & CREATE", title: "Earn your Creator stamp", outcome: "A finished mini-project card", action: "Share the brief, the first draft and the human decision that shaped it.", proof: "The final work still shows my choices." },
  { day: 21, arc: "CODE & AUTOMATION", title: "Ask for a code explanation", outcome: "A plain-language code map", action: "Explain inputs, outputs, assumptions and failure points in a snippet.", proof: "I understand the code before I change it.", explorerPilotKey: "rule-change" },
  { day: 22, arc: "CODE & AUTOMATION", title: "Debug with a hypothesis", outcome: "A smallest-test debugging plan", action: "List likely causes and test one assumption at a time.", proof: "I debug by learning, not by randomly changing lines." },
  { day: 23, arc: "CODE & AUTOMATION", title: "Design safer inputs", outcome: "An input-validation checklist", action: "Identify malformed, missing, private and unexpected inputs.", proof: "I can see how a workflow could fail or be abused." },
  { day: 24, arc: "CODE & AUTOMATION", title: "Make automation explain itself", outcome: "A reviewable automation flow", action: "Add logs, human checkpoints and a clear stop condition.", proof: "Automation remains observable and interruptible." },
  { day: 25, arc: "CODE & AUTOMATION", title: "Earn your Builder stamp", outcome: "A safe prototype card", action: "Document what your tool does, does not do and how you tested it.", proof: "I built something I can explain and review." },
  { day: 26, arc: "CAREER & LIFE", title: "Turn experience into evidence", outcome: "An achievement-focused bullet", action: "Use action, task, result and evidence without inventing numbers.", proof: "My experience is specific and believable.", explorerPilotKey: "try-again" },
  { day: 27, arc: "CAREER & LIFE", title: "Practice a real conversation", outcome: "A feedback-backed answer", action: "Run one interview or difficult-conversation rehearsal with follow-ups.", proof: "I can respond clearly under pressure." },
  { day: 28, arc: "CAREER & LIFE", title: "Protect your private information", outcome: "A redaction habit", action: "Remove identifying or confidential details before using an AI tool.", proof: "I know what should never be pasted casually." },
  { day: 29, arc: "CAREER & LIFE", title: "Make a decision you still own", outcome: "A trade-off decision note", action: "Compare options, uncertainty and values; keep the final choice human.", proof: "AI clarified my thinking without replacing my agency." },
  { day: 30, arc: "CAREER & LIFE", title: "Earn the 30-day AI Builder certificate", outcome: "Your complete journey card", action: "Choose your strongest milestone and write the next skill you will build.", proof: "I completed a month of practical AI habits." },
];
