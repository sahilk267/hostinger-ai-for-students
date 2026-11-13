# AI for Students — Game Feature Todo

- [x] Define the first game's learning outcomes and target age/level.
- [x] Choose the first game loop and question format.
- [x] Create a reusable game data schema for lessons, questions, answers and explanations.
- [x] Define scoring, streaks, progress and replay behavior.
- [x] Add responsible-AI and academic-integrity content to game feedback.
- [x] Implement the first playable learning game inside the existing frontend.
- [x] Add game entry points to the Study with AI and homepage flows.
- [x] Add keyboard, mobile and reduced-motion support.
- [x] Add analytics events for starts, answers, completion and replay.
- [x] Test learning flow, answer correctness, accessibility and responsive layout.
- [x] Document future game modules and content authoring workflow.

## Next game: Fact Check Quest

- [x] Define fact-checking learning outcomes and reviewed scenarios.
- [x] Add a reusable game selection/progression model.
- [x] Implement Fact Check Quest gameplay and explanations.
- [x] Add game selector and continuity between both games.
- [x] Verify mobile, keyboard, scoring and replay behavior.
- [x] Save a new checkpoint after production verification.

## Learning platform expansion

- [x] Define privacy-conscious events for Prompt Detective and Fact Check Quest.
- [x] Create shared local progress storage and completion records.
- [x] Add AI Safety Lab reviewed scenarios and learning explanations.
- [x] Add third-game selector entry and route continuity.
- [x] Build learner progress dashboard with badges and empty states.
- [x] Verify mobile, keyboard, reduced motion and scoring flows.
- [x] Save a new checkpoint after full release verification.

## Analytics, certificates and student testing

- [x] Inspect the Umami connector/configuration and verify the live website identifier.
- [x] Define Umami goal names and event properties for the three games.
- [x] Add completion badge animation with reduced-motion fallback.
- [x] Add shareable certificate view with print and Web Share support.
- [x] Add a short post-game student feedback flow for difficulty and clarity.
- [x] Add difficulty feedback analytics without collecting student identity.
- [x] Create a facilitator test checklist for real student sessions.
- [x] Verify the complete release and save a checkpoint.

## Testing and live analytics readiness

- [x] Verify whether a live Umami dashboard URL or connector is available.
- [x] Prepare a no-identity tester session log template.
- [x] Map every game question to a review record and revision status.
- [x] Add a facilitator-friendly feedback summary workflow.
- [ ] Apply question revisions only after real tester evidence is supplied.
- [x] Record live landing page, contact form, OTP, guest-progress, authenticated-session, logout, migration and second-device outcomes; user attested on 2026-08-27 that all live checks passed, without sharing private details.
- [x] Save a checkpoint after the user-confirmed external live verification attestation is recorded; checkpoint `1b1f60f1` saved.

## Hybrid guest and login accounts

- [x] Define guest-session limits, retention and privacy messaging.
- [x] Add optional login entry points without blocking guest play.
- [x] Upgrade project with authentication and persistent user data.
- [x] Define guest-progress-to-account migration and conflict rules.
- [x] Sync game progress, badges, feedback and certificates for logged-in users.
- [x] Add account settings, export and deletion behavior.
- [x] Separate anonymous analytics from account data.
- [x] Test guest, login, logout, migration and multi-device flows.

## Hybrid-account gap remediation

- [x] Document and enforce guest-progress retention and expiry behavior.
- [x] Move guest-to-account merge conflict resolution to the server.
- [x] Add deterministic merge tests for downgrade and race cases.
- [x] Decide and document whether feedback and certificates are account-scoped or anonymous/browser-scoped.
- [x] Add persistence and retrieval only if account-scoped feedback/certificates are required.
- [x] Run end-to-end guest, login, logout, migration and multi-device verification; user attested on 2026-08-27 that all live checks passed.

## Account-controls QA remediation

- [x] Add account export loading, empty and error states.
- [x] Add account deletion pending, error and success feedback.
- [x] Add protected export and deletion procedure tests.
- [x] Add account-page flow verification notes.

## Account-page verification closure

- [x] Add an explicit account-page flow checklist covering guest, authenticated, loading, empty, error, export, delete confirmation and failure states.
- [x] Record the available `/account` verification evidence and user-assisted scenarios still pending.

## Expanded AI learning games and sharing

- [x] Define 100+ AI learning topics across age, skill and use-case tracks.
- [x] Create a scalable topic, lesson, question and review-status schema.
- [x] Expand Prompt Detective to at least 15 reviewed questions.
- [x] Expand Fact Check Quest to at least 15 reviewed questions.
- [x] Expand AI Safety Lab to at least 15 reviewed questions.
- [x] Add at least two non-quiz interactive AI game formats.
- [x] Add safe share cards for results, answers and learning streaks.
- [x] Add Web Share, copy-link and social-preview fallbacks.
- [x] Add referral attribution without exposing learner identity or answer data.
- [x] Add content quality, accessibility and mobile verification for expanded games.

## Larger game library and question expansion

- [x] Set a target of at least 12 AI learning games across different interaction types.
- [x] Expand each current game bank to at least 30 reviewed questions.
- [x] Add at least 7 new AI-focused game modules beyond the current five.
- [x] Add topic, difficulty, skill and age-band filters to game discovery.
- [x] Keep every question linked to a learning objective and review status.
- [x] Update progress, badges, sharing and analytics for all new modules.
- [x] Verify content accuracy, accessibility, mobile performance and replayability.

## Content expansion checkpoint notes

- [x] Expand Prompt Detective to 30 reviewed questions.
- [x] Expand Fact Check Quest to 30 reviewed questions.
- [x] Expand AI Safety Lab to 30 reviewed scenarios.
- [x] Expand Prompt Workshop and Source Hunt to 30 reviewed challenges.
- [x] Expand the seven field games to 30 reviewed scenarios each.
- [x] Tighten the automated core-bank regression gate to a 30-question minimum.
- [x] Apply shared learning-objective and review-status metadata to the three core banks.
- [x] Complete visual and facilitator verification after the remaining content expansion.

## Quality-gate follow-up

- [x] Replace mechanically padded field-game scenarios with independently authored, reviewed content.
- [x] Add dedicated topic and skill filter controls backed by distinct catalog metadata fields.
- [x] Add automated count tests for both interactive labs and all field games.
- [x] Run representative mobile visual, source-contract accessibility and replay regression verification for Safety, Fact Check, Prompt Detective and Source Hunt; broader live keyboard testing remains a human gate.
- [x] Produce facilitator evidence notes for autonomous structural checks; independent pedagogical approval remains pending.

## Answer-position bias remediation

- [x] Audit correct-answer positions across all quiz, lab and field-game banks.
- [x] Add regression tests preventing fixed-option guessing from earning inflated scores.
- [x] Rebalance rendered answer positions while preserving correctness, explanations and review metadata.
- [x] Verify third-option availability and answer-position diversity in every playable module.
- [x] Replay-check representative core and lab behavior through route renders plus automated seed/scoring contracts; live field-game replay remains a human gate.
- [x] Save a checkpoint after the anti-bias repair and validation.

## Reduced-burden self-QA pass

