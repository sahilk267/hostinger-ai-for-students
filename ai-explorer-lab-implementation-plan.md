# AI for Students → AI Explorer Lab
## Complete implementation blueprint

**Document status:** Implementation-ready blueprint

**Product goal:** Add a child-safe, age-appropriate strengths-in-practice layer to AI for Students without replacing the existing games, 30-day Journey, guest/login persistence or Hostinger deployment.

## 1. Product decision

AI Explorer Lab will help children practice AI-era skills through short, playful missions and help parents understand **what the child practiced, what behavior appeared repeatedly, and what to try next**. It will not diagnose, calculate IQ, label personality, rank children, infer sensitive traits or guarantee a future career.

The parent-facing promise is:

> **See how your child learns, help them practice useful skills, and discover the next experiment together.**

The learner-facing promise is:

> **Play a challenge, make something real, understand your choices, and build your own Explorer Portfolio.**

### Non-negotiable boundaries

| Boundary | Implementation rule |
|---|---|
| No diagnosis | Never output ADHD, autism, dyslexia, IQ, mental-health, personality or disability claims. |
| No deterministic future | Use “possible directions to explore,” never “your child will become…” or “is suited for only…”. |
| No single-game verdict | A single activity can only produce a local observation; recurring signals require varied evidence. |
| No hidden child profiling | Do not infer emotion, home environment, socioeconomic status, religion, politics, health or other sensitive traits. |
| No public ranking | No leaderboards, sibling comparison, percentile, “top child” or social score. |
| Human agency | Child chooses where possible; AI assists; child and parent remain decision-makers. |
| Safe sharing | Parent/child preview and explicit opt-in; private by default; raw work and identity are not exposed automatically. |
| Age appropriateness | Separate experiences for 5–7, 8–10, 11–13 and 14–17. |
| Professional boundary | A concern about learning difficulty points to a qualified educator/psychologist, never a diagnosis. |

## 2. What is preserved and what is added

The existing `Home`, `GamePage`, `ProgressPage`, `JourneyPage`, guest progress, authenticated account, Hostinger OTP/OAuth fallback and current 12-game catalog remain intact. AI Explorer Lab is a new bounded vertical slice with shared design tokens and shared progress primitives, not a rewrite of existing games.

| Existing system | Reuse rule |
|---|---|
| 12 learning games | Keep as skill practice. Add optional Explorer tags only after content review. |
| 30-Day Journey | Keep the calendar/unlock model. Add selected Explorer missions as an optional track or a clearly named future arc; do not silently alter completed Journey state. |
| Guest progress | Store local observations in a versioned, expirable browser store; do not require login for the first safe demo. |
| Logged-in progress | Sync only consented child profile/progress records to the account; parent controls export and deletion. |
| `ProgressPage` | Add a separate “Explorer evidence” area; do not mix observations with quiz scores without labels. |
| Share/certificate | Reuse the share utility only for parent-approved Explorer Cards; never expose raw child work by default. |
| tRPC/Drizzle/MySQL | Use typed procedures and schema migrations; no ad-hoc REST or direct browser database access. |
| Hostinger | Keep the same Node.js Web App deployment shape, environment handoff and storage boundary. |

## 3. Developmental bands and competency model

Age is a design constraint, not an ability score. Setup asks for the child’s age band, preferred language, accessibility needs and whether a parent is present. Difficulty adapts from observed task evidence, not from an immutable ability label.

| Band | Session length | Interaction style | Skills to observe |
|---|---:|---|---|
| 5–7 | 5–8 minutes | Story, pictures, voice/choice, drag and sort, parent co-play | Sequencing, explaining a choice, trying a clue, imagination, simple reflection |
| 8–10 | 8–12 minutes | Puzzles, source clues, build/sort, explain-your-choice | Planning, pattern finding, question quality, explanation, response to hints |
| 11–13 | 12–18 minutes | Scenario labs, evidence comparison, design and strategy switches | Evidence use, trade-offs, revision, metacognition and collaboration choices |
| 14–17 | 15–25 minutes | Portfolio challenges, research, coding/workflow, interview and presentation | Problem framing, critical evaluation, ethical judgment, communication and iteration |

The common competency taxonomy is deliberately observable and non-diagnostic:

`planning`, `attention-and-working-memory`, `flexible-thinking`, `explanation`, `evidence-and-verification`, `creative-ideation`, `collaboration-and-perspective`, `persistence-and-reflection`, `functional-ai-literacy`, `ethical-ai-literacy`, `rhetorical-ai-literacy`, `learning-with-ai`.

