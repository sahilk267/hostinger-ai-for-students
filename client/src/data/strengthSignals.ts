export const DISCOVERY_AGE_BANDS = ["5-7", "8-10", "11-12", "13-15"] as const;
export type DiscoveryAgeBand = (typeof DISCOVERY_AGE_BANDS)[number];

export type StrengthSkill =
  | "logical-reasoning" | "pattern-recognition" | "problem-solving" | "working-memory" | "visual-memory"
  | "attention" | "processing-speed" | "decision-making" | "planning" | "critical-thinking"
  | "adaptability" | "spatial-reasoning" | "sequencing" | "computational-thinking" | "optimization"
  | "systems-thinking" | "observation" | "hypothesis-formation" | "cause-effect" | "evidence-evaluation"
  | "creativity" | "visual-creativity" | "storytelling" | "originality" | "design-thinking"
  | "communication" | "perspective-taking" | "rhythm" | "auditory-memory" | "motor-coordination"
  | "timing" | "persistence" | "strategy-adaptation" | "exploration" | "hint-utilization" | "consistency";

export type SkillEvidence = {
  skill: StrengthSkill;
  signal: "early-estimate" | "developing" | "strong";
  confidence: "low" | "medium" | "high";
  evidenceCount: number;
  sourceGames: string[];
  label: "Based on current gameplay";
};

export const skillLabels: Record<StrengthSkill, string> = {
  "logical-reasoning": "Logical reasoning", "pattern-recognition": "Pattern recognition", "problem-solving": "Problem solving",
  "working-memory": "Working memory", "visual-memory": "Visual memory", attention: "Attention", "processing-speed": "Processing speed",
  "decision-making": "Decision making", planning: "Planning", "critical-thinking": "Critical thinking", adaptability: "Adaptability",
  "spatial-reasoning": "Spatial reasoning", sequencing: "Sequencing", "computational-thinking": "Computational thinking", optimization: "Optimization",
  "systems-thinking": "Systems thinking", observation: "Observation", "hypothesis-formation": "Hypothesis formation", "cause-effect": "Cause and effect",
  "evidence-evaluation": "Evidence evaluation", creativity: "Creativity", "visual-creativity": "Visual creativity", storytelling: "Storytelling",
  originality: "Originality", "design-thinking": "Design thinking", communication: "Communication", "perspective-taking": "Perspective taking",
  rhythm: "Rhythm", "auditory-memory": "Auditory memory", "motor-coordination": "Motor coordination", timing: "Timing",
  persistence: "Persistence", "strategy-adaptation": "Strategy adaptation", exploration: "Exploration", "hint-utilization": "Hint use", consistency: "Consistency",
};

export const ageBandGuidance: Record<DiscoveryAgeBand, { label: string; interaction: string; complexity: string }> = {
  "5-7": { label: "Ages 5–7", interaction: "Colors, shapes, positions and simple touch choices", complexity: "3–4 objects, one rule, no timer pressure" },
  "8-10": { label: "Ages 8–10", interaction: "Matching, sorting and simple if/then choices", complexity: "More objects, two rules and gentle distraction" },
  "11-12": { label: "Ages 11–12", interaction: "Multi-step planning, patterns and controlled choices", complexity: "Working-memory load, constraints and repair rounds" },
  "13-15": { label: "Ages 13–15", interaction: "Trade-offs, optimization and changing conditions", complexity: "Multiple rules, ambiguity and evidence-based decisions" },
};

export function evidenceLabel(evidenceCount: number): SkillEvidence["signal"] {
  if (evidenceCount >= 5) return "strong";
  if (evidenceCount >= 3) return "developing";
  return "early-estimate";
}

export function evidenceConfidence(evidenceCount: number): SkillEvidence["confidence"] {
  if (evidenceCount >= 5) return "high";
  if (evidenceCount >= 3) return "medium";
  return "low";
}

export function makeSkillEvidence(skill: StrengthSkill, evidenceCount: number, sourceGames: string[]): SkillEvidence {
  return { skill, signal: evidenceLabel(evidenceCount), confidence: evidenceConfidence(evidenceCount), evidenceCount, sourceGames, label: "Based on current gameplay" };
}

export const fieldExplorationMap: Record<string, StrengthSkill[]> = {
  "Engineering and robotics": ["logical-reasoning", "spatial-reasoning", "problem-solving", "systems-thinking", "optimization"],
  "Computer science": ["logical-reasoning", "computational-thinking", "pattern-recognition", "problem-solving", "persistence"],
  "Architecture and design": ["spatial-reasoning", "visual-creativity", "planning", "optimization", "design-thinking"],
  "Science and investigation": ["observation", "hypothesis-formation", "cause-effect", "evidence-evaluation", "attention"],
  "Art, story and media": ["creativity", "visual-creativity", "originality", "storytelling", "communication"],
  "Music and movement": ["rhythm", "auditory-memory", "timing", "motor-coordination", "sequencing"],
};

export const strengthSafetyCopy = {
  boundary: "These are current game-based signals, not an IQ test, diagnosis or fixed child label.",
  fieldIntro: "Fields worth exploring based on current gameplay—not predictions.",
  earlyEstimate: "Early estimate: play more varied missions before drawing conclusions.",
};

export type FieldSuggestion = { field: string; matchedSkills: StrengthSkill[]; note: string };

export function suggestFields(skills: StrengthSkill[], minimumMatches = 2): FieldSuggestion[] {
  const available = new Set(skills);
  return Object.entries(fieldExplorationMap)
    .map(([field, mappedSkills]) => ({ field, matchedSkills: mappedSkills.filter((skill) => available.has(skill)), note: "Worth exploring based on current gameplay—not a prediction." }))
    .filter((item) => item.matchedSkills.length >= minimumMatches)
    .sort((a, b) => b.matchedSkills.length - a.matchedSkills.length);
}
