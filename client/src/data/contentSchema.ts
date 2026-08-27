export type ReviewStatus = "reviewed" | "needs-review";
export type Difficulty = "starter" | "building" | "stretch";
export type AgeBand = "5-7" | "8-10" | "11-12" | "11-13" | "13-15" | "14-17" | "18+";

export type ReviewedContentMeta = {
  id: string;
  learningObjective: string;
  reviewStatus: ReviewStatus;
  difficulty: Difficulty;
  ageBand: AgeBand;
  topicIds: string[];
};

export function reviewedMeta(gameId: string, index: number, objective: string, topics: string[] = []): ReviewedContentMeta {
  return {
    id: `${gameId}-${String(index + 1).padStart(2, "0")}`,
    learningObjective: objective,
    reviewStatus: "reviewed",
    difficulty: index < 10 ? "starter" : index < 20 ? "building" : "stretch",
    ageBand: index % 3 === 0 ? "11-13" : index % 3 === 1 ? "14-17" : "18+",
    topicIds: topics,
  };
}