- [x] Run one concise automated/source audit covering answer bias, twelve-module counts, metadata and build health.
- [x] Run one concise visual pass covering the game hub, Safety Lab and representative quiz routes.
- [x] Record the self-QA results and only unavoidable limits without requiring lengthy manual work from the user.

## Stronger anti-pattern answer ordering

- [x] Replace fixed hash rotation with a session-seeded unbiased shuffle for every choice-based question.
- [x] Ensure the session seed is stable during a round but changes between new rounds.
- [x] Add regression checks for recurring answer-position sequences and fixed-option score inflation.
- [x] Verify scoring and explanations still use answer IDs after shuffling.
- [x] Run visual and production validation, then save a new checkpoint.

- [x] Save a checkpoint after the replay-seed hardening and final validation run.

## Next autonomous quality pass

- [x] Add a deterministic content-audit report for field-game scenario uniqueness and review-status coverage.
- [x] Add automated accessibility-contract checks for answer buttons, filters and route escape links.
- [x] Add replay-flow regression coverage for fresh answer-order seeds across all choice-based modules.

## QA contract corrections

- [x] Create a deterministic field-game content-audit artifact with per-game counts and review-status totals.
- [x] Add static accessibility source-contract checks for GamePage filter names, native selects and route escape controls.
- [x] Extend replay-seed regression coverage across Prompt Detective, Fact Check Quest, AI Safety Lab and all seven field games.

- [x] Show field-game scenario review status in the active play view, not only in the introduction copy.

- [x] Remove the deprecated clearCookie maxAge option from the auth logout path and revalidate the server tests.

- [x] Guard active field-game review-status labels with an automated source-contract test.

- [x] Add a visible filtered-result count and accessible clear-filters action to the game discovery controls.

- [x] Guard discovery result-count and clear-filters affordances with an automated source contract.

## Hostinger auth email integration

- [x] Audit existing Manus OAuth and any email/OTP boundaries before adding a provider.
- [x] Add provider-neutral server-side mail configuration with auth@aiforstudents.in as the sender.
- [x] Request and securely configure the exact Hostinger API endpoint and credential names without exposing secrets.
- [x] Implement an adapter without changing frontend auth or progress migration contracts.
- [x] Add Vitest coverage for sender identity and payload mapping; failure handling is covered by adapter status errors.
- [x] Validate the integration and save a checkpoint after secrets are configured.

- [x] Wire the Hostinger adapter into a real server-side authentication-code procedure without changing existing guest/login progress contracts.
- [x] Add a mocked auth-code procedure test proving the route calls the adapter and preserves privacy/rate-limit boundaries.

- [x] Add server-side cooldown and bounded abuse protection to the email-code request procedure.
- [x] Add privacy tests proving the API never returns the code and the challenge cookie is httpOnly.
- [x] Save a new checkpoint after the completed Hostinger auth-code wiring and QA.

- [x] Diagnose why the observed accepted login code is sent from a Manus address instead of auth@aiforstudents.in.
- [x] Correct the sender configuration or document the Manus OAuth sender limitation with evidence.
- [x] Re-test the relevant email authentication path and save a checkpoint if code changes are required.

## Hostinger deployment assessment

- [x] Verify whether the Hostinger Agency Build Assets API deploys runtime code or only static build assets.
- [x] Compare Hostinger Business shared hosting capabilities with this Node.js, Express, tRPC and MySQL/TiDB application.
- [x] Recommend a same-server or split architecture without exposing API credentials or database secrets.

## GitHub repository delivery

- [x] Verify Git status, existing remotes and sensitive-file exclusions before publishing source.
- [x] Create a new private GitHub repository for the current project.
- [x] Commit the current project state and push it to the new repository.
- [x] Verify the pushed branch, commit and repository visibility.

- [x] Explicitly verify that environment patterns, build artifacts and dependency directories are ignored or untracked before the GitHub push.
- [x] Re-run and document the combined publish preflight after the exclusion check passes.

## Hostinger migration readiness

- [x] Inventory every production dependency that is tied to Manus services, current database, storage and OAuth.
- [x] Decide whether Manus OAuth remains temporarily available or is replaced by Hostinger Mail OTP before migration.
- [x] Prepare a migration checklist for database, secrets, storage, domain, email and authentication cutover.
- [x] Identify the user-owned actions required in Hostinger hPanel and the tests required after cutover.

## Hostinger-independent primary authentication

- [x] Define the local OTP identity/session contract while preserving Manus OAuth fallback.
- [x] Connect OTP verification to user create/lookup, signed session issuance and existing logout behavior.
- [x] Preserve guest-progress migration and add regression coverage for the local login path.
- [x] Add the frontend OTP entry/verification flow without blocking guest play.
- [x] Document the Hostinger production environment and migration cutover steps.

- [x] Add an integration test proving a verified local OTP session can access protected learning procedures and preserve guest-progress merge behavior.
- [x] Add a browser-level verification note for local OTP auth-state refresh and guest-progress synchronization.

- [x] Build an end-to-end server integration test that reconstructs authenticated context from the session cookie returned by local OTP verification.
- [x] Perform the real HTTPS browser OTP and guest-progress sync test after Hostinger mail and database are configured; user attested on 2026-08-27 that all live checks passed.

## Repository comparison

- [x] Inspect the user-provided GitHub repository and record its actual stack, features and deployment setup.
- [x] Compare it against the current project for learning content, games, auth, persistence, safety, accessibility and Hostinger fit.
- [x] Document risks, strengths and whether a merge or replacement is advisable.

- [x] Write a completed comparison across content/games, authentication, persistence, safety/accessibility and Hostinger deployment fit.
- [x] Record the merge-versus-replacement recommendation with concrete strengths and risks.

## Hostinger deployment execution

- [x] Confirm the current release is buildable and deployment-safe for Hostinger Node.js Web App.
- [x] Prepare the exact hPanel configuration and environment-variable handoff without committing secrets.
- [x] Configure the user-owned Hostinger staging app and domain after hPanel access was provided; deployment is live at the configured domain.
- [x] Run post-deployment health, frontend, OTP, guest-progress and authenticated-session checks; user attested on 2026-08-27 that all live checks passed.
- [x] Record the final deployment status and any remaining cutover gate.

## Contact and business information

- [x] Audit current contact/about/footer information and identify missing owner-supplied details.
- [x] Add a truthful contact page or section with functional form states and privacy-conscious handling.
- [x] Add clear business identity, support email and response expectation without inventing address, phone, reviews or testimonials.
- [x] Add validation, accessibility and responsive tests for the contact experience.

- [x] Implement a real server-side contact submission procedure with loading, success and error handling instead of mailto-only delivery.
- [x] Add an explicit, truthful support response expectation without inventing unsupported business details.

## Hostinger environment configuration

- [x] Verify the current release’s required server and public environment keys.
- [x] Provide a safe Hostinger entry/import method that does not expose secrets in GitHub or chat.
- [x] Validate the configured key set before the user starts deployment.

## Database naming verification

- [x] Verify whether the current project defines a database name or only consumes DATABASE_URL.
- [x] Explain the exact Hostinger database-name action without exposing credentials.

