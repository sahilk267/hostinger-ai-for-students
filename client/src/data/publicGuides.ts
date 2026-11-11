export type PublicGuide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  intro: string;
  steps: { heading: string; body: string }[];
  example: string;
  checklist: string[];
  relatedHref: string;
  relatedLabel: string;
};

export const publicGuides: PublicGuide[] = [
  {
    slug: "how-to-use-ai-for-studying",
    title: "How to Use AI for Studying Without Copying Answers",
    description: "A practical student guide to using AI for explanations, active recall, revision and feedback while keeping your own thinking.",
    category: "Study smarter",
    intro: "AI can help you study, but a fluent answer is not the same as understanding. The best study workflow makes you explain, practise and check the idea yourself.",
    steps: [
      { heading: "Start with your own attempt", body: "Write what you already know and where you are stuck. A short honest first attempt gives you something to compare with the AI response." },
      { heading: "Ask for an explanation, not the final assignment", body: "Request an analogy, a worked example on a different problem or a hint. Keep graded work in your own words and follow your school rules." },
      { heading: "Use active recall", body: "Close the explanation and answer a question from memory. Ask the tool to quiz you one question at a time before showing feedback." },
      { heading: "Verify the hard parts", body: "Check definitions, equations, dates and citations against class notes, textbooks or trusted primary sources. AI can make convincing mistakes." },
      { heading: "Finish with a teach-back", body: "Explain the topic in two or three sentences without the tool. If you cannot do that yet, revisit the unclear step." },
    ],
    example: "Act as a patient tutor for [topic]. Ask what I know first. Give one hint at a time, then quiz me. Do not complete my graded assignment. Point out claims I should verify.",
    checklist: ["I made my own first attempt", "I can explain the idea without reading the response", "I checked important facts and sources", "The submitted work follows my school rules"],
    relatedHref: "/study", relatedLabel: "Try guided study workflows",
  },
  {
    slug: "ai-prompts-for-students",
    title: "AI Prompts for Students: A Better Way to Ask Questions",
    description: "Learn a reusable AI prompt formula with examples for studying, brainstorming, writing feedback and exam revision.",
    category: "Prompt writing",
    intro: "You do not need magic prompt words. A useful prompt gives the tool a goal, helpful context, clear limits and a format you can check.",
    steps: [
      { heading: "Say what you want to learn", body: "Replace 'help me with science' with a precise concept or question, such as energy transfer in a simple circuit." },
      { heading: "Give the level and context", body: "Mention the class level, what you have already tried and the terminology you know. Avoid sharing private details or other people's information." },
      { heading: "Set a learning boundary", body: "Request hints, feedback or examples instead of a ready-to-submit answer. You remain responsible for accuracy and originality." },
      { heading: "Choose a format", body: "Ask for a table, numbered steps, short quiz or comparison. Clear outputs are easier to review." },
      { heading: "Ask how to check it", body: "Request uncertainty notes, missing information and suggested source types. Follow up using real sources rather than invented references." },
    ],
    example: "I am learning [concept] at [level]. I understand [what I know] but struggle with [gap]. Explain it using one analogy and two examples. Then ask three questions, one at a time. Flag anything uncertain.",
    checklist: ["My goal is specific", "The prompt includes useful context", "I asked for a format", "I set an integrity boundary", "I will independently verify important claims"],
    relatedHref: "/play", relatedLabel: "Play Prompt Detective",
  },
  {
    slug: "how-to-check-ai-answers",
    title: "How to Fact-Check AI Answers and Spot Hallucinations",
    description: "A step-by-step fact-checking routine for students using AI: identify claims, locate evidence, verify sources and note uncertainty.",
    category: "Research skills",
    intro: "An AI answer may sound certain even when a detail is incorrect or a citation does not exist. Fact-checking is a practical habit, not a sign that you used the tool badly.",
    steps: [
      { heading: "Split the answer into claims", body: "Underline checkable statements such as dates, names, statistics, quotations and cause-and-effect claims. Separate these from opinions and suggestions." },
      { heading: "Prioritise consequential details", body: "Verify the statements that affect your assignment, safety or decision first. Do not rely on AI alone for medical, legal or financial decisions." },
      { heading: "Find the original source", body: "Look for official documentation, research papers, reputable reference works or direct records. A link's existence is not proof that it supports the claim." },
      { heading: "Check date and context", body: "A true statement from a different year or country may be misleading. Confirm when and where the evidence applies." },
      { heading: "Record what is still unknown", body: "Mark each claim as supported, contradicted or unresolved. If evidence is missing, do not present a guess as a fact." },
    ],
    example: "Review this answer: [paste text without personal data]. List each factual claim, its importance, the type of primary source needed, and what remains unverified. Do not invent citations.",
    checklist: ["Important claims were separated", "I opened the original sources", "Dates and locations match", "Quotations and statistics were verified", "Unresolved claims are clearly marked"],
    relatedHref: "/play?game=fact", relatedLabel: "Play Fact Check Quest",
  },
  {
    slug: "ai-study-plan-for-exams",
    title: "How to Make an AI-Assisted Exam Study Plan",
    description: "Build a realistic revision timetable with active recall, practice questions, spaced review and time for weak topics.",
    category: "Exam revision",
    intro: "A helpful study plan matches the time you really have to the topics you need to practise. AI can help organise that plan, but it cannot know what you understand until you check yourself.",
    steps: [
      { heading: "List topics and exam dates", body: "Use your own syllabus and dates. Mark topics as comfortable, uncertain or not started based on recent practice, not a guess from the AI." },
      { heading: "Set realistic study blocks", body: "Choose sessions you can complete, with breaks and buffer time. Keep room for school, sleep and other responsibilities." },
      { heading: "Mix recall and practice", body: "Use past questions, explain concepts from memory and solve examples. Rereading alone can feel productive without revealing gaps." },
      { heading: "Review mistakes", body: "After each session, note the specific mistake and what you will try differently. Ask AI for a hint or alternate explanation if needed." },
      { heading: "Adjust weekly", body: "Move time toward topics where practice shows confusion. A plan is a tool you can edit, not a strict scorecard." },
    ],
    example: "Help me build a 7-day revision plan for [subjects] with [available hours]. Prioritise [weak topics]. Include active-recall tasks, practice questions, breaks, and a short end-of-day review. Ask for missing details instead of assuming.",
    checklist: ["The plan fits my available time", "Each session has an observable task", "I included practice questions", "I will review mistakes", "I can adjust the plan when needed"],
    relatedHref: "/journey", relatedLabel: "Start a guided learning journey",
  },
  {
    slug: "ai-safety-for-kids-and-parents",
    title: "AI Safety for Kids and Parents: A Practical Starter Guide",
    description: "Simple family rules for privacy, schoolwork, checking AI answers and using AI tools with age-appropriate supervision.",
    category: "Family AI safety",
    intro: "Children benefit most from AI when it supports curiosity without collecting unnecessary personal details or replacing trusted adults. Family rules should be simple and revisited together.",
    steps: [
      { heading: "Agree which tools are suitable", body: "Follow each product's minimum-age rules and school guidance. Younger children should use age-appropriate experiences with adult supervision." },
      { heading: "Keep private details out of prompts", body: "Do not paste full names, contact details, passwords, school records, medical information, personal photos or another child's work." },
      { heading: "Make asking for help normal", body: "Encourage children to tell an adult if a response is frightening, inappropriate or confusing rather than trying to handle it alone." },
      { heading: "Keep learning in the loop", body: "Use AI for explanations, practice questions and creative exploration while preserving the child's own reasoning and school integrity requirements." },
      { heading: "Check answers together", body: "Compare important claims with trusted resources. Discuss why a confident answer can still be wrong." },
    ],
    example: "Create five family-friendly discussion questions about using AI responsibly at home. Focus on privacy, verifying claims and asking a trusted adult for help. Do not request personal information.",
    checklist: ["We checked age requirements", "We agreed on private information rules", "A trusted adult is available", "We use AI to learn, not copy", "We verify important answers"],
    relatedHref: "/discovery-lab", relatedLabel: "Explore visual learning games",
  },
  {
    slug: "ai-tools-for-beginners",
    title: "AI Tools for Beginners: What to Learn First",
    description: "Start using AI responsibly with a simple learning sequence covering prompting, verification, privacy and practical projects.",
    category: "AI basics",
    intro: "The quickest way to become comfortable with AI is to learn a few transferable habits before chasing individual apps. Focus on tasks, constraints and checking results.",
    steps: [
      { heading: "Understand what generative AI does", body: "It produces outputs based on learned patterns. It is useful for drafting and exploration but does not guarantee correct facts or good judgment." },
      { heading: "Practice clear instructions", body: "Choose one safe task, add context, specify the output and ask for uncertainty notes. Compare a vague prompt with a specific one." },
      { heading: "Learn a verification workflow", body: "Check citations, dates and surprising claims using trusted sources. Keep track of what you verified yourself." },
      { heading: "Protect sensitive information", body: "Experiment with fictional or public examples before using real notes. Review the tool's privacy settings and applicable rules." },
      { heading: "Build one small project", body: "Try a revision checklist, a structured outline or a set of practice questions. Reflect on where the tool helped and where you had to correct it." },
    ],
    example: "Teach me one beginner AI concept using a simple example. Ask a follow-up question that helps me test the idea, then suggest a safe mini-project I can finish today.",
    checklist: ["I understand that AI can be mistaken", "I can write a clear prompt", "I know how to verify claims", "I avoid private inputs", "I completed a small practice task"],
    relatedHref: "/learn", relatedLabel: "Begin the AI learning path",
  },
];

export function getPublicGuide(slug: string): PublicGuide | undefined {
  return publicGuides.find((guide) => guide.slug === slug);
}
