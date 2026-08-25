# AI for Students: Research-backed product improvement brief

## Executive conclusion

The current direction—topics, prompt cards, quizzes and a 30-day map—is a useful foundation, but it is not yet a strong reason for students to return or share. The product should not compete as another “AI tips” library. Its sharper position should be:

> **A practical AI skill gym where students bring real work, practice judgment, build a private proof portfolio and earn shareable milestones only after demonstrating the skill.**

The most important change is not adding more pages. It is changing the core loop from **read → click → badge** to **choose a real challenge → attempt it → get guided feedback → improve the artifact → save proof → unlock the next challenge**.

## What the research says

| Evidence | What it means for the product |
|---|---|
| Adaptive-learning research highlights personalization, real-time feedback, progress tracking and tailored content, while also flagging privacy, bias and the need for human interaction. [1] | Track demonstrated skills and error patterns, then adapt the next task. Do not only show a large catalog. |
| Retrieval practice generally outperforms repeated studying for longer-term retention. Low-stakes recall, brain dumps, teach-back and timely feedback are practical formats. [2] | Daily missions should make the learner produce or explain something, not merely read an AI lesson. |
| Self-Determination Theory identifies autonomy, competence and relatedness as conditions supporting high-quality motivation, persistence and creativity. [3] | Let learners choose tracks, show real mastery evidence and share selectively. Avoid public shame, forced competition and empty streak pressure. |
| Duolingo’s AI experience uses roleplay, real-time interaction, transcripts and post-interaction feedback, with humans authoring scenarios and reviewing generated content. [4] | Make scenarios feel like real situations and give feedback after the attempt. Human-authored boundaries matter. |
| Khanmigo differentiates from general chat by guiding learners with questions and hints instead of directly giving answers. [5] | AI for Students should ask follow-up questions, reveal hints progressively and protect the learner’s thinking. |
| Stanford’s framework divides AI literacy into functional, ethical, rhetorical and pedagogical domains, progressing from awareness to analysis and creation. [6] | Badges should represent a real competency domain, not “used a prompt.” |
| Project-based learning works around an authentic problem, investigation/design, a final product and reflection; guidance is needed to keep projects aligned with learning goals. [7] | The best shareable result is an authentic artifact plus a short reflection and clear skill label. |
| Portfolio guidance recommends that learners select representative work, explain why it matters, respond to feedback and identify next steps. [8] | Build a selective AI proof portfolio, not an automatic feed of every answer. |
| UNESCO recommends privacy protection, age-appropriate access, human agency and pedagogical design for GenAI in education. [9] | Make sharing opt-in, redact private content by default and clearly state that AI assists while the learner remains accountable. |

## Recommended product concept: AI Skill Gym

The 30-day Journey should become the structured spine, but each day should feel like a small studio challenge rather than a lesson page. Every challenge needs five parts: a realistic scenario, a learner attempt, one guided feedback moment, an improved artifact and a proof card.

For example, Day 7 should not say “learn active recall.” It should say: **“You have 20 minutes before a biology test. Turn one page of notes into five recall questions, answer without looking, then compare your gaps.”** The learner submits the questions and one answer. The system identifies whether the questions require recall rather than copying, gives one improvement hint and awards the milestone only after the learner revises.

## Priority roadmap

| Priority | Build | Why it matters | Success signal |
|---|---|---|---|
| P0 | Evidence-gated daily missions | Fixes the current false-completion problem and makes every day meaningful. | Learners submit an artifact before completion; empty or superficial submissions are rejected. |
| P0 | Guided feedback loop | Creates a reason to use the platform instead of copying a prompt elsewhere. | Learner sees one diagnosis, one hint and one revision step. |
| P0 | AI Proof Portfolio | Converts 30 isolated days into a visible story of growth. | Learner can select 3–5 artifacts and export/share a privacy-safe portfolio. |
| P1 | Four-domain skill map | Makes the curriculum coherent and differentiates it from generic prompt advice. | Each milestone maps to functional, ethical, rhetorical or pedagogical literacy. |
| P1 | Scenario simulator | Adds emotional and practical interest: interview, research claim, group project, coding bug, misinformation, presentation. | Learner makes a decision under constraints and explains why. |
| P1 | Curiosity branches | Adds freedom inside the fixed 30-day arc: simplify, go deeper, compare sources, try another context. | Learners can explore without losing the daily progression. |
| P1 | Share studio | Generates a designed card with day, skill, artifact title and learner reflection—not private content by default. | Share action is intentional, previewable and redacted. |
| P2 | Adaptive next-day difficulty | Uses mistakes and self-rating to suggest easier, standard or stretch variants. | The next task responds to observed gaps rather than only calendar order. |
| P2 | Facilitator/classroom mode | Gives teachers a safe way to assign missions and review artifacts without exposing private account data. | A teacher can create a cohort challenge and see rubric-level progress. |
| P2 | Paid portfolio/career layer | Monetizes outcomes that have real value: reviewed portfolio, CV evidence, interview practice and certificates. | Users pay for review depth or export utility, not for basic access to learning. |

