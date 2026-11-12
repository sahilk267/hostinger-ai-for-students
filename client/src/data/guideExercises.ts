/** Concrete exercises for the most visited-intent learning guides.
 * All examples are fictional and can be completed without submitting learner data.
 */
export type GuideExercise = {
  label: string;
  scenario: string;
  task: string;
  modelApproach: string;
  check: string;
};
export const guideExercises: Record<string, GuideExercise[]> = {
  "how-to-use-ai-for-studying": [
    {label:"Worked example: photosynthesis",scenario:"You understand that plants need light, but you can't explain why shade changes growth.",task:"Write what you currently know in two sentences. Ask an AI tool for one hint about light and energy without requesting a finished homework answer. After reading, close the tool and explain the concept in your own words.",modelApproach:"I know plants use sunlight. I'm confused about what the light supplies. Ask me one question first, then give one short hint. Please don't write my answer.",check:"Compare your teach-back with your textbook or class notes. Which sentence can you now explain without looking?"},
    {label:"Practice: active recall",scenario:"You've just revised the water cycle for 15 minutes.",task:"Close your notes. Sketch or write three stages from memory, then ask for three practice questions one at a time.",modelApproach:"Quiz me about evaporation, condensation and precipitation one question at a time. Wait for my answer, give a hint if I struggle and explain errors after I retry.",check:"Mark which stage you missed and schedule that concept for a later review instead of merely rereading everything."},
  ],
  "ai-prompts-for-students": [
    {label:"Before-and-after prompt",scenario:"Vague prompt: 'Help with maths.'",task:"Rewrite it with your learning goal, level, what you've already tried, desired output and a no-homework-copy boundary.",modelApproach:"I'm learning fractions. I understand equivalent fractions but struggle to compare 3/4 and 5/8. Ask me what common denominator I would choose, then give one hint. Don't solve my worksheet for me.",check:"Could another student tell what topic, challenge and response format you need? Remove private details."},
    {label:"Iterate and verify",scenario:"The first AI answer uses an analogy you don't understand.",task:"Ask for another concrete analogy and a two-question self-check; then verify any numbers or facts yourself.",modelApproach:"That analogy didn't help. Try a real-world example using equal-sized pieces, then ask me two questions before sharing explanations. Flag any assumptions.",check:"Write what changed between prompt one and prompt two, and whether the second explanation actually helped."},
  ],
  "how-to-check-ai-answers": [
    {label:"Fictional claim-check worksheet",scenario:"A chatbot says: 'The school library is open every Sunday until 8 p.m.' No source or school is given.",task:"Separate claim, missing context and evidence needed. Decide whether to use this statement in an answer.",modelApproach:"Claim: library opening hours. Missing: school name, location, term dates and source. Best evidence: the library's current official timetable. Status: unresolved.",check:"Do not invent a timetable. Only mark supported after checking an actual official source for the correct place and date."},
    {label:"Check a made-up citation",scenario:"An AI answer references a research paper you cannot locate.",task:"Search the exact title in the publisher or research index. Confirm author, publication year, and whether the paper supports the claim.",modelApproach:"If the paper cannot be independently found, label the citation unverified and look for another appropriate original source.",check:"A plausible-looking title is not evidence. Keep a record of the source URL and what it actually says, without storing private learner data."},
  ],
  "ai-study-plan-for-exams": [
    {label:"A realistic mini revision timetable",scenario:"A student has four study days, 30 minutes daily, and two subjects: fractions and ecosystems.",task:"Allocate two sessions to the weaker subject using recent mistakes, one mixed practice session, and one short review. Include breaks and adjustments.",modelApproach:"Day 1: fractions practice; Day 2: ecosystems recall; Day 3: mixed questions and error review; Day 4: revisit the two hardest concepts. Adjust to the real syllabus.",check:"Every session has a concrete output: solved questions, recall notes or an error correction—not just 'study more'."},
  ],
  "ai-safety-for-kids-and-parents": [
    {label:"A fictional privacy check",scenario:"A child plans to paste their name, school, class timetable and question into a public AI tool.",task:"Identify which details are unnecessary; rewrite the request using a fictional, non-identifying example.",modelApproach:"I'm practising a science question at an introductory level. Give one hint, then ask me to explain the answer myself. No name or school is needed.",check:"Follow the tool's minimum-age rules and agree which tasks need an adult present."},
  ],
  "ai-tools-for-beginners": [
    {label:"Your first 10-minute project",scenario:"You want to prepare a safe study checklist for a school topic.",task:"Pick a public topic, ask for a short checklist with questions, then compare it against trusted class resources.",modelApproach:"Create a checklist to review the water cycle using five short questions. Don't request my personal information. Flag things I should check in a textbook.",check:"Correct any errors and explain one concept without relying on the output."},
  ],
};
