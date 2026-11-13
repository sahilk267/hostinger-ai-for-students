/** Printable, ungraded reflection prompts. Do not include student identifiers in analytics. */
export type ExitTicketTopic = "prompting" | "fact-checking" | "privacy" | "robotics";
export const exitTicketQuestions: Record<ExitTicketTopic, readonly [string, string, string]> = {
  prompting: [
    "Write one improvement you made to a vague AI prompt.",
    "What detail helped you make the request clearer?",
    "What would you verify before using the AI response?"
  ],
  "fact-checking": [
    "Write one checkable claim from today's fictional example.",
    "Name a suitable independent source type to check it.",
    "What remains uncertain, and what would you do next?"
  ],
  privacy: [
    "Which identifying details should be removed from a fictional prompt?",
    "Rewrite the prompt without private information.",
    "Who could you ask before sharing something uncertain?"
  ],
  robotics: [
    "Describe the route or plan you tried.",
    "Which step did you revise after testing?",
    "What would you test next, and why?"
  ]
};
export function formatExitTicket(topic: ExitTicketTopic, title: string): string {
  return [
    "AI FOR STUDENTS — CLASSROOM EXIT TICKET",
    "Topic: " + title,
    "Date (optional): __________________",
    "Use a fictional example. Do not include names, school details or other private information.",
    "",
    ...exitTicketQuestions[topic].flatMap((question, index) => [
      (index + 1) + ". " + question,
      "____________________________________________________________",
      "____________________________________________________________",
      ""
    ]),
    "Teacher observation (optional; not a grade):",
    "[ ] Explained a decision  [ ] Named evidence or a revision  [ ] Needs another example",
    "Next practice question: ______________________________________",
    "",
    "This is an ungraded discussion aid, not a validated assessment or student profile."
  ].join("\n");
}