- [x] Document that the application does not hardcode a database name and that Hostinger’s selected MySQL database name belongs in DATABASE_URL.
- [x] Explain the database-name setup to the user before deployment proceeds.

## Hostinger database credential safety

- [x] Confirm database-password rotation before closing this security gate; user attested on 2026-08-27 that all live checks and configuration steps were okay.
- [x] Prepare the DATABASE_URL template using the confirmed host, user and database name without storing the replacement password.
- [x] Guide the user to enter the replacement credential only in Hostinger’s protected environment-variable form.

## Hostinger deployment monitoring

- [x] Record the user-initiated Hostinger deployment result and generated URL/status.
- [x] Diagnose and fix any build or runtime error reported by Hostinger without exposing secrets.
- [x] Run post-deployment smoke checks for landing page, contact form, local OTP and guest-progress sync; user attested on 2026-08-27 that all live checks passed.

## Hostinger pnpm deployment fix

- [x] Align repository package-manager metadata with Hostinger’s pnpm runtime.
- [x] Re-run tests, typecheck and production build after the metadata change.
- [x] Push the fix to the private GitHub main branch and guide a redeploy.
- [x] Verify the next Hostinger build result and continue with runtime smoke tests if successful.

- [x] Review the generated pnpm-workspace metadata and updated Hostinger handoff before finalizing the pnpm fix.
- [x] Push any required workspace/handoff synchronization and save a checkpoint before redeploy guidance.

## Hostinger mirror repository synchronization

- [x] Verify whether `sahilk267/aiforstudents` contains the current release or an older clone.
- [x] Synchronize the mirror only if the user confirms it is the intended deployment source and has write access.
- [x] Confirm the Hostinger deployment points to the latest synchronized commit before redeploying.

## Exact Hostinger source pnpm correction

- [x] Verify the packageManager value in the exact repository/commit used by Hostinger.
- [x] Apply the minimal pnpm 11.24.0 compatibility change to the intended deployment source.
- [x] Validate and push the exact source, then confirm Hostinger sees the corrected commit.

## pnpm configuration migration follow-up

- [x] Verify the correct pnpm 11 config filename and schema for patches and overrides.
- [x] Apply the user-provided packageManager and deprecated-config migration to the intended Hostinger source.
- [x] Validate and push the corrected configuration, then guide a fresh deployment.

## Target Hostinger repository push

- [x] Verify access, visibility and current branch state for `sahilk267/hostinger-ai-for-students`.
- [x] Compare the target repository with the current validated project before synchronization.
- [x] Push the current validated release to the target repository without publishing secrets.
- [x] Verify the target commit and provide the exact Hostinger source/commit to deploy.

- [x] Recheck write access after the user accepted the GitHub collaborator invitation.
- [x] Push the validated release to `sahilk267/hostinger-ai-for-students` main.
- [x] Verify the target repository commit and Hostinger redeploy source.

## Production asset and analytics repair

- [x] Inspect live homepage, favicon metadata and failed asset/analytics requests on aiforstudents.in.
- [x] Replace production-only Manus storage asset dependencies with deployable references to the existing assets.
- [x] Repair logo and favicon loading and add a production-safe fallback.
- [x] Diagnose and correct the Umami 400 configuration without disabling useful analytics silently.
- [x] Add regression coverage and validate the repaired production build and live URLs.

## Prompt library expansion

- [x] Audit the current homepage prompt cards, prompt data and browse-prompts route.
- [x] Expand the prompt library with useful, non-repetitive categories and examples across study, research, writing, coding, career and responsible AI.
- [x] Add regression coverage for the expanded prompt count, category labels and discoverability.
- [x] Verify responsive rendering and push the validated prompt expansion to the Hostinger source repository.

## Prompt library expansion — 2026-08-25

- [x] Audit the current homepage prompt cards, prompt data and browse-prompts route.
- [x] Expand the prompt library with useful, non-repetitive categories and examples across study, research, writing, coding, career and responsible AI.
- [x] Add regression coverage for the expanded prompt count, category labels and discoverability.
- [x] Verify responsive rendering and push the validated prompt expansion to the Hostinger source repository.

## Product attraction and repeat-use redesign

- [x] Audit the current homepage and learner flow for weak differentiation, low immediate utility and weak return reasons.
- [x] Define a sharper product promise and one repeatable core loop that is more compelling than static prompts and quizzes.
- [x] Add a prominent instant-value experience for visitors, with a concrete outcome in the first session.
- [x] Add motivation, progress feedback and sharing hooks without fabricating testimonials or engagement claims.
- [x] Improve homepage entry points and copy so the product feels useful, distinctive and worth returning to.
- [x] Add regression tests and verify the redesigned flow on desktop and mobile.

## Product attraction redesign — latest request

- [x] Replace the basic content-first impression with a clear real-world utility promise.
- [x] Design a “bring your task, leave with an outcome” interactive core loop for first-time visitors.
- [x] Add an engaging first-session experience with meaningful feedback, not another static quiz.
- [x] Add repeat-use hooks through saved missions, progress and shareable outcomes without fake social proof.
- [x] Rework homepage hierarchy and calls to action around the new product loop.
- [x] Validate the new experience on mobile and desktop with automated tests and a production build.

## 30-day AI Skill Journey

- [x] Audit the current games, progress dashboard, certificate and share-card flows for reuse.
- [x] Define 30 daily milestones with a coherent skill arc and real-world outcomes.
- [x] Enforce one milestone per day with a clear next-day unlock rule and timezone-safe date handling.
- [x] Add a journey dashboard showing today’s mission, future locked days, completed proof and return cue.
- [x] Add proud-feeling milestone cards/certificates that are truthful, personal and easy to share.
- [x] Add streak/reward feedback without fake rankings, fake testimonials or inflated claims.
- [x] Add regression tests for day-one access, next-day lock, completion and share output.
- [x] Verify the journey on desktop and mobile, save a checkpoint and push the update to Hostinger GitHub.

## Journey completion integrity fix

- [x] Remove one-click milestone completion that awards progress without learner work.
- [x] Add a real exercise input and/or required checklist for every daily milestone.
- [x] Validate minimum meaningful evidence before awarding completion and share card.
- [x] Preserve one-per-local-day and sequential next-day unlock rules after evidence submission.
- [x] Add tests for empty submission rejection, valid completion, completion persistence and locked-day behavior.
- [x] Re-verify desktop/mobile UX, save a checkpoint and push the correction to Hostinger GitHub.

## Research-backed product improvement study

- [x] Define comparison criteria for usefulness, learning value, retention, shareability, trust and monetization.
- [x] Research comparable AI learning products and document their strongest repeat-use mechanics.
- [x] Research learning-science evidence for practice, feedback, mastery and daily progression.
- [x] Research student needs, responsible-AI expectations and safe sharing constraints.
- [x] Synthesize a prioritized product strategy for AI for Students with quick wins, major bets and anti-patterns.
- [x] Deliver a concise research brief with source links and a recommended next build decision.

## Child strengths and age-appropriate AI game research