The four AI-literacy domains follow Stanford’s functional, ethical, rhetorical and pedagogical structure, but the interface uses age-appropriate language. Every mission has one primary competency, at most two secondary competencies and one explicit learning objective.

## 4. Core loop

Every Explorer mission follows the same state machine:

`available → started → attempted → feedback-viewed → revised → evidence-submitted → completed`

A learner cannot reach `completed` by pressing a claim button. Completion requires the mission’s evidence contract. The evidence can be a written answer, selected reasoning, a drawing/photo title without uploading the image, a sorted sequence, a source choice, a revised artifact or a reflection depending on age and accessibility mode.

### Required mission parts

| Part | Requirement |
|---|---|
| Scenario | A realistic, culturally neutral situation with a clear purpose. |
| Choice/creation | At least one learner decision or created artifact. |
| Thinking prompt | “Why did you choose this?” or an equivalent child-friendly reflection. |
| Feedback | One specific explanation, hint or comparison; no generic praise only. |
| Revision | At least one chance to improve, re-order, explain or try another path. |
| Evidence contract | Machine-checkable fields specific to the mission. |
| Reflection | What was easy, surprising or worth trying next. |
| Safety copy | AI assists; the learner decides and checks important information. |

## 5. Six-mission pilot before 30-day expansion

Do not author all 30 days first. Build and test one representative mission from each arc and each age band. This creates 24 pilot variants before scaling.

| Pilot mission | Skill signal | Example output |
|---|---|---|
| Plan the Rescue | Planning and sequencing | Ordered steps plus why the first step matters |
| Find the Missing Evidence | Verification and uncertainty | Claim, missing evidence and chosen check |
| Make It Three Ways | Creative ideation | Three options and one trade-off |
| Explain It to a Friend | Communication and audience | Child-selected explanation plus audience choice |
| Strategy Switch | Flexible thinking | First strategy, changed rule and new strategy |
| Reflect and Improve | Persistence and metacognition | Before/after artifact and one next experiment |

The pilot is repeated across the four age bands with different reading load, controls, time limits and expression modes. No cross-age score comparison is allowed.

## 6. Thirty-day curriculum integration

The existing 30-day Journey becomes the habit spine. AI Explorer Lab provides a separate, optional evidence track in the first release to avoid breaking current Journey users. After pilot approval, six Explorer missions can become anchor days and the remaining days can be authored in the same contract.

| Days | Arc | Explorer outcome |
|---:|---|---|
| 1–5 | Foundations | Ask a bounded question, identify assumptions and decide what to verify. |
| 6–10 | Study systems | Recall, explain, compare and improve a study strategy. |
| 11–15 | Research and evidence | Separate claim from evidence, compare sources and express uncertainty. |
| 16–20 | Build and create | Design a small artifact and explain human choices behind it. |
| 21–25 | Code and automation | Break a workflow into steps, test failure cases and define a stop condition. |
| 26–30 | Career and life exploration | Select evidence, reflect on interests and choose next experiments. |

Unlock logic remains local-calendar-day and sequential. Evidence completion is a prerequisite for the next-day unlock. If a child misses a day, the product should show a supportive catch-up state rather than shame or permanent failure. No background cron job is required; unlock eligibility is calculated from stored timestamps/date keys.

## 7. Evidence and scoring rules

Evidence is not a quality score. It is proof that the learner engaged with the intended task. Each mission defines a typed `EvidenceContract`:

```ts
export type EvidenceContract = {
  requiredFields: Array<"artifact" | "reason" | "choice" | "reflection" | "revision">;
  minTextLength?: number;
  requiredSelections?: string[];
  rubricChecks: Array<{
    id: string;
    label: string;
    learnerVisible: boolean;
  }>;
};
```

The minimum threshold differs by age and mode. A 5-year-old should not be forced to write 40 characters; the system can accept a parent-recorded choice, a selected explanation, a drawing title or a voice-transcription alternative only after explicit consent. For 11–17, text evidence may be appropriate, but length is only an anti-empty guardrail, never a quality verdict.

### Recurring-signal rule

A signal is shown as “noticed in this activity” after one mission. It becomes a “recurring practice signal” only after at least three varied tasks across at least two days, with no major accessibility or language mismatch noted. It becomes “strength currently being developed” only after repeated evidence plus a revision/reflection event. Every signal displays sample count, contexts, date range and uncertainty.

### Adaptive difficulty

