import type { GameId } from "@/lib/learningProgress";

type NextActivity = { title: string; href: string; prompt: string };
const followUps: Record<GameId, NextActivity> = {
  "prompt-detective": { title:"Prompt Workshop",href:"/play?game=workshop",prompt:"Try building a prompt instead of choosing from examples." },
  "fact-check-quest": { title:"Source Hunt",href:"/play?game=source-hunt",prompt:"Practise the order of checks before trusting a claim." },
  "ai-safety-lab": { title:"AI Safety for Families",href:"/guides/ai-safety-for-kids-and-parents",prompt:"Talk about one privacy rule you can use this week." },
  "prompt-workshop": { title:"Prompt Detective",href:"/play",prompt:"Compare your prompt structure with other examples." },
  "source-hunt": { title:"Fact Check Quest",href:"/play?game=fact",prompt:"Use evidence checks on a new claim." },
  "bias-buster": { title:"Data Detective",href:"/play?game=data-detective",prompt:"Ask which context or group might be missing." },
  "ai-decoder": { title:"Prompt Detective",href:"/play",prompt:"Apply your understanding to a clearer request." },
  "data-detective": { title:"Fact Check Quest",href:"/play?game=fact",prompt:"Check the source and context of a numerical claim." },
  "creative-director": { title:"Creative Studio",href:"/discovery-lab?game=creative-studio",prompt:"Try a visual design, then describe your choices." },
  "code-coach": { title:"Robot Programmer",href:"/discovery-lab?game=robot-programmer",prompt:"Plan a sequence, test it and revise one step." },
  "decision-studio": { title:"Mission Commander",href:"/discovery-lab?game=mission-commander",prompt:"Explain why you chose the next step." },
  "tool-match": { title:"AI Safety Lab",href:"/play?game=safety",prompt:"Pause and review the risks of a tool choice." },
  robotics: { title:"Robot Programmer",href:"/discovery-lab?game=robot-programmer",prompt:"Try a short visual route and repair one mistake." },
  "pattern-builder": { title:"Memory Adventure",href:"/discovery-lab?game=memory-adventure",prompt:"Notice how you remember a visual change." },
  "memory-adventure": { title:"Mini Scientist",href:"/discovery-lab?game=mini-scientist",prompt:"Make a prediction before selecting an answer." },
  "mini-scientist": { title:"Bridge Builder",href:"/discovery-lab?game=bridge-builder",prompt:"Think about what makes a structure work." },
  "bridge-builder": { title:"Robot Programmer",href:"/discovery-lab?game=robot-programmer",prompt:"Turn a design into a step-by-step plan." },
  "robot-programmer": { title:"Traffic Controller",href:"/discovery-lab?game=traffic-controller",prompt:"Watch for changing rules and choose a safe action." },
  "traffic-controller": { title:"Mission Commander",href:"/discovery-lab?game=mission-commander",prompt:"Choose the next step and explain your decision." },
  "mission-commander": { title:"Creative Studio",href:"/discovery-lab?game=creative-studio",prompt:"Try another way to arrange the same idea." },
  "creative-studio": { title:"Performance Arena",href:"/discovery-lab?game=performance-arena",prompt:"Explore visual rhythm and notice what repeats." },
  "performance-arena": { title:"Pattern Builder",href:"/discovery-lab?game=pattern-builder",prompt:"Try another pattern with a new strategy." },
};

export function getGameFollowUp(gameId: GameId): NextActivity {
  return followUps[gameId];
}