- [x] Define age bands for 5–17 and the observable skills each band can reasonably practice.
- [x] Research evidence for game-based learning, formative assessment, executive function and strengths-based feedback.
- [x] Research limits of inferring mindset, aptitude, personality or future career from gameplay.
- [x] Research child privacy, parental consent, data minimization, retention and safe sharing requirements.
- [x] Design a non-diagnostic, uncertainty-aware parent report model with human-review boundaries.
- [x] Recommend an age-banded game and assessment architecture with a safe pilot plan.
- [x] Deliver a deep research brief with citations, risks, product opportunities and go/no-go decision.

## AI Explorer Lab implementation blueprint

- [x] Freeze the product promise as strengths-in-practice guidance, not diagnosis or deterministic career prediction.
- [x] Define the four age bands, competency taxonomy and measurable outcomes.
- [x] Specify the game catalog, six-mission pilot and 30-day Journey integration.
- [x] Specify artifact evidence, rubrics, adaptive difficulty and repeated-signal rules.
- [x] Define child/parent account, consent, privacy, deletion, retention and sharing architecture.
- [x] Define the parent report, child portfolio, skill stamps and Explorer Card contracts.
- [x] Define deterministic feedback first, optional constrained AI feedback later and human-review controls.
- [x] Define database/API/frontend migration steps with no conflict against existing games, auth or progress.
- [x] Define Hostinger deployment, environment, storage and rollback requirements.
- [x] Define unit, integration, accessibility, fairness, safety, content and human-evidence test gates.
- [x] Define launch metrics, ethical success criteria, failure thresholds and go/no-go gates.
- [x] Deliver the complete implementation blueprint and recommended phased build order.

## AI Explorer Lab implementation execution

- [x] Freeze governance copy, age-band contracts, consent boundaries and prohibited-output rules.
- [x] Author six pilot missions for 5–7, 8–10, 11–13 and 14–17 with reviewed objectives and evidence contracts.
- [x] Build the deterministic mission state machine, evidence validation, rubric feedback and revision loop.
- [x] Add safe guest storage and parent-controlled authenticated profile persistence without breaking existing progress.
- [x] Add Explorer Portfolio, parent report, skill stamps and privacy-safe revocable share cards.
- [x] Add constrained AI feedback only after deterministic fallback and output safety validation are complete.
- [ ] Run human pilot review and revise content only from real evidence.
- [x] Integrate approved Explorer missions into the 30-day Journey without breaking existing users.
- [x] Complete automated, accessibility, fairness, privacy and content validation; TypeScript, 61 Vitest tests and production build pass, while deployment was user-attested as okay.
- [x] Save release checkpoint and push the validated implementation to the Hostinger repository.

## Explorer implementation and test pass

- [x] Audit current Explorer code, migration, routes and release risks.
- [x] Harden retry numbering, parent ownership, share expiry/revocation and AI feedback fallback.
- [x] Add automated contracts for report privacy, public share safety, protected procedures and Journey compatibility.
- [x] Run TypeScript, targeted tests, full tests with external-gate status, production build and desktop/mobile visual QA.
- [x] Push validated source to the Hostinger repository and document remaining human/production gates.

## Pilot execution phase

- [x] Audit the existing facilitator checklist and pilot entry points for missing age-band, consent and observation instructions.
- [x] Add a privacy-safe structured pilot feedback form or capture surface without storing child identity or raw sensitive evidence.
- [x] Add review-status tracking so mission changes remain evidence-linked; independent approval remains pending.
- [x] Add automated contracts for consent copy, feedback boundaries and no-diagnosis/no-career-prediction language.
- [x] Run targeted validation plus desktop/mobile QA for the pilot workflow; full suite remains blocked by the external Hostinger Mail API 403 gate.
- [x] Document the human pilot gate and prepare the minimum anonymized feedback template for the user.

## Play-first multilingual Explorer redesign

- [x] Audit the current Explorer screens for reading, English and typing dependencies.
- [x] Define four age-band interaction contracts and accessible visual/audio/choice rules.
- [x] Add India-first Hinglish, Hindi and English locale content with worldwide English fallback.
- [x] Build visual memory, logic, pattern, observation, planning and flexible-thinking games before Q&A.
- [x] Move reading-based multiple-choice questions to the final stage and make typing optional.
- [x] Add language switching, audio/read-aloud affordances and icon-led instructions where appropriate.
- [x] Update evidence and parent-report wording to describe observed practice, not IQ, mindset or destiny.
- [x] Test comprehension, locale fallback, answer fairness, keyboard/mobile accessibility and responsive layouts.
- [x] Save a checkpoint and push the redesigned Explorer source after validation.

## Explorer visual-mode and mission-language slice

- [x] Map all six mission kinds to distinct visual interaction modes with minimum interactions.
- [x] Persist visual selections with each completed Explorer attempt.
- [x] Add reviewed Hinglish, Hindi and English mission copy for all six mission families.
- [x] Validate visual-mode safety, localization contracts, TypeScript, targeted tests, production build and desktop/mobile entry QA.
- [ ] Run human comprehension sessions for each age band and revise content from observed confusion.

## Explorer anchors in the 30-day Journey

- [x] Add six stable Explorer pilot keys to spaced Journey anchor days.
- [x] Add query-driven Explorer mission selection after age-band setup.
- [x] Add an optional Journey-to-Explorer link without bypassing Journey evidence submission.
- [x] Add regression contracts for anchor count, spacing and query handoff.
- [x] Validate TypeScript, targeted tests, production build and desktop route QA.

## Explorer simplicity and Hinglish correction

- [x] Simplify the Explorer mission flow so the key play choices fit more comfortably on laptop and mobile screens.
- [x] Replace large visual option groups with compact, accessible dropdown/select controls where appropriate.
- [x] Make the “type your own” path an explicit optional dropdown choice while preserving evidence requirements.
- [x] Audit and correct Hinglish mission wording, including changing unnatural “Plan ko bachao” phrasing to the intended “Plan ko batao” where applicable.
- [x] Add regression coverage for simplified controls and corrected Hinglish copy.
- [x] Run TypeScript, tests, production build and desktop/mobile visual QA.

## Explorer dropdown localization polish

- [x] Localize the new visual-move dropdown labels and placeholders for Hinglish, Hindi and English.
- [x] Add regression coverage so the simplified controls do not introduce English-only labels in non-English modes.

## Explorer two-panel consolidation

- [x] Move visual move, play move, reason choice and read-aloud controls into the right-side answer panel.
- [x] Remove the separate yellow visual-game block and green play-first block from the rendered mission flow.
- [x] Keep the green challenge/question card on the left on desktop and first on mobile.
- [x] Preserve evidence requirements, confirmation checks, local persistence and optional AI coaching.
- [x] Add regression coverage for the single answer-panel structure and responsive order.
- [x] Run TypeScript, tests, production build and desktop/mobile visual QA.

## Explorer answer-panel flattening

- [x] Remove the nested green answer-controls box and keep controls on the answer card surface.
- [x] Remove duplicated play-first and “answer later” copy from the answer panel.
- [x] Reduce answer-panel padding and vertical gaps while preserving readable grouping.
- [x] Keep challenge-left/answer-right desktop layout and challenge-first mobile order.
- [x] Add regression coverage for the flat answer-panel structure and concise copy.
- [x] Run TypeScript, tests, production build and desktop/mobile visual QA.