Difficulty has three bounded levels: `supported`, `standard`, `stretch`. The next mission may change level based on task evidence, but the learner can request supported mode and the report never exposes a score as intelligence. Adaptive recommendations are deterministic in version one so the behavior is auditable.

## 8. Data and architecture

### New domain vocabulary

`ExplorerProfile` represents a parent-controlled child profile. `ExplorerMission` is authored content. `ExplorerAttempt` is one play session. `ExplorerEvidence` is the minimum submitted proof. `ExplorerObservation` is a structured, task-local observation. `ExplorerSignal` is an aggregated recurring pattern. `ExplorerReport` is a generated snapshot. `ExplorerShareCard` is an explicit, redacted public/private representation.

### Proposed tables

| Table | Important fields | Privacy rule |
|---|---|---|
| `explorer_profiles` | `id`, `ownerUserId`, `displayName`, `ageBand`, `language`, `consentVersion`, `consentAt`, `createdAt`, `deletedAt` | Parent/account owner controls access; child display name is separate from legal identity. |
| `explorer_missions` | `id`, `ageBand`, `arc`, `title`, `objective`, `primarySkill`, `secondarySkills`, `contentVersion`, `reviewStatus`, `evidenceContractJson` | Only reviewed/published content is playable. |
| `explorer_attempts` | `id`, `profileId`, `missionId`, `startedAt`, `completedAt`, `attemptNumber`, `difficulty`, `language`, `accessibilityMode` | No raw behavioral stream; retain minimum event data. |
| `explorer_evidence` | `id`, `attemptId`, `artifactText`, `choiceJson`, `reflectionText`, `revisionText`, `checksJson`, `createdAt` | Encrypt/protect server-side where supported; never include raw evidence in analytics. |
| `explorer_observations` | `id`, `attemptId`, `skill`, `observationCode`, `contextJson`, `confidence`, `createdAt` | Task-local, explainable codes only; no sensitive inference. |
| `explorer_signals` | `id`, `profileId`, `skill`, `status`, `sampleCount`, `contextsJson`, `confidence`, `updatedAt` | Derived signal is visible to parent/child, editable/deletable with source data. |
| `explorer_reports` | `id`, `profileId`, `reportVersion`, `contentJson`, `createdAt`, `expiresAt` | Snapshot is regenerated after deletion/correction; no immutable hidden profile. |
| `explorer_share_cards` | `id`, `profileId`, `reportId`, `tokenHash`, `selectedFieldsJson`, `visibility`, `expiresAt`, `revokedAt` | Link-only by default, revocable, redacted and never indexed by default. |

Schema changes follow the existing workflow: update `drizzle/schema.ts`, generate migration, inspect SQL, apply through `webdev_execute_sql`, add db helpers, add tRPC procedures and then tests. No destructive migration is allowed without a backup/rollback plan.

### Guest and authenticated behavior

Guest mode stores a versioned, expirable local record with no child email and no server profile. The setup screen explains that guest observations may be lost on device clearing. Login is optional for the first play. When a parent signs in, an explicit “Save this child profile” step is required before migration. Merge is server-authoritative and deterministic: newer valid evidence wins by attempt version; duplicate attempts are not double-counted; deleted data is never reintroduced by a stale guest payload.

For under-18 profiles, do not silently create an account from a child’s email. Parent consent and account ownership must be explicit. The real legal implementation must be reviewed for India’s DPDP requirements and any other launch jurisdiction before storing child data.

## 9. Parent report and Explorer Portfolio

The report is a conversation tool, not a verdict. It contains the child’s own reflection, observed evidence, support opportunities, recommended next experiments, AI-literacy domain coverage, context/limitations and a “talk to a teacher/professional if concerned” boundary where relevant.

The portfolio is selective. The learner or parent chooses 3–5 representative artifacts, explains why each was selected and can remove any item. The system should show how each artifact maps to a skill and what feedback/revision happened. This follows portfolio assessment principles and makes sharing credible.

### Explorer Card fields

Default fields are: chosen display name or initials, age band label if explicitly enabled, mission title, skill practiced, artifact title, one child-approved reflection line, completion date and a privacy note. Never include email, exact birth date, raw evidence, school name, location, private source notes, biometric data or a predicted career.

The share flow is: `preview → redact/toggle fields → choose visibility → confirm → create revocable link`. Share options are private portfolio, family link, educator link and public card. Public sharing is off by default and never required for progress.

## 10. Feedback engine plan

### Version 1: deterministic and reviewable

