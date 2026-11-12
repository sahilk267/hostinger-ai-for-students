export type ClassroomCollection = {
  id: string;
  title: string;
  audience: string;
  description: string;
  outcomes: string[];
  sessions: { title: string; minutes: number; goal: string; activity: string; href: string; reflect: string }[];
};

export const classroomCollections: ClassroomCollection[] = [
  {
    id:"ai-foundations",title:"AI Literacy Foundations",audience:"Approx. ages 11+, adapted by teacher",
    description:"A three-part introduction to what AI can do, how to ask clear questions and why verification matters.",
    outcomes:["Explain one limitation of AI outputs","Structure a prompt using a goal and context","Separate confident claims from evidence"],
    sessions:[
      {title:"What AI can and cannot do",minutes:30,goal:"Identify one useful AI capability and one limitation.",activity:"Read the AI basics guide and discuss an example where output could be mistaken.",href:"/guides/ai-tools-for-beginners",reflect:"Which task still needs human judgment?"},
      {title:"A useful prompt",minutes:30,goal:"Rewrite a vague request with context and constraints.",activity:"Use Prompt Detective in pairs and explain a stronger prompt choice.",href:"/play",reflect:"What instruction improved the answer?"},
      {title:"Verify before sharing",minutes:30,goal:"Identify claims that need independent support.",activity:"Play Fact Check Quest, then find the type of source that would answer one claim.",href:"/play?game=fact",reflect:"Which claim remains unresolved?"},
    ],
  },
  {
    id:"safe-ai",title:"Privacy and Responsible AI",audience:"Approx. ages 8+, with age-appropriate supervision",
    description:"Three guided conversations about private information, fair decisions and safe AI use.",
    outcomes:["Recognise personal information in fictional examples","Describe a safer alternative to oversharing","Explain why human review is needed"],
    sessions:[
      {title:"What stays private?",minutes:30,goal:"Remove unnecessary personal details from a fictional prompt.",activity:"Review the family safety guide, then rewrite a made-up prompt.",href:"/guides/ai-safety-for-kids-and-parents",reflect:"Which information was not needed?"},
      {title:"Choose a safer action",minutes:30,goal:"Explain a safety decision without blaming classmates.",activity:"Use AI Safety Lab and discuss one scenario using fictional information only.",href:"/play?game=safety",reflect:"Whom would you ask if unsure?"},
      {title:"Fair choices and human review",minutes:30,goal:"Describe why a human should check important AI recommendations.",activity:"Try Bias Buster, then list questions about a decision and its missing context.",href:"/play?game=bias-buster",reflect:"Who could be affected by an unchecked decision?"},
    ],
  },
  {
    id:"visual-systems",title:"Visual Thinking and Robotics",audience:"Approx. ages 5–15, teacher-adapted",
    description:"A progression from recognizing a pattern to making predictions and repairing an instruction sequence.",
    outcomes:["Describe a pattern in words or gestures","Make and revise a prediction","Sequence simple steps and explain a change"],
    sessions:[
      {title:"Notice a pattern",minutes:20,goal:"Find a repeating or changing visual rule.",activity:"Try Pattern Builder and ask learners to describe what comes next.",href:"/discovery-lab?game=pattern-builder",reflect:"What stayed the same across examples?"},
      {title:"Predict and observe",minutes:20,goal:"Compare a prediction with a visible outcome.",activity:"Try Mini Scientist and record a simple before/after observation.",href:"/discovery-lab?game=mini-scientist",reflect:"What would you predict differently next time?"},
      {title:"Design a route",minutes:30,goal:"Order instructions to meet a goal and debug one issue.",activity:"Try Robot Programmer, then discuss an improvement to the route.",href:"/discovery-lab?game=robot-programmer",reflect:"Which instruction should you test first?"},
      {title:"Build and repair",minutes:30,goal:"Explain steps, test a plan and revise it.",activity:"Try the Robotics route builder and discuss a failed plan without judgement.",href:"/robotics",reflect:"How did the revised plan change?"},
    ],
  },
];

export function formatClassroomCollection(collection: ClassroomCollection): string {
  return [
    "AI FOR STUDENTS — CLASSROOM LEARNING COLLECTION",
    collection.title,
    `Suggested audience: ${collection.audience}`,
    collection.description,
    "", "LEARNING OUTCOMES", ...collection.outcomes.map((x,i)=>`${i+1}. ${x}`),
    "", "SESSIONS",
    ...collection.sessions.flatMap((session,i)=>[
      `${i+1}. ${session.title} (${session.minutes} min)`,
      `Goal: ${session.goal}`,
      `Activity: ${session.activity}`,
      `Open: https://aiforstudents.in${session.href}`,
      `Reflect: ${session.reflect}`,""
    ]),
    "FACILITATOR NOTES",
    "Adapt for local curriculum, age, accessibility and school rules.",
    "Use fictional examples. Do not collect or upload student identifiers.",
    "These activities support discussion and practice, not validated diagnostic assessment.",
  ].join("\n");
}