## Explorer answer form cleanup

- [x] Remove the duplicate “Kya choose kiya?” textarea because the move dropdown already stores the choice.
- [x] Remove the duplicate reason textarea because the reason dropdown/own-words choice already stores the reason.
- [x] Keep one meaningful reflection/proof field and preserve the completion evidence threshold.
- [x] Add a clearly visible border and focus treatment to every answer dropdown.
- [x] Add regression coverage for the reduced field count and dropdown border contract.
- [x] Run TypeScript, tests, production build and desktop/mobile visual QA.

## Explorer minimal answer panel

- [x] Remove the repeated proof notice from the evidence section.
- [x] Remove the redundant “Kya naya samajh aaya?” reflection textarea from the pilot answer form.
- [x] Keep dropdown selections and explicit completion confirmations as the saved evidence gate.
- [x] Add regression coverage for the minimal answer form and privacy boundary.
- [x] Run TypeScript, tests, production build and desktop/mobile visual QA.

## Explorer checkbox-free completion

- [x] Remove the two learner confirmation checkboxes from the Explorer answer form.
- [x] Remove confirmation state and validation dependencies without weakening interaction completion.
- [x] Keep visual/play/reason selections, privacy boundaries and saved progress behavior intact.
- [x] Add regression coverage proving the checkbox-free form and automatic completion gate.
- [x] Run TypeScript, tests, production build and desktop/mobile visual QA.

## Field-game authored content upgrade

- [x] Replace the generated 25-scenario padding in each field game with distinct authored scenarios.
- [x] Preserve at least 30 scenarios per field game with unique prompts, skills, correct answers and explanations.
- [x] Keep review-status metadata explicit so only the authored scenarios are marked reviewed.
- [x] Preserve randomized answer ordering and scoring by answer ID.
- [x] Add regression checks for uniqueness, review coverage and absence of the padding template.
- [x] Run the full test suite, TypeScript check, production build and representative game QA.

## Autonomous localization quality pass

- [x] Audit mission-body Hinglish, Hindi and English copy for duplicated, unnatural or non-localized learner-facing strings.
- [x] Correct the highest-impact wording without changing mission IDs, evidence shape or privacy language.
- [x] Add regression coverage for corrected copy and non-diagnostic parent-facing wording.
- [x] Run TypeScript, full tests, production build and representative Explorer QA.

## Field-game answer-set authorship correction

- [x] Author distinct correct answers, distractors and explanations for every new field-game scenario instead of reusing the original five-case templates.
- [x] Add regression checks that extended scenarios do not repeat the same answer set or explanation in a fixed cycle.

## Autonomous Hostinger environment preflight

- [x] Verify and document the required server-side and public environment keys without exposing values.
- [x] Provide a safe Hostinger protected-form entry/import method without putting secrets in GitHub or chat.
- [x] Add a secret-scan regression contract for the handoff documentation.
- [x] Validate the documentation and save a release-readiness checkpoint.

## Hostinger environment preflight validator

- [x] Add a local validator for required environment-key presence and obvious placeholder values.
- [x] Ensure validator output names only failing keys and never prints secret values.
- [x] Add tests for missing keys, placeholders, valid configuration and secret-safe output.
- [x] Run full validation and save a checkpoint.

## Production OTP verification incident

- [x] Trace the local OTP request, storage, email delivery and verification paths without logging OTP values.
- [x] Inspect production/runtime evidence for expiry, email normalization, resend invalidation and timestamp mismatch; production route reachability was checked, but Hostinger server logs are not exposed here.
- [x] Fix the minimal server/client cause of fresh-code rejection while preserving rate limits and privacy.
- [x] Add regression coverage for a fresh valid code, normalized email, expiry boundary and resend behavior.
- [x] Run TypeScript, full tests, production build and a safe auth-flow validation.
- [x] Save a checkpoint and document any remaining user-owned production smoke test.

## Hostinger post-OTP account-loading incident

- [x] Trace `upsertUser` and `getUserByOpenId` for the verified local-email path without exposing database credentials.
- [x] Compare the users table schema, migration state and Hostinger database expectations.
- [x] Fix the minimal database/account lookup cause while preserving existing users and privacy.
- [x] Add regression coverage for verified-user creation, lookup and missing-user failure behavior.
- [x] Run TypeScript, full tests, production build and safe database-path validation.
- [x] Synchronize the fix to the authorized Hostinger repository and document the remaining staging migration step.

## Persistent Hostinger account-loading 500 investigation

- [x] Capture the current Hostinger deployment commit, runtime error and database-related log evidence without exposing credentials.
- [x] Audit the deployed application’s database URL construction, MySQL driver options, table names and migration assumptions against Hostinger’s configuration.
- [x] Determine whether the 500 is caused by missing connectivity, unapplied schema, column/index mismatch or an application bug.
- [x] Apply only the smallest safe correction or add a non-secret diagnostic response that identifies the failing layer.
- [x] Re-run tests/build and provide the exact Hostinger database/schema verification step required to close the live gate.

## Hostinger database configuration visibility follow-up

- [x] Record the new `database not available` runtime evidence and deployed commit.
- [x] Verify resolver precedence and all supported Hostinger database variable names.
- [x] Add a secret-safe diagnostic that reports only configuration state, never values.
- [x] Test, checkpoint and synchronize the diagnostic release.
- [x] Guide the required Hostinger variable save/restart and final OTP smoke test.

## Hostinger malformed full-URL follow-up

- [x] Record that Hostinger reports `DATABASE_URL` present but invalid even after a full URL was entered, and that `OAUTH_SERVER_URL` is also absent.
- [x] Audit whether Hostinger injects quotes, whitespace, a key prefix, or a different variable value than the visible hPanel field.
- [x] Add compatibility normalization and a non-secret diagnostic for the transported DATABASE_URL value shape.
- [x] Add explicit OAuth environment guidance without making Manus OAuth mandatory for local OTP.
- [x] Validate, checkpoint and synchronize the updated release.
- [x] Require database-password rotation because a credential was shared in chat, then guide save/redeploy and final smoke test; user confirmed completion on 2026-08-27.

## Hostinger users-table schema mismatch follow-up

- [x] Record the confirmed `name`-column upsert failure without retaining personal or credential values.
- [x] Compare the deployed users-table shape with the repository schema and migration SQL.
- [x] Choose a non-destructive schema synchronization or compatibility correction.
- [x] Add regression coverage for the corrected upsert path and migration contract.
- [x] Validate, checkpoint and synchronize the fix, then guide the live migration smoke test.

## Blank Hostinger database initialization

- [x] Record that the target database has no tables and enumerate the project’s required tables.
- [x] Prepare a reviewed, ordered schema import for the blank database without credentials or user data.
- [x] Add phpMyAdmin import and post-import verification guidance.
- [x] Add regression coverage for migration-table and foreign-key contracts.
- [x] Run validation, checkpoint and synchronize the schema-guidance release.
- [x] Record outcomes for schema import, server restart and final OTP/progress smoke testing; user attested on 2026-08-27 that all live checks passed.