Start with mission-authored rubric checks. A rule engine maps choices and evidence fields to feedback codes such as `identified_missing_evidence`, `explained_tradeoff`, `revised_after_hint` or `needs_more_specific_reason`. Each code has a human-reviewed explanation and one next step. This is safer, cheaper and more testable than allowing an LLM to infer a child’s personality.

### Version 2: constrained AI feedback

Only after the deterministic pilot is validated, add server-side LLM feedback behind a strict schema. The model receives the mission rubric and learner evidence, not unnecessary identity. It may return: `specific_observation`, `one_strength_to_practice`, `one_next_step`, `uncertainty_note` and `safety_flag`. It may not return diagnosis, IQ, personality, career certainty, sensitive inference or a free-form parent judgment.

Use output validation, length limits, content filters, prompt-injection resistance, logging without raw child content where possible, a retry/fallback to deterministic feedback and a visible “AI-generated guidance may be imperfect” disclosure. Every authored scenario and report template needs independent educator/child-development review before release.

## 11. Frontend route and component plan

Add a dedicated route such as `/explorer` for setup, age band, consent explanation and mission selection. Add `/explorer/mission/:missionId` for the playable experience and `/explorer/report` for the parent/child report. Keep `GamePage` and `/journey` separate. Add an entry card to `Home` and `ProgressPage` only after the setup copy makes the safety boundary clear.

Recommended components are `ExplorerSetup`, `AgeBandGate`, `ExplorerMissionCard`, `MissionRenderer`, `EvidenceForm`, `FeedbackPanel`, `RevisionStep`, `ObservationSummary`, `ExplorerPortfolio`, `ReportPrivacyControls` and `ShareCardPreview`. Use existing shadcn components and shared progress utilities. Keep game mechanics as plain TypeScript data/functions where possible; use Babylon.js only if a future 3D game genuinely needs it—these first six missions do not require a 3D engine.

Every screen must support keyboard operation, visible focus, readable contrast, reduced motion, touch targets, screen-reader labels, low-bandwidth loading and alternative expression modes. A child must be able to leave a mission without losing unrelated progress.

## 12. Phased implementation order

| Phase | Deliverable | Exit gate |
|---|---|---|
| 0 — Governance | Product charter, age-band copy, consent wording, prohibited-output list, reviewer roster and data map | Child-development, educator and privacy/legal reviewers accept the boundaries. |
| 1 — Content schema | Mission types, evidence contracts, rubric codes, six pilot missions × four age bands | Every mission has objective, skill tags, evidence contract, feedback and review status. |
| 2 — Deterministic engine | Mission state machine, evidence validation, feedback codes, revision loop | Empty/invalid evidence cannot complete; valid evidence produces explainable feedback. |
| 3 — Guest vertical slice | `/explorer` setup plus one mission from each arc; local persistence and deletion | Guest can play, complete, revisit, delete and restart without auth. |
| 4 — Parent profile | Consent-controlled profile, authenticated persistence, export/delete and merge | No child record is stored before consent; migration is deterministic and tested. |
| 5 — Portfolio/report | Report, selected artifacts, limitations, parent controls and Explorer Card preview | Report cites evidence contexts and uses no deterministic labels. |
| 6 — Pilot review | Real sessions across four age bands, anonymous feedback, content revisions | Reviewers sign off; observed confusion and bias issues are fixed. |
| 7 — Constrained AI | Optional server-side AI feedback with schema validation and deterministic fallback | Safety red-team, regression suite and reviewer approval pass. |
| 8 — Scale to 30 days | Remaining age-banded missions and Journey anchor integration | Content audit, accessibility, fairness and load checks pass. |
| 9 — Release | Hostinger staging deployment, domain checks, monitoring, rollback package | All technical and human launch gates pass. |

Do not skip from Phase 1 directly to 30 days. The six-mission pilot is the conflict-resolution mechanism: it validates the game format and report language before content multiplication.

## 13. Test matrix

### Automated tests

Tests must cover mission schema completeness, age-band availability, evidence contract validation, state transitions, invalid/empty evidence rejection, revision requirement, repeated-signal thresholds, date-gated progression, local-store version migration, guest deletion, authenticated merge, share-card redaction, token revocation, report wording prohibition and AI output schema validation.

### Accessibility tests

Check keyboard-only completion, focus order, labels, error announcements, contrast, reduced motion, screen-reader names, touch targets, alternative text/voice/drawing modes and mobile layout for every age band. Use source-contract tests for prohibited labels and required safety copy.

### Fairness and validity tests

