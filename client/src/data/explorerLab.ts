export type ExplorerAgeBand = "5-7" | "8-10" | "11-13" | "14-17";

export type ExplorerSkill =
  | "planning"
  | "evidence"
  | "creativity"
  | "explanation"
  | "flexibility"
  | "reflection";

export type ExplorerMissionKind =
  | "choice-observatory"
  | "source-hunt"
  | "build-studio"
  | "explain-it"
  | "strategy-switch"
  | "reflect-improve";

export type ExplorerReviewStatus = "pilot" | "reviewed" | "retired";

export type ExplorerEvidenceField =
  | "choice"
  | "reason"
  | "artifact"
  | "reflection"
  | "revision";

export type ExplorerMission = {
  id: string;
  pilotKey: string;
  ageBand: ExplorerAgeBand;
  kind: ExplorerMissionKind;
  title: string;
  arc: string;
  objective: string;
  skill: ExplorerSkill;
  scenario: string;
  task: string;
  evidenceFields: ExplorerEvidenceField[];
  rubric: string[];
  feedback: {
    starter: string;
    nextStep: string;
  };
  completionLabel: string;
  reviewStatus: ExplorerReviewStatus;
};

export const EXPLORER_AGE_BANDS: Array<{
  id: ExplorerAgeBand;
  label: string;
  description: string;
  sessionLength: string;
}> = [
  {
    id: "5-7",
    label: "Story explorers",
    description: "Picture-led play, simple choices and parent-supported reflection.",
    sessionLength: "5–8 min",
  },
  {
    id: "8-10",
    label: "Curious builders",
    description: "Puzzles, clues and small creations with explain-your-choice moments.",
    sessionLength: "8–12 min",
  },
  {
    id: "11-13",
    label: "Evidence seekers",
    description: "Scenario labs that practice reasoning, revision and source judgment.",
    sessionLength: "12–18 min",
  },
  {
    id: "14-17",
    label: "Independent makers",
    description: "Portfolio-ready challenges for research, communication and ethical decisions.",
    sessionLength: "15–25 min",
  },
];

export const EXPLORER_PROHIBITED_OUTPUTS = [
  "diagnosis",
  "IQ or intelligence score",
  "personality label",
  "disability inference",
  "mental-health inference",
  "fixed ability label",
  "sibling or peer ranking",
  "guaranteed career prediction",
  "sensitive trait inference",
] as const;

const sharedSafetyNote =
  "This is a practice observation, not a diagnosis or prediction. Try it again in another context before drawing conclusions.";

const mission = (
  base: Omit<ExplorerMission, "id" | "reviewStatus"> & { id: string },
): ExplorerMission => ({
  ...base,
  reviewStatus: "pilot",
  feedback: {
    ...base.feedback,
    nextStep: `${base.feedback.nextStep} ${sharedSafetyNote}`,
  },
});