## The 30-day structure should be six arcs

The current six arcs are directionally good, but they should produce progressively stronger proof.

| Days | Arc | Final proof |
|---:|---|---|
| 1–5 | Foundations | A clear, bounded AI request with assumptions and review points. |
| 6–10 | Study Systems | A recall-and-feedback study artifact that demonstrates learning. |
| 11–15 | Research & Evidence | A claim-to-source trail with uncertainty and verification notes. |
| 16–20 | Build & Create | A brief, prototype and reflection showing human creative decisions. |
| 21–25 | Code & Automation | A tested, explainable workflow with failure cases and stop conditions. |
| 26–30 | Career & Life | A privacy-safe portfolio page containing selected evidence and next goals. |

The final day should not be a generic certificate. It should be a **30-Day AI Builder Portfolio** containing selected artifacts, four-domain skill stamps, a learner-written reflection and a transparent statement that the work was completed through guided practice. This is more credible and more shareable than “I completed 30 lessons.”

## Sharing mechanics that can create pride without fake social proof

The shareable object should show **identity through work**, not a rank. A good card might say: “Day 14 — Evidence Finder. I learned to verify a statistic before repeating it.” It can include the learner’s chosen display name, skill arc, artifact title, date and a short reflection. It should not include raw assignment text, email, private source notes or claims such as “top 1%” unless there is real, audited data.

The user should preview the card, toggle fields on/off, copy a social caption and choose between private portfolio, link-only card or public share. A QR code or short URL can lead to a read-only card that contains only the selected proof. Sharing must never be required to continue the course.

## What to avoid

Avoid adding more static prompt categories as the main growth strategy. Avoid awarding milestones for textarea length alone; minimum characters are a guardrail, not proof of quality. Avoid public leaderboards, fake testimonials, inflated completion claims and streaks that punish a missed day. Avoid making AI generate finished assignments. Avoid collecting uploaded student work by default unless retention, deletion and privacy boundaries are explicit.

## Recommended next build

The next implementation should be **Mission Studio 2.0: Guided Artifact Review**. Keep the current 30-day map, but replace the generic evidence textarea with a day-specific artifact form. Each day should have a concrete deliverable, a small rubric with two or three checks, one “improve this” loop and a share-card preview. The first vertical slice should cover Days 1, 6, 11, 16, 21 and 26—one representative day from each arc—before authoring all 30 in the same format.

A later server-side AI layer can provide guided feedback, but it should be introduced behind strict prompt boundaries, output validation, privacy warnings and human review of the authored scenarios. The current Hostinger deployment can continue to host the deterministic curriculum while the AI feedback service is tested separately.

## Decision

**Do not add 18 more static features. Build one excellent end-to-end loop first:** real scenario, learner artifact, guided review, revision, proof portfolio and optional share. If students voluntarily share the artifact because it says something true about what they can do, reach will follow naturally; forcing sharing or decorating the product with badges will not create durable attraction.

## References

[1]: https://www.mdpi.com/2227-7102/13/12/1216 "Adaptive Learning Using Artificial Intelligence in e-Learning: A Literature Review"
[2]: https://ctl.wustl.edu/resources/using-retrieval-practice-to-increase-student-learning/ "Using Retrieval Practice to Increase Student Learning — Washington University Center for Teaching and Learning"
[3]: https://selfdeterminationtheory.org/theory/ "Self-Determination Theory: Theory overview"
[4]: https://blog.duolingo.com/duolingo-max/ "Introducing Duolingo Max, a learning experience powered by GPT-4"
[5]: https://www.khanmigo.ai/ "Khanmigo — Khan Academy’s AI-powered teaching assistant and tutor"
[6]: https://teachingcommons.stanford.edu/teaching-guides/artificial-intelligence-teaching-guide/understanding-ai-literacy "Understanding AI Literacy — Stanford Teaching Commons"
[7]: https://digitalpromise.org/research-map/topics/project-based-learning/ "Project-Based Learning — Digital Promise Research Map"
[8]: https://assessment.uiowa.edu/using-student-learning-portfolios-departmental-outcomes-assessment "Using Student Learning Portfolios for Departmental Outcomes Assessment — University of Iowa"
[9]: https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research "Guidance for generative AI in education and research — UNESCO"