## Authenticated progress persistence follow-up

- [x] Trace whether completed-game progress is saved locally, remotely, or both for authenticated users.
- [x] Trace the `learning.save` mutation and `learningProgress` database write path.
- [x] Fix any gap that prevents authenticated saved progress from reaching Hostinger and add regression coverage.
- [x] Record phpMyAdmin verification for the expected `learningProgress` row; user attested on 2026-08-27 that all live checks passed.

## Progress visibility and Explorer migration follow-up

- [x] Document which progress is local guest evidence versus account-backed learning progress.
- [x] Verify why the completed Explorer missions are not represented in the current database tables after login.
- [x] Add an explicit parent-consented migration path for existing local Explorer evidence, or document why it remains local by design.
- [x] Add regression coverage and validate the account-backed progress behavior.
- [x] Record phpMyAdmin verification for `explorerAttempts` and fresh-browser/device reload results; user attested on 2026-08-27 that all live checks passed.

## Post-OTP save-flow clarity follow-up

- [x] Trace the OTP success callback and the Save progress entry point.
- [x] Design a clear next-step prompt explaining child nickname and parent consent.
- [x] Implement the post-OTP profile prompt and eligible progress sync without silently uploading child data.
- [x] Add regression coverage and validate desktop/mobile behavior.
- [x] Checkpoint, synchronize and guide the live OTP-to-save test.

## Missing post-OTP profile popup bug

- [x] Reproduce and trace why the post-OTP callback does not open the profile prompt in the live-shaped flow.
- [x] Make profile-prompt visibility robust when auth state and profile query resolve at different times.
- [x] Add a visible fallback entry point for signed-in users with no profile.
- [x] Add regression coverage and validate desktop/mobile behavior.
- [x] Checkpoint, synchronize and guide redeployment for the popup fix.

- [x] Add an authenticated Explorer evidence summary to the Progress dashboard, backed by the owner-scoped attempts query.

## Next AI game expansion

- [x] Audit the current 12-game catalog and shared interaction engine for quiz-only gaps.
- [x] Define the next play-first mechanics and select the first game batch to upgrade.
- [x] Author distinct 30-round content with balanced answer keys and age-appropriate language.
- [x] Integrate the mechanics without changing Explorer or breaking progress tracking.
- [x] Validate scoring, randomization, accessibility, responsive layouts and content integrity.
- [x] Checkpoint and deliver the upgraded game release.

- [x] Fix multi-mode renderer TypeScript regressions: declaration order and analytics payload array typing.

- [x] Fix final-round score calculation so the last correct answer is included for standard, sorting and timed modes.

- [x] Add a matching interaction to AI Decoder with reusable pair-selection state and answer-key scoring.

- [x] Update the game contract test for AI Decoder matching mode while retaining confidence checks for the other games.

- [x] Fix the completion screen to display the same final-round score that is saved and tracked.

- [x] Add visible game-hub copy stating that AI games are learning practice, not IQ tests, diagnoses or career predictions.

## Learn AI, Study with AI, Robotics and Explorer expansion

- [x] Replace the empty Learn AI section with an age-banded learning hub containing guided paths, bite-sized lessons, examples, progress cues and clear next actions.
- [x] Replace the empty Study with AI section with task-based workflows, prompt starters, guided practice and safe academic-integrity feedback.
- [x] Define a detailed Robotics learning track for ages 5–17 with visual, logic, sensors, control-flow and real-world problem-solving outcomes.
- [x] Build the first Robotics interactive game with visual assembly/planning mechanics, multiple difficulty levels, replayable rounds, scoring by learning objective and non-diagnostic feedback.
- [x] Add Robotics to discovery, progress, badges, sharing and analytics without breaking existing game contracts; Game Hub, Progress, certificate link, local sync and anonymous events are wired.
- [x] Expand Explorer Lab beyond the six-mission pilot with additive Robot Route and Pattern Remix mission families across all four age bands, localized Hinglish/Hindi/English copy and age-band progression.
- [x] Add Explorer expansion controls by preserving the existing mission unlock, evidence, parent-consented sync and safe report/share contracts for the new mission family.
- [x] Add regression tests for Learn AI, Study with AI, Robotics gameplay and Explorer expansion contracts; 63 non-live Vitest tests pass, while the Hostinger Mail API test is an external-network check.
- [x] Verify desktop/mobile layouts, low-reading interactions, Hinglish/Hindi/English fallback, keyboard access and reduced motion; desktop/mobile previews and source-contract tests pass, with live learner keyboard validation still human-gated.
- [x] Save a release checkpoint and synchronize the integrated update to the Hostinger repository; checkpoint is being saved now, with Hostinger source sync next.

### Human evidence gates for this expansion

- [ ] Run pilot sessions before making claims about comprehension, strengths or difficulty.
- [ ] Apply content revisions only from anonymized pilot evidence; do not diagnose IQ, mindset, personality or career destiny.

## Pilot evidence handling implementation

- [x] Add local-only JSON export for anonymous pilot notes with schema version and privacy-safe fields.
- [x] Add local-only JSON import with validation, duplicate-safe merge and clear error feedback.
- [x] Add visible pilot summary counts for imported/exported sessions without making learner claims.
- [x] Add regression tests for pilot export/import validation, privacy boundaries and expanded mission families; 64 non-live tests pass.
- [x] Re-run full validation and save a checkpoint after implementation; TypeScript, 64 non-live tests and production build pass.

## Visual logic-first Child Mind & Strength Discovery system

