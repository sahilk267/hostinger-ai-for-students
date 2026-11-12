export type LearningCluster = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  audience: string;
  questions: {question:string;answer:string}[];
  guides: {title:string;href:string;summary:string}[];
  practice: {title:string;href:string;why:string}[];
};
export const learningClusters: LearningCluster[] = [
  {
    slug:"ai-study-skills",title:"Free AI Study Skills for Students",description:"A practical path for studying with AI: hints, active recall, responsible prompts, an exam plan and practice without copying answers.",
    audience:"Students who want practical study support",intro:"AI should help you explain, practise and verify an idea, not replace the learning. Start with one short guide, try a prompt and practise checking an answer.",
    questions:[
      {question:"Should I ask AI to complete my assignment?",answer:"Use AI for explanations, alternative examples, quizzes and feedback rather than submitting generated work as your own. Follow your school's rules."},
      {question:"What is the quickest way to revise with AI?",answer:"Make a first attempt from memory, ask for short questions one at a time, then check any inaccurate or uncertain claims in a textbook or other trusted source."},
      {question:"Do AI-made citations need checking?",answer:"Yes. Confirm the cited work exists and actually supports the claim; AI can generate inaccurate or nonexistent citations."},
    ],
    guides:[
      {title:"How to use AI for studying",href:"/guides/how-to-use-ai-for-studying",summary:"Hints, feedback and teach-back instead of answer copying"},
      {title:"Better prompts for students",href:"/guides/ai-prompts-for-students",summary:"Structure a learning prompt using a task and context"},
      {title:"Make an exam revision plan",href:"/guides/ai-study-plan-for-exams",summary:"Organise smaller study and review sessions"},
    ],
    practice:[
      {title:"Prompt Detective",href:"/play",why:"Compare prompts and learn to ask clearer questions"},
      {title:"Study with AI",href:"/study",why:"Try student-friendly study workflows"},
      {title:"First learning journey",href:"/start",why:"Choose a short task and reflect on your practice"},
    ],
  },
  {
    slug:"ai-safety-and-fact-checking",title:"AI Safety and Fact-Checking for Families",description:"Learn how to check AI answers, avoid oversharing personal details and practise safer AI decisions with free family-friendly resources.",
    audience:"Parents, students and family educators",intro:"A fluent AI answer can still be mistaken, and a useful prompt can still share too much. Practise privacy and independent source checks with fictional examples.",
    questions:[
      {question:"How can a family check an AI answer?",answer:"Identify one specific factual claim, locate a reliable independent source and compare the claim with that source. Mark what remains uncertain."},
      {question:"What information should stay out of an AI prompt?",answer:"Avoid sharing a child's name, address, school, contact details, passwords, private photos or identifying documents."},
      {question:"Are AI safety games assessments of a child?",answer:"No. They offer optional practice and discussion prompts, not a validated assessment, diagnosis or intelligence score."},
    ],
    guides:[
      {title:"How to check AI answers",href:"/guides/how-to-check-ai-answers",summary:"Find specific claims and verify them against appropriate sources"},
      {title:"AI safety for kids and parents",href:"/guides/ai-safety-for-kids-and-parents",summary:"Practical privacy and supervision boundaries"},
      {title:"How to use AI tools safely",href:"/guides/ai-tools-for-beginners",summary:"Begin with useful tasks and keep a human reviewing"},
    ],
    practice:[
      {title:"Fact Check Quest",href:"/play?game=fact",why:"Investigate claims before sharing them"},
      {title:"AI Safety Lab",href:"/play?game=safety",why:"Make safer choices using fictional scenarios"},
      {title:"Family activity planner",href:"/parents",why:"Build five short parent-child discussions"},
    ],
  },
  {
    slug:"visual-ai-and-robotics",title:"Visual Learning Games and Robotics Activities",description:"Explore free visual learning games, patterns, predictions and robot planning with clear feedback and family or classroom practice ideas.",
    audience:"Curious younger learners, parents and educators",intro:"Some ideas are easier to explore with shapes, routes and predictions than with long explanations. These activities encourage learners to notice, try, reflect and make a new attempt.",
    questions:[
      {question:"What can children do in a visual learning game?",answer:"Try patterns, memory, predictions, building challenges and short robot routes, then talk about which approach worked and what they would change."},
      {question:"Do the games diagnose learning strengths?",answer:"No. Game completion records show the activity attempted and are not validated ability, IQ or career predictions."},
      {question:"Can teachers use these games in class?",answer:"Yes, teachers can adapt the free classroom activity packs to local curriculum, student ages and accessibility needs, subject to school rules."},
    ],
    guides:[
      {title:"AI basics for beginners",href:"/guides/ai-tools-for-beginners",summary:"Understand tools before relying on them"},
      {title:"Family AI safety guidance",href:"/guides/ai-safety-for-kids-and-parents",summary:"Choose age-appropriate learning and supervision"},
    ],
    practice:[
      {title:"Visual Discovery Lab",href:"/discovery-lab",why:"Explore nine visual practice worlds"},
      {title:"Robot Route Builder",href:"/robotics",why:"Plan, test and repair step-by-step routes"},
      {title:"Teacher lesson collections",href:"/teachers",why:"Copy ready-to-adapt multi-session classroom plans"},
    ],
  },
];
export const getLearningCluster = (slug:string)=>learningClusters.find(item=>item.slug===slug);
