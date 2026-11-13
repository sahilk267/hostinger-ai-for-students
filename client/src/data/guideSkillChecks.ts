/** Fictional, privacy-safe decisions for published guides. No learner answers are stored. */
export type GuideSkillChoice = { label: string; feedback: string; correct: boolean };
export type GuideSkillCheck = { question: string; choices: readonly GuideSkillChoice[] };

export const guideSkillChecks: Record<string, GuideSkillCheck> = {
  "how-to-use-ai-for-studying": {
    "question": "An AI tool offers to write your entire science homework answer. What helps you learn while keeping the work your own?",
    "choices": [
      {
        "label": "Copy the answer and read it later.",
        "feedback": "Reading a finished answer can hide what you cannot yet explain. Start with your own attempt and request feedback or a hint instead.",
        "correct": false
      },
      {
        "label": "Try the question first, request one hint, then explain the idea without the tool.",
        "feedback": "Good learning habit. Your own attempt, a small hint, active recall and a source check help you see what you understand.",
        "correct": true
      },
      {
        "label": "Ask for a longer answer with harder words.",
        "feedback": "More detail does not replace practice. Ask for one clear hint and test your understanding in your own words.",
        "correct": false
      }
    ]
  },
  "ai-prompts-for-students": {
    "question": "You are stuck comparing two fractions. Which request is most useful for learning?",
    "choices": [
      {
        "label": "Give me all the worksheet answers.",
        "feedback": "This skips your own attempt and gives little information about where you are stuck. Request a hint or explanation instead.",
        "correct": false
      },
      {
        "label": "Explain maths quickly.",
        "feedback": "This is too broad. Identify the concept, what you have tried, and the kind of help you want.",
        "correct": false
      },
      {
        "label": "I can find equivalent fractions but struggle to compare 3/4 and 5/8. Ask me one question, then offer a hint, not my worksheet answer.",
        "feedback": "This gives a clear goal, useful context, a response format and a boundary that preserves the learner's work.",
        "correct": true
      }
    ]
  },
  "how-to-check-ai-answers": {
    "question": "A chatbot states that a school library is open every Sunday until 8 p.m., but names no school or source. What should you do?",
    "choices": [
      {
        "label": "Treat the statement as unresolved and check the correct school's current official timetable.",
        "feedback": "Correct. Match the school, location and date; only a relevant current source can support this claim.",
        "correct": true
      },
      {
        "label": "Use it because the answer sounds specific.",
        "feedback": "Specific wording is not evidence. Without the right school and source, this claim remains unverified.",
        "correct": false
      },
      {
        "label": "Repeat the question until the chatbot sounds more confident.",
        "feedback": "Confidence does not establish accuracy. Check an independent original source and record uncertainty.",
        "correct": false
      }
    ]
  },
  "ai-study-plan-for-exams": {
    "question": "A learner has four days and 30 minutes each day to revise fractions and ecosystems. Which plan is most useful?",
    "choices": [
      {
        "label": "Read both chapters for two hours every night, even if it is unrealistic.",
        "feedback": "A plan should fit the time actually available. Unrealistic schedules make it harder to practise and adapt.",
        "correct": false
      },
      {
        "label": "Use short recall and practice sessions, review mistakes, then revisit the weakest concept on day four.",
        "feedback": "This uses realistic time blocks with observable outputs, checks for mistakes and room to adjust.",
        "correct": true
      },
      {
        "label": "Spend every session asking AI to summarize both subjects.",
        "feedback": "Summaries alone do not expose misunderstandings. Include recall, questions and corrections.",
        "correct": false
      }
    ]
  },
  "ai-safety-for-kids-and-parents": {
    "question": "A child wants to paste their name, school, phone number and homework question into an AI tool. What is the safest next action?",
    "choices": [
      {
        "label": "Share everything to help the tool personalize the answer.",
        "feedback": "Unnecessary identifying details create privacy risk. The learning question rarely needs them.",
        "correct": false
      },
      {
        "label": "Share the phone number only, because it is not schoolwork.",
        "feedback": "A phone number is personal information too. Remove identifying details and check suitable tools with a trusted adult.",
        "correct": false
      },
      {
        "label": "Remove identifying details, use a fictional example and ask a trusted adult about tool suitability.",
        "feedback": "This protects privacy while keeping the learning goal. Follow the tool's age rules and family guidance.",
        "correct": true
      }
    ]
  },
  "ai-tools-for-beginners": {
    "question": "You are trying a generative AI tool for the first time. Which mini-project is a sensible start?",
    "choices": [
      {
        "label": "Ask it to make five water-cycle practice questions without personal details, then check them against class notes.",
        "feedback": "A small fictional or public-topic task, clear instructions and an independent check build transferable habits.",
        "correct": true
      },
      {
        "label": "Paste your school login and ask the tool to organize your account.",
        "feedback": "Never give passwords or account credentials to a public AI tool. Start with a non-sensitive practice task.",
        "correct": false
      },
      {
        "label": "Accept the first answer as accurate because it was generated by AI.",
        "feedback": "Generative AI can make mistakes. Compare important information with trustworthy sources.",
        "correct": false
      }
    ]
  }
};

export function reviewGuideSkillChoice(check: GuideSkillCheck, index: number): GuideSkillChoice | null {
  if (!Number.isInteger(index) || index < 0 || index >= check.choices.length) return null;
  return check.choices[index];
}
