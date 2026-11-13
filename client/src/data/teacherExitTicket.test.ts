import { describe, expect, it } from "vitest";
import { exitTicketQuestions, formatExitTicket, type ExitTicketTopic } from "./teacherExitTicket";
const topics: ExitTicketTopic[] = ["prompting", "fact-checking", "privacy", "robotics"];
describe("teacher exit tickets", () => {
  it("provides three distinct reflection prompts per topic", () => {
    expect(Object.keys(exitTicketQuestions).sort()).toEqual([...topics].sort());
    for (const topic of topics) {
      expect(exitTicketQuestions[topic]).toHaveLength(3);
      expect(new Set(exitTicketQuestions[topic]).size).toBe(3);
      expect(exitTicketQuestions[topic].every(q => q.endsWith("?") || q.endsWith("."))).toBe(true);
    }
  });
  it("exports a complete ungraded worksheet without learner identity fields", () => {
    for (const topic of topics) {
      const text = formatExitTicket(topic, "Example lesson");
      expect(text).toContain("Example lesson");
      for (const q of exitTicketQuestions[topic]) expect(text).toContain(q);
      expect(text).toContain("not a validated assessment");
      expect(text).not.toMatch(/Student name:|Student ID:|Score:/i);
    }
  });
});