Run the same mission with multiple valid strategies. Verify that language length, spelling, speed, device, assistive mode or one culturally specific assumption does not become a false weakness signal. Test answer positions and randomized choice order where choices exist. Verify no signal appears from one attempt and no cross-age ranking is possible.

### Safety tests

Attempt prompts that ask the system to diagnose, predict a career, compare siblings, expose another child’s data or reveal hidden profile information. The system must refuse/redirect to safe language. Test deletion propagation, share revocation, stale-link access, consent withdrawal and account logout.

### Human gates

Automated tests cannot establish developmental validity or pedagogical quality. Before public child access, require written review from at least one child-development professional, one educator and one privacy/legal reviewer, plus anonymous sessions in each age band. These reviewers are not optional “nice to have” items; they are launch gates.

## 14. Metrics and stop conditions

Measure learning and safety, not child surveillance. Recommended aggregate metrics are mission start-to-evidence completion, revision rate, repeat-signal sample sufficiency, learner-reported clarity/fairness, parent report usefulness, deletion/consent success, accessibility-mode completion and share-preview cancellation. Do not optimize only for streaks, session length or public shares.

Stop or rollback if: children misunderstand the task, parents interpret observations as diagnosis, a report generates deterministic career claims, one age/language/accessibility group receives systematically worse outcomes, raw child content leaks into analytics/share links, consent is ambiguous, or the AI feedback cannot fall back safely.

## 15. Deployment and rollback

Development remains in the existing `/home/ubuntu/ai-for-students` full-stack project. Static assets stay outside the project and use the deploy-safe upload workflow. Secrets are configured only through the project secret manager; no child data, API key or database URL is committed.

Before Hostinger deployment, run `pnpm check`, `pnpm test`, production build, migration verification, route smoke checks and share/delete tests. Apply schema migrations in dependency order and record the SQL. Deploy first to a staging path/domain, test parent consent, guest play, OTP, login migration, deletion, share revocation and report access, then promote. Keep the previous stable commit/checkpoint available for rollback. Never publish directly from an unverified content batch.

## 16. Go/no-go decision

**Go for discovery and pilot. Do not go directly to full child profiling or career recommendations.** The technically safest first release is a deterministic, age-banded six-mission Explorer Lab with local guest mode, parent-controlled authenticated profiles, evidence-based observations, selective portfolio artifacts and private-by-default share cards. Add the full 30-day integration only after real student sessions and independent review confirm that children understand the games and parents interpret the report correctly.

## Research basis

This plan incorporates findings from NAEYC on developmentally responsive, authentic, multi-source assessment; Harvard on age-appropriate executive-function games; UNICEF on play, choice and adult scaffolding; the National Academies on adolescent plasticity and agency; Stanford on functional, ethical, rhetorical and pedagogical AI literacy; Digital Promise and University of Iowa on authentic projects and portfolios; UNESCO and India’s DPDP Act on privacy, age appropriateness and human agency; and product patterns from Khanmigo, Duolingo and Google Learn About emphasizing guided interaction, feedback and curiosity.

## References

[1]: https://www.naeyc.org/resources/position-statements/dap/assessing-development "NAEYC: Observing, Documenting, and Assessing Children’s Development and Learning"
[2]: https://developingchild.harvard.edu/resources/handouts-tools/activities-guide-enhancing-and-practicing-executive-function-skills/ "Harvard Center on the Developing Child: Executive Function Activities Guide"
[3]: https://www.unicef.org/parenting/child-care/what-is-free-play "UNICEF: What is free play and why should you encourage it at home?"
[4]: https://www.ncbi.nlm.nih.gov/books/NBK545476/ "National Academies: Adolescent Development"
[5]: https://teachingcommons.stanford.edu/teaching-guides/artificial-intelligence-teaching-guide/understanding-ai-literacy "Stanford Teaching Commons: Understanding AI Literacy"
[6]: https://digitalpromise.org/research-map/topics/project-based-learning/ "Digital Promise: Project-Based Learning"
[7]: https://assessment.uiowa.edu/using-student-learning-portfolios-departmental-outcomes-assessment "University of Iowa: Using Student Learning Portfolios"
[8]: https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research "UNESCO: Guidance for generative AI in education and research"
[9]: https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf "MeitY: Digital Personal Data Protection Act, 2023"
[10]: https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa "FTC: Children’s Online Privacy Protection Rule"
[11]: https://www.khanmigo.ai/ "Khanmigo official product page"
[12]: https://blog.duolingo.com/duolingo-max/ "Duolingo Max product announcement"
[13]: https://learning.google.com/experiments/learn-about/signup "Google Learn About"