export const EXPLORER_PILOT_MISSIONS: ExplorerMission[] = [
  mission({
    id: "plan-rescue-5-7",
    pilotKey: "plan-rescue",
    ageBand: "5-7",
    kind: "choice-observatory",
    title: "Plan the Teddy Rescue",
    arc: "Foundations",
    objective: "Practice putting two or three helpful steps in an order.",
    skill: "planning",
    scenario: "Teddy is across a pretend river. A bridge, a map and a backpack are nearby.",
    task: "Choose what you would do first, then tell a grown-up why.",
    evidenceFields: ["choice", "reason", "reflection"],
    rubric: ["Chose a first step", "Gave a reason or gesture", "Reflected after a clue"],
    feedback: { starter: "You made a plan instead of rushing.", nextStep: "Try drawing or saying the next step too." },
    completionLabel: "Rescue plan saved",
  }),
  mission({
    id: "missing-clue-5-7",
    pilotKey: "missing-clue",
    ageBand: "5-7",
    kind: "source-hunt",
    title: "Find the Missing Clue",
    arc: "Evidence",
    objective: "Notice when a story needs one more clue before we believe it.",
    skill: "evidence",
    scenario: "A friendly robot says a plant grew overnight, but no one saw what happened.",
    task: "Pick the clue you would look for and explain it with words, drawing or voice.",
    evidenceFields: ["choice", "reason", "reflection"],
    rubric: ["Selected a useful clue", "Connected clue to the claim", "Named one thing still unknown"],
    feedback: { starter: "You noticed that a surprising claim needs a clue.", nextStep: "Ask: what could we check together?" },
    completionLabel: "Clue finder saved",
  }),
  mission({
    id: "three-ways-5-7",
    pilotKey: "three-ways",
    ageBand: "5-7",
    kind: "build-studio",
    title: "Make Three Helpful Robots",
    arc: "Create",
    objective: "Generate different ideas and choose one for a reason.",
    skill: "creativity",
    scenario: "A tiny robot wants to help tidy a busy playroom.",
    task: "Draw, arrange or describe three ways the robot could help, then choose one.",
    evidenceFields: ["artifact", "choice", "reason"],
    rubric: ["Made more than one idea", "Ideas are meaningfully different", "Chose one with a reason"],
    feedback: { starter: "You explored more than one possibility.", nextStep: "Add one rule that keeps your robot helpful and safe." },
    completionLabel: "Robot ideas saved",
  }),
  mission({
    id: "friend-explain-5-7",
    pilotKey: "friend-explain",
    ageBand: "5-7",
    kind: "explain-it",
    title: "Explain It to a Friend",
    arc: "Communicate",
    objective: "Match an explanation to what another person needs to know.",
    skill: "explanation",
    scenario: "A new friend does not know how to play a simple game.",
    task: "Choose a picture, action or sentence that would help your friend begin.",
    evidenceFields: ["choice", "reason", "reflection"],
    rubric: ["Gave a starting instruction", "Considered the friend", "Checked whether it helped"],
    feedback: { starter: "You thought about the person listening.", nextStep: "Try one example and ask what your friend understood." },
    completionLabel: "Friend explanation saved",
  }),
  mission({
    id: "rule-change-5-7",
    pilotKey: "rule-change",
    ageBand: "5-7",
    kind: "strategy-switch",
    title: "The Rule Changed",
    arc: "Adapt",
    objective: "Notice a new rule and try a different way.",
    skill: "flexibility",
    scenario: "The pretend bridge is now closed. There is a safe stepping-stone path.",
    task: "Choose a new path and say what changed.",
    evidenceFields: ["choice", "reason", "reflection"],
    rubric: ["Noticed the change", "Chose another safe strategy", "Explained the switch"],
    feedback: { starter: "You looked for another way when the rule changed.", nextStep: "Tell what you would try if that path changed too." },
    completionLabel: "Strategy switch saved",
  }),
  mission({
    id: "try-again-5-7",
    pilotKey: "try-again",
    ageBand: "5-7",
    kind: "reflect-improve",
    title: "Try It a New Way",
    arc: "Reflect",
    objective: "Notice one change between a first try and a second try.",
    skill: "reflection",
    scenario: "Your first paper tower fell down, but you have blocks and a wider base.",
    task: "Make or describe a second tower and show what you changed.",
    evidenceFields: ["artifact", "revision", "reflection"],
    rubric: ["Made a second attempt", "Changed one part", "Named what helped"],
    feedback: { starter: "You used the first try as information.", nextStep: "Tell a grown-up what you would test next." },
    completionLabel: "Second try saved",
  }),
  mission({
    id: "plan-rescue-8-10",
    pilotKey: "plan-rescue",
    ageBand: "8-10",
    kind: "choice-observatory",
    title: "Plan the Library Rescue",
    arc: "Foundations",
    objective: "Break a small problem into ordered, achievable steps.",
    skill: "planning",
    scenario: "Your group must find a book, check its details and return it before class ends.",
    task: "Order four action cards and explain why your first step reduces confusion.",
    evidenceFields: ["choice", "reason", "revision"],
    rubric: ["Ordered steps logically", "Explained a dependency", "Improved one step after feedback"],
    feedback: { starter: "Your plan made the task easier to start.", nextStep: "Add a checkpoint that tells you whether the plan is working." },
    completionLabel: "Library plan saved",
  }),
  mission({
    id: "missing-clue-8-10",
    pilotKey: "missing-clue",
    ageBand: "8-10",
    kind: "source-hunt",
    title: "The Missing Weather Clue",
    arc: "Evidence",
    objective: "Separate an interesting claim from the evidence needed to check it.",
    skill: "evidence",
    scenario: "A poster says tomorrow will be the hottest day ever, but gives no source or place.",
    task: "Choose two things to verify and explain why each matters.",
    evidenceFields: ["choice", "reason", "reflection"],
    rubric: ["Selected relevant checks", "Explained why context matters", "Named remaining uncertainty"],
    feedback: { starter: "You did not accept a dramatic claim without context.", nextStep: "Compare the claim with a trustworthy source and record the date." },
    completionLabel: "Weather check saved",
  }),
  mission({
    id: "three-ways-8-10",
    pilotKey: "three-ways",
    ageBand: "8-10",
    kind: "build-studio",
    title: "Design a Helpful Study Buddy",
    arc: "Create",
    objective: "Generate options, compare trade-offs and select a useful design.",
    skill: "creativity",
    scenario: "A study buddy should help someone remember without doing the work for them.",
    task: "Create three features and choose the one that best supports learning.",
    evidenceFields: ["artifact", "choice", "reason"],
    rubric: ["Created varied features", "Identified a trade-off", "Protected learner effort"],
    feedback: { starter: "Your design kept the learner involved.", nextStep: "Test it with one real study topic and revise the weakest feature." },
    completionLabel: "Study buddy saved",
  }),
  mission({
    id: "friend-explain-8-10",
    pilotKey: "friend-explain",
    ageBand: "8-10",
    kind: "explain-it",
    title: "Teach the Tiny Robot",
    arc: "Communicate",
    objective: "Use sequence, example and a check for understanding.",
    skill: "explanation",
    scenario: "A tiny robot has never learned how to sort recycling.",
    task: "Write, draw or record three steps and one example for the robot.",
    evidenceFields: ["artifact", "reason", "reflection"],
    rubric: ["Used a clear sequence", "Included an example", "Added a comprehension check"],
    feedback: { starter: "Your explanation gave the learner a path to follow.", nextStep: "Remove one confusing word and replace it with an example." },
    completionLabel: "Robot lesson saved",
  }),
  mission({
    id: "rule-change-8-10",
    pilotKey: "rule-change",
    ageBand: "8-10",
    kind: "strategy-switch",
    title: "The Puzzle Rule Changed",
    arc: "Adapt",
    objective: "Revise a plan when a new constraint appears.",
    skill: "flexibility",
    scenario: "Your puzzle path cannot use blue tiles anymore, so the first plan no longer works.",
    task: "Choose a new route and explain which assumption you changed.",
    evidenceFields: ["choice", "reason", "revision"],
    rubric: ["Identified the broken assumption", "Tried a new route", "Compared old and new plans"],
    feedback: { starter: "You changed the plan instead of repeating the same move.", nextStep: "Write a rule for when you would switch strategies next time." },
    completionLabel: "New route saved",
  }),
  mission({
    id: "try-again-8-10",
    pilotKey: "try-again",
    ageBand: "8-10",
    kind: "reflect-improve",
    title: "Upgrade the First Draft",
    arc: "Reflect",
    objective: "Use feedback to make a visible improvement.",
    skill: "reflection",
    scenario: "Your first poster has a strong idea, but a friend cannot tell what to do next.",
    task: "Revise the poster title or instructions and explain the change.",
    evidenceFields: ["artifact", "revision", "reflection"],
    rubric: ["Used feedback", "Made a visible revision", "Explained the expected effect"],
    feedback: { starter: "You treated feedback as a tool, not a score.", nextStep: "Ask a second reader what became clearer." },
    completionLabel: "Draft upgrade saved",
  }),
  mission({
    id: "plan-rescue-11-13",
    pilotKey: "plan-rescue",
    ageBand: "11-13",
    kind: "choice-observatory",
    title: "Plan a Reliable Group Project",
    arc: "Foundations",
    objective: "Make dependencies, risks and checkpoints visible in a project plan.",
    skill: "planning",
    scenario: "A group has three days to create a short presentation using sources and visuals.",
    task: "Create a four-step plan with one risk and one checkpoint.",
    evidenceFields: ["artifact", "reason", "reflection"],
    rubric: ["Sequenced dependencies", "Named a realistic risk", "Added a checkpoint"],
    feedback: { starter: "Your plan made hidden dependencies visible.", nextStep: "Run the checkpoint and revise the plan using what you learn." },
    completionLabel: "Project plan saved",
  }),
  mission({
    id: "missing-clue-11-13",
    pilotKey: "missing-clue",
    ageBand: "11-13",
    kind: "source-hunt",
    title: "Audit the Viral Claim",
    arc: "Evidence",
    objective: "Identify missing context, source quality and uncertainty before sharing a claim.",
    skill: "evidence",
    scenario: "A viral post claims a study proves that one study method works for everyone.",
    task: "Write the claim, list two checks and state what you still cannot conclude.",
    evidenceFields: ["artifact", "reason", "reflection"],
    rubric: ["Separated claim from evidence", "Chose meaningful checks", "Expressed uncertainty"],
    feedback: { starter: "You distinguished a claim from what the evidence can support.", nextStep: "Find the original study and compare its population with the post." },
    completionLabel: "Claim audit saved",
  }),
  mission({
    id: "three-ways-11-13",
    pilotKey: "three-ways",
    ageBand: "11-13",
    kind: "build-studio",
    title: "Design a Fair AI Helper",
    arc: "Create",
    objective: "Generate a tool idea while identifying who may be helped or excluded.",
    skill: "creativity",
    scenario: "Your class wants an AI helper for organizing revision, but classmates use different languages and devices.",
    task: "Create a brief with three features, one risk and one inclusion choice.",
    evidenceFields: ["artifact", "reason", "reflection"],
    rubric: ["Generated a coherent brief", "Named a risk", "Included an accessibility or equity choice"],
    feedback: { starter: "Your design considered people beyond the easiest user.", nextStep: "Test the brief with someone who has a different need." },
    completionLabel: "Fair helper brief saved",
  }),
  mission({
    id: "friend-explain-11-13",
    pilotKey: "friend-explain",
    ageBand: "11-13",
    kind: "explain-it",
    title: "Explain a Hard Idea Clearly",
    arc: "Communicate",
    objective: "Adapt explanation, examples and tone for a specific audience.",
    skill: "explanation",
    scenario: "A younger student asks what an AI model can and cannot know.",
    task: "Create a short explanation with one analogy, one limit and one check question.",
    evidenceFields: ["artifact", "reason", "revision"],
    rubric: ["Matched the audience", "Included a useful limit", "Asked for understanding"],
    feedback: { starter: "You explained the idea without hiding its limits.", nextStep: "Replace any abstract phrase with a concrete example." },
    completionLabel: "AI explanation saved",
  }),
  mission({
    id: "rule-change-11-13",
    pilotKey: "rule-change",
    ageBand: "11-13",
    kind: "strategy-switch",
    title: "Switch the Research Strategy",
    arc: "Adapt",
    objective: "Recognize when a search strategy is failing and choose a better one.",
    skill: "flexibility",
    scenario: "Your first search returns copied summaries but no original evidence.",
    task: "Describe the first strategy, diagnose the failure and write a replacement query.",
    evidenceFields: ["artifact", "reason", "revision"],
    rubric: ["Diagnosed the failure", "Changed the search strategy", "Explained the expected improvement"],
    feedback: { starter: "You treated a failed search as information.", nextStep: "Compare the new results and record one remaining limitation." },
    completionLabel: "Research switch saved",
  }),
  mission({
    id: "try-again-11-13",
    pilotKey: "try-again",
    ageBand: "11-13",
    kind: "reflect-improve",
    title: "Turn Feedback into Version Two",
    arc: "Reflect",
    objective: "Use feedback to revise an artifact and explain the reasoning behind the change.",
    skill: "reflection",
    scenario: "Your first research summary is accurate but too difficult for its intended reader.",
    task: "Create a before/after excerpt and explain the revision decision.",
    evidenceFields: ["artifact", "revision", "reflection"],
    rubric: ["Preserved the key meaning", "Improved audience fit", "Explained the trade-off"],
    feedback: { starter: "Your revision improved usefulness without hiding complexity.", nextStep: "Ask the intended reader to identify one remaining barrier." },
    completionLabel: "Version two saved",
  }),
  mission({
    id: "plan-rescue-14-17",
    pilotKey: "plan-rescue",
    ageBand: "14-17",
    kind: "choice-observatory",
    title: "Plan an Evidence-Ready Project",
    arc: "Foundations",
    objective: "Frame a real project with outcomes, assumptions, risks and review points.",
    skill: "planning",
    scenario: "You need to produce a useful AI-assisted project without outsourcing your judgment.",
    task: "Write a brief with outcome, steps, assumptions, risk and human review points.",
    evidenceFields: ["artifact", "reason", "reflection"],
    rubric: ["Defined a verifiable outcome", "Made assumptions visible", "Added review and stop conditions"],
    feedback: { starter: "Your plan kept accountability with the learner.", nextStep: "Run the first checkpoint and update the brief from evidence." },
    completionLabel: "Evidence-ready plan saved",
  }),
  mission({
    id: "missing-clue-14-17",
    pilotKey: "missing-clue",
    ageBand: "14-17",
    kind: "source-hunt",
    title: "Build a Claim-to-Source Trail",
    arc: "Evidence",
    objective: "Evaluate source quality, uncertainty and the limits of a conclusion.",
    skill: "evidence",
    scenario: "A career post uses a statistic to recommend a field to every student.",
    task: "Create a claim-to-source trail and write what the evidence does not prove.",
    evidenceFields: ["artifact", "reason", "reflection"],
    rubric: ["Located an original or authoritative source", "Checked scope and date", "Stated limits without overclaiming"],
    feedback: { starter: "You checked whether the evidence matched the size of the claim.", nextStep: "Find a second perspective and note where they disagree." },
    completionLabel: "Source trail saved",
  }),
  mission({
    id: "three-ways-14-17",
    pilotKey: "three-ways",
    ageBand: "14-17",
    kind: "build-studio",
    title: "Prototype a Human-Centered AI Tool",
    arc: "Create",
    objective: "Design a useful prototype with explicit users, constraints, risks and human decisions.",
    skill: "creativity",
    scenario: "A student team wants an AI tool that helps plan study without generating submitted work.",
    task: "Create a one-page product brief with user, workflow, failure case and ethical guardrail.",
    evidenceFields: ["artifact", "reason", "reflection"],
    rubric: ["Defined a real user need", "Included a failure case", "Protected learning and privacy"],
    feedback: { starter: "Your prototype made human responsibility visible.", nextStep: "Test the brief with a real learner and revise one assumption." },
    completionLabel: "Human-centered prototype saved",
  }),
  mission({
    id: "friend-explain-14-17",
    pilotKey: "friend-explain",
    ageBand: "14-17",
    kind: "explain-it",
    title: "Make a Responsible AI Case",
    arc: "Communicate",
    objective: "Present a balanced argument with audience awareness, evidence and limitations.",
    skill: "explanation",
    scenario: "A school committee is deciding whether students may use AI for brainstorming.",
    task: "Write a short recommendation with evidence, a counterargument and a safeguard.",
    evidenceFields: ["artifact", "reason", "revision"],
    rubric: ["Separated evidence from opinion", "Addressed a counterargument", "Proposed a practical safeguard"],
    feedback: { starter: "Your recommendation made room for both usefulness and risk.", nextStep: "Revise one sentence so a skeptical reader can test it." },
    completionLabel: "AI case saved",
  }),
  mission({
    id: "rule-change-14-17",
    pilotKey: "rule-change",
    ageBand: "14-17",
    kind: "strategy-switch",
    title: "Recover from a Broken Workflow",
    arc: "Adapt",
    objective: "Diagnose a workflow failure, choose a fallback and define a stop condition.",
    skill: "flexibility",
    scenario: "An AI-assisted research workflow returns confident but uncited paragraphs.",
    task: "Map the failure, replace one step and define when a human must stop and verify.",
    evidenceFields: ["artifact", "reason", "revision"],
    rubric: ["Located the failure point", "Designed a safer fallback", "Defined a stop/verify condition"],
    feedback: { starter: "You improved the process instead of trusting a fluent output.", nextStep: "Run the fallback on a small sample and log the result." },
    completionLabel: "Workflow recovery saved",
  }),
  mission({
    id: "try-again-14-17",
    pilotKey: "try-again",
    ageBand: "14-17",
    kind: "reflect-improve",
    title: "Curate Your First Proof Artifact",
    arc: "Reflect",
    objective: "Select representative work, explain its value and name the next capability to practice.",
    skill: "reflection",
    scenario: "You have three drafts from an AI project and need to choose one for a portfolio.",
    task: "Select one artifact, explain why it represents your learning and identify one next experiment.",
    evidenceFields: ["artifact", "revision", "reflection"],
    rubric: ["Selected evidence intentionally", "Explained the learning", "Named a realistic next experiment"],
    feedback: { starter: "You treated the portfolio as evidence of growth, not decoration.", nextStep: "Choose a different context for the next experiment." },
    completionLabel: "Proof artifact saved",
  }),
];

export const getExplorerMissions = (ageBand: ExplorerAgeBand) =>
  EXPLORER_PILOT_MISSIONS.filter((item) => item.ageBand === ageBand);

export const getExplorerMission = (id: string) =>
  EXPLORER_PILOT_MISSIONS.find((item) => item.id === id);
