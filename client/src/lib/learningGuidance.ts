import type { GameId, LearningProgress } from "./learningProgress";

export type PracticeNextStep = {
  title: string;
  reason: string;
  action: string;
  href: string;
};

const suggestedWorlds: { id: GameId; title: string; href: string; action: string }[] = [
  { id: "pattern-builder", title: "Pattern Builder", href: "/discovery-lab?game=pattern-builder", action: "Ask your child to describe which part of the pattern repeats." },
  { id: "memory-adventure", title: "Memory Adventure", href: "/discovery-lab?game=memory-adventure", action: "Try one round together, then discuss a memory trick that helped." },
  { id: "mini-scientist", title: "Mini Scientist", href: "/discovery-lab?game=mini-scientist", action: "Ask for a prediction before each move and compare it with what happened." },
  { id: "robot-programmer", title: "Robot Programmer", href: "/discovery-lab?game=robot-programmer", action: "Plan the route aloud, test it, and talk through one change." },
];

/** Practical play suggestions, not an ability assessment or personalized diagnosis. */
export function getPracticeNextStep(progress: LearningProgress): PracticeNextStep {
  const neverPlayed = suggestedWorlds.find(({ id }) => progress[id].completions === 0);
  if (neverPlayed) {
    const attempted = progress[neverPlayed.id].attempts > 0;
    return {
      title: attempted ? `Finish a round of ${neverPlayed.title}` : `Explore ${neverPlayed.title}`,
      reason: attempted
        ? "An earlier session was started but no completion is recorded. Finishing is optional."
        : "Try a different kind of activity to gather varied practice experiences.",
      action: neverPlayed.action,
      href: neverPlayed.href,
    };
  }

  const leastPracticed = [...suggestedWorlds].sort(
    (a, b) => progress[a.id].completions - progress[b.id].completions
  )[0];

  return {
    title: `Try a new approach in ${leastPracticed.title}`,
    reason: "Several activity types have been explored. Replaying with a new strategy can support reflection.",
    action: leastPracticed.action,
    href: leastPracticed.href,
  };
}