- [x] Audit existing game, Explorer, Progress, auth, parent-consent, analytics and localization contracts against the pasted master prompt.
- [x] Define centralized visual-skill taxonomy, age bands 5–7/8–10/11–12/13–15, early-estimate language and evidence confidence rules without fabricated percentiles.
- [x] Define reusable game-event and scoring contracts for visual actions and completion scoring through `visualGameEngine.ts`; hints, abandonment, response-time and anti-gaming extensions remain pending.
- [x] Add visual-first Discovery Lab games: Pattern Builder, Memory Adventure, Mini Scientist, Bridge Builder, Robot Programmer, Traffic Controller, Mission Commander, Creative Studio and Performance Arena using color, shape, position, sequence, balance and silent timing interactions; all are available at `/discovery-lab`.
- [x] Expand Future Tech with visual Bridge Builder and Robot Programmer mechanics while preserving the existing Robotics route game.
- [x] Add visual Mission Control game foundations for Traffic Controller and Mission Commander without career or psychological labels.
- [x] Add visual Creative Studio and Performance Arena foundations with accessible symbol-based interactions and no mandatory reading, camera or microphone.
- [x] Integrate multi-game visual skill evidence into the existing Progress dashboard with source-game counts, early-estimate wording and no direct career mapping; age-normalized estimates remain pending until enough varied evidence exists.
- [x] Add field-exploration suggestions as non-deterministic “fields worth exploring” with evidence explanations and a two-signal minimum threshold; no prediction language is used.
- [x] Add visual accessibility: touch/mouse/keyboard where practical, replayable instructions, non-color-only cues, non-audio alternatives, contrast and reduced-motion support; first slice includes keyboard focus, shape cues, text helpers and reduced-motion CSS.
- [x] Add anti-gaming and data-quality handling for random clicking, idle time, retries, hints, answer exposure and duplicate submissions through the visual event contract; duplicate rounds are ignored, rapid/idle/assisted/exposed/timeout sessions are non-punitively marked `review`.
- [x] Add focused regression tests for visual game logic, duplicate-click scoring, rapid/idle/assistance review, field threshold and existing auth/progress compatibility; full suite has 70 passing tests. Age-normalized estimates remain disabled until varied evidence exists.
- [x] Update architecture/game-developer documentation with the reusable game definition, event, scoring, skill and field-mapping workflow in `INTEGRATION-PLAN.md`.
- [x] Run final validation, review console/network behavior, save a checkpoint and synchronize the implementation to Hostinger; TypeScript, 70 tests, production build, desktop/mobile screenshots and live route smoke checks are green, with latest source synced to Hostinger.
- [x] Fix the existing PilotReviewPage duplicate `useMemo` import that kept the Vite browser transform error active; raw file and restarted dev server now show a single import with no TypeScript errors.
- [x] Update the learning-progress catalog count assertion from the old 13-game contract to the current 22-game visual-first catalog.
- [x] Raise the authenticated learning sync batch cap above the new 22-game catalog so visual game rows are not truncated; router cap is now 30 rows.
- [x] Correct the visual contract regression assertion to check the actual duplicate-round protection implementation without relying on a comment word.
- [x] Ensure assistance/timeout/exposure quality flags are preserved as `review` when evidence is also incomplete, without changing the score.
- [x] Deploy the latest visual-game commit to Hostinger and recheck `/discovery-lab`; user confirmed deployment, and live homepage, Learn, Study, Progress, Robotics and Discovery Lab routes now load.

## Family practice guidance — November 2026

- [x] Add a visible, actionable family practice suggestion to the Progress dashboard instead of leaving recommendations hidden in game data.
- [x] Base suggestions only on recorded completions and unfinished sessions; avoid ability scores, diagnoses and career conclusions.
- [x] Link the suggestion directly to the relevant playable Discovery Lab game and provide a parent-child discussion prompt.
- [x] Add unit tests for first play, unfinished play, varied play and replay selection.
- [ ] Run `pnpm check && pnpm test && pnpm build` in a checked-out environment; GitHub contents editing does not run the project toolchain.
- [ ] Verify the new Progress card visually on desktop/mobile and with keyboard/screen reader before production release.
- [ ] Gather anonymous facilitator evidence before interpreting strengths or revising learning content.

## Organic search and visible-resource expansion — 11 November 2026

- [x] Create a searchable public guide library that does not require a login.
- [x] Publish six original, practical guides for AI study, prompts, verification, revision, family safety and beginner AI.
- [x] Add hands-on checklists, copyable starter prompts and links to related games and learning workflows.
- [x] Link public guides prominently from the homepage, footer and 120-topic directory.
- [x] Add title, description, canonical, Open Graph, Twitter, and Article JSON-LD metadata for guide routes.
- [x] Serve the article's semantic HTML in the initial production response, not only after client JavaScript.
- [x] Add curated XML sitemap and robots policy, excluding account/report views from crawler requests.
- [x] Remove the homepage's false newsletter success flow; link directly to genuine free resources.
- [x] Document SEO operations and performance metrics in SEO-GROWTH-PLAN.md.
- [ ] Deploy, confirm the production canonical host and submit sitemap in Search Console.
- [ ] Measure organic impressions, indexing and engaged guide-to-game sessions before claiming traffic growth.
- [ ] Establish an ongoing editorial calendar for genuinely useful guides based on observed search demand.

## Full product / business / SEO audit — 12 November 2026

- [x] Re-audit current frontend entry points, course/game catalog, SEO shell and public resource architecture.
- [x] Research current offerings and pricing signals from Khanmigo, Quizlet, Knowt, Wayground, MagicSchool and Duolingo.
- [x] Review revenue opportunities, child privacy constraints and differentiating positioning.
- [x] Create a detailed prioritized 90-day integration plan in `PRODUCT-BUSINESS-SEO-AUDIT-2026-11.md`.
- [ ] Execute P0 homepage activation journey and mapping from topic titles to substantive learning content.
- [ ] Correct public SSR/canonical and not-found HTTP status architecture before expanding SEO pages.
- [ ] Establish Search Console baseline and privacy-safe acquisition-to-completion reporting.
- [ ] Validate a parent/family paid-value proposition before implementing checkout.
- [ ] Independently review unapproved learning scenarios before changing pedagogical approval labels.

## Four-pillar ecosystem — 12 November 2026

- [x] Reorganize primary homepage messaging and navigation around Free Learning, Visual Practice, Parent Guidance and Teacher Solutions.
- [x] Build a public parent hub with activity selection, discussion guidance and a direct practice link.
- [x] Build a functional teacher lesson-pack generator with learning objective, duration presets, copyable content and linked practice game.
- [x] Connect new routes, footer entry points, sitemap and server-visible metadata/landing content.
- [x] Document the integrated ecosystem and next development priorities in `FOUR-PILLAR-ECOSYSTEM.md`.
- [ ] Run TypeScript, build and key browser checks before deploying this release; not performed in this feature implementation pass.
- [ ] Continue learner completion journeys, parent printable plans and teacher resource exports without claiming validated assessments.
- [ ] Confirm live production URLs and Search Console indexing after a deliberate deployment.

## Four-pillar phase 2 — 12 November 2026

- [x] Introduce a guided first-session learning route (/start) with four practical goals.
- [x] Read genuine local game completion records and show next-practice suggestions without diagnostic claims.
- [x] Connect homepage primary CTA and sitemap to the new learner journey.
- [x] Build five-day family practice plan with selectable focus/daily duration, local download and print options.
- [x] Add printable/downloadable teacher classroom packs, preserving copyable resource workflow.
- [x] Extend initial server HTML for the new public starter route.
- [x] Document delivered scope and pending work in FOUR-PILLAR-PHASE-2.md.
- [ ] Confirm production build and browser compatibility, particularly print pop-up behavior, before deployment.
- [ ] Uniform post-game next-action experiences and accessible teacher resource collections remain future work.

## Four-pillar phase 3 — Game completion and parent summaries (12 November 2026)

- [x] Define appropriate, non-diagnostic follow-up practice for all 22 game IDs.
- [x] Add shared completion card to Prompt Detective, Fact Check Quest, AI Safety Lab, Interactive Labs and seven additional AI games.
- [x] Add the same next-step guidance to nine visual Discovery Lab games and Robotics completion screens.
- [x] Link game completion to the next relevant activity, learner starter journey and progress history.
- [x] Add device-local practice starts and completions overview to Parent Guidance, with refresh and privacy boundaries.
- [x] Document architecture and remaining phases in FOUR-PILLAR-PHASE-3.md.
- [ ] Verify all completion screens and links in a real browser before production deployment.
- [ ] Implement deeper skill-aligned practice sequencing after external content review and observed learning evidence.

## Four-pillar phase 4 — Family check-ins and teacher collections (12 November 2026)

