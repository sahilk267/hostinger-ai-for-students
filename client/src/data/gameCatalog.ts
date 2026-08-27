import { GameId } from "@/lib/learningProgress";
import { Difficulty, AgeBand } from "./contentSchema";

export type GameCatalogItem = { id: GameId; label: string; note: string; difficulty: Difficulty; ageBand: AgeBand; topics: string[]; skills: string[] };

export const gameCatalog: GameCatalogItem[] = [
  { id: "prompt-detective", label: "Prompt Detective", note: "Build better requests", difficulty: "starter", ageBand: "11-13", topics: ["learning workflows"], skills: ["prompting", "study"] },
  { id: "fact-check-quest", label: "Fact Check Quest", note: "Verify before you trust", difficulty: "building", ageBand: "14-17", topics: ["fact checking"], skills: ["evidence", "research"] },
  { id: "ai-safety-lab", label: "AI Safety Lab", note: "Make the safer move", difficulty: "starter", ageBand: "11-13", topics: ["responsible AI"], skills: ["safety", "ethics"] },
  { id: "prompt-workshop", label: "Prompt Workshop", note: "Build, don't guess", difficulty: "building", ageBand: "14-17", topics: ["communication"], skills: ["prompting", "writing"] },
  { id: "source-hunt", label: "Source Hunt", note: "Sequence the check", difficulty: "building", ageBand: "18+", topics: ["fact checking"], skills: ["evidence", "research"] },
  { id: "bias-buster", label: "Bias Buster", note: "Notice hidden assumptions", difficulty: "stretch", ageBand: "18+", topics: ["fairness"], skills: ["bias", "ethics"] },
  { id: "ai-decoder", label: "AI Decoder", note: "Translate the machine", difficulty: "starter", ageBand: "11-13", topics: ["AI basics"], skills: ["fundamentals", "prompting"] },
  { id: "data-detective", label: "Data Detective", note: "Read the number", difficulty: "building", ageBand: "14-17", topics: ["data literacy"], skills: ["data", "evidence"] },
  { id: "creative-director", label: "Creative Director", note: "Shape the brief", difficulty: "starter", ageBand: "11-13", topics: ["creative work"], skills: ["creativity", "prompting"] },
  { id: "code-coach", label: "Code Coach", note: "Review with care", difficulty: "stretch", ageBand: "18+", topics: ["software practice"], skills: ["coding", "security"] },
  { id: "decision-studio", label: "Decision Studio", note: "Keep humans deciding", difficulty: "stretch", ageBand: "18+", topics: ["human judgment"], skills: ["judgment", "safety"] },
  { id: "tool-match", label: "Tool Matchmaker", note: "Choose the right fit", difficulty: "building", ageBand: "14-17", topics: ["tool choice"], skills: ["tools", "workflow"] },
  { id: "robotics", label: "Robot Route Builder", note: "Plan, test and repair a robot system", difficulty: "building", ageBand: "11-13", topics: ["robotics", "systems thinking"], skills: ["planning", "logic", "safety"] },
];
