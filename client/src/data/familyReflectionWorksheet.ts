/** Ungraded, printable parent-child conversation worksheets. No personal data stored. */
export const familyReflectionPrompts = [
  ["What claim did we check together?", "Where could we find an independent source?", "What is still uncertain?"],
  ["What pattern or rule did you notice?", "What did you try when the pattern changed?", "What could we test next?"],
  ["What was the robot supposed to do?", "Which step did we change after testing?", "What might happen if we tried a different route?"],
  ["Which details in the imaginary prompt were private?", "How could we ask the question without identifying anyone?", "Who could help us decide what is safe to share?"],
] as const;

export function formatFamilyReflectionWorksheet(index: number, goal: string, activityUrl: string): string {
  const prompts = familyReflectionPrompts[index];
  if (!prompts) throw new RangeError("Unknown family activity");
  return [
    "AI FOR STUDENTS — FAMILY REFLECTION WORKSHEET",
    "Activity: " + goal,
    "Practice together: " + activityUrl,
    "Use imaginary examples and discuss out loud. No names, school details or private information are needed.",
    "",
    ...prompts.flatMap((question, i) => [
      (i + 1) + ". " + question,
      "____________________________________________________________",
      "____________________________________________________________",
      ""
    ]),
    "One thing we would like to try next:",
    "____________________________________________________________",
    "",
    "Family note: praise curiosity, reasoning and safe choices rather than speed or scores.",
    "This worksheet is ungraded and is not an intelligence or psychological assessment."
  ].join("\n");
}