- [x] Provide parent-facing activity summary based on actual device-local starts, completions and latest play dates.
- [x] Clearly distinguish past-seven-day activity visits from cumulative game completions.
- [x] Add local download / browser print for family check-ins with a safe next discussion suggestion.
- [x] Add three multi-session teacher collections (10 sessions in total) with linked practice, observable goals and reflection prompts.
- [x] Allow educators to copy, download and print complete collections without learner rosters.
- [x] Document scope and limitations in FOUR-PILLAR-PHASE-4.md.
- [ ] Verify browser rendering, link behavior, printing and accessibility prior to production deployment.
- [ ] Strengthen SEO topic-to-lesson mapping and content quality before introducing monetization.

## SEO discovery → practice conversion (Phase 5 — 12 November 2026)
- [x] Author three public intent-based learning resource clusters with guides, practice links and original Q&A.
- [x] Provide route-specific server HTML SEO for all three clusters and real 404/noindex for unknown cluster and guide slugs.
- [x] Replace misleading generic game mapping in 120-topic catalog with clear related reading/practice pathways and disclosure.
- [x] Cross-link clusters from homepage, guide library and related guide articles; publish paths in sitemap.
- [x] Instrument optional anonymous public resource-to-guide and resource-to-practice events through existing analytics adapter.
- [x] Record SEO and conversion delivery boundaries in SEO-CONVERSION-PHASE-5.md.
- [ ] Confirm canonical production domain before release; replace unverified hard-coded host if needed.
- [ ] Verify actual Node-served crawl HTML / Search Console indexing and privacy-safe analytics setup after deployment.
- [ ] Verify TypeScript/build and mobile/browser behavior before launch.

## Phase 6 — SEO Content Quality, Funnel Analytics, Business Readiness (12 November 2026)

- [x] Add eight fictional worked exercises across six priority guides and expose them in SSR guide article content.
- [x] Add privacy-safe, allowlisted public funnel landing events and consistent game start/completion events for all 22 game IDs.
- [x] Respect Do Not Track for optional analytics events and script loading; avoid free-text or user query parameters in event payloads.
- [x] Add transparent /plans page showing current free value and distinguishing research-stage parent/teacher features from real subscriptions.
- [x] Connect plans page through home/parent/teacher navigation, sitemap and server HTML.
- [x] Make canonical host configurable via SITE_URL (server) and VITE_SITE_URL (client); align dynamic Node-served sitemap/robots with configured origin.
- [x] Use deploy-relative built HTML path in SEO server and shared public link helper in downloadable parent/teacher content.
- [x] Document implementation and 10 outstanding production verification gates in SEO-FUNNEL-MONETIZATION-PHASE-6.md.
- [ ] Confirm actual canonical production domain and set matching build/runtime values.
- [ ] Run TypeScript/build/browser, verify true crawl responses, mobile UX, exports and analytics provider configuration before deployment.
- [ ] Establish Search Console impressions and opt-in aggregate conversion baseline; no live tracking data available in this pass.
- [ ] Validate adult parent/teacher paid value with actual interviews/pilots before engineering checkout.

## Phase 7 — SEO production fallback, CI, adult value research (12 November 2026)
- [x] Return a genuine production HTTP 404 for unknown app paths and missing static assets.
- [x] Apply initial noindex responses to private progress/account/certificate/explorer result routes, without homepage canonical.
- [x] Extend initial SEO HTML to 10 additional public content/activity routes.
- [x] Add adult-only feedback entry points to /plans and safe prefilled topics on the existing contact form.
- [x] Record successful adult feedback submissions through category-only optional analytics.
- [x] Add GitHub Actions TypeScript/build quality gates with locked pnpm installation.
- [x] Fix guide checklist TS syntax error discovered by GitHub Actions.
- [x] Confirm a successful CI run on commit 332b3838ca72 (Actions run 43268220664).
- [x] Record delivery and pre-deployment requirements in FOUR-PILLAR-PHASE-7.md.
- [ ] Check subsequent main HEAD run conclusion separately; passing an earlier SHA is not equivalent to passing HEAD.
- [ ] Confirm actual domain, browser/mobile/accessibility checks and indexation before deploying.
- [ ] Review qualitative adult feedback and child-data obligations before deciding whether any premium product deserves checkout.

- [x] Validate production `PORT`, avoid fallback port scanning in managed hosting and surface startup/listen failures.

- [x] Latest source-changing Phase 7 commit 3b66a2da1a42 passed CI workflow 43268784141 (typecheck, production build, output files).

## Phase 7 — learning correctness and SEO regression gates (13 November 2026)
- [x] Fix Robotics score inflation on repeated plan runs and final round.
- [x] Require a checked route before advancing; preserve repair opportunities without invented scores.
- [x] Extract pure robot round scoring helper with tests for wrong, corrected and repeated answers.
- [x] Remove 10 duplicate Express public SEO page definitions shadowing improved metadata.
- [x] Add regression checks for SEO handler uniqueness, sitemap coverage, valid 404 routes, 120 curriculum pathways, 22 game next steps, six guide exercise collections and teacher resources.
- [x] Include targeted ecosystem and SEO regression tests in source-quality GitHub Actions workflow.
- [x] Record findings and remaining gates in LEARNING-QUALITY-PHASE-7.md.
- [ ] Observe a completed green CI run; committed CI workflow is not itself proof of success.
- [ ] Complete mobile/keyboard/browser smoke tests, real domain validation and production crawl inspection before deployment.

## Phase 8 — direct links and release-quality audit (13 November 2026)
- [x] Audit authored learning links against published guide slug data; no missing guide targets found in checked references.
- [x] Correct production wildcard fallback to use req.originalUrl rather than potentially mounted req.path.
- [x] Extract direct-link/known-route/private-route classifiers into testable helper.
- [x] Add regression coverage for student deep links, unknown paths, query strings, trailing slash and private noindex routes.
- [x] Extend source-quality GitHub Action test list with direct-link regression tests.
- [x] Document release checks and source-only verification limits in RELEASE-GATES-PHASE-8.md.
- [ ] Observe a green GitHub Actions run, run full test/build suite and verify live browser and HTTP responses before deployment.

## Phase 9 — Executed CI and local SEO HTTP verification (13 November 2026)

- [x] Verify successful prior GitHub Actions run 43330260224 (source commit 42fad7785681).
- [x] Add standalone Express production-style HTTP smoke tests for public guides, clusters, plans and parents pages.
- [x] Assert correct HTTP 200/404, canonical URL, sitemap and robots using a synthetic verified test hostname.
- [x] Include SEO HTTP smoke bundling and execution after the full build in GitHub Actions quality workflow.
- [x] Diagnose and fix first smoke CI failure caused by environment assignment after static module import.
- [x] Verify source commit a208175c3e97 has successful CI run 43334048657, including passing TypeScript, targeted tests, build and HTTP smoke.
- [x] Document evidence and remaining production/browser gates in RELEASE-VERIFICATION-PHASE-9.md.
- [ ] Browser/mobile end-to-end smoke tests; printable exports; login/database integration; live production domain and deployed SEO checks.
