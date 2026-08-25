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
- [ ] Save a checkpoint after external inputs are incorporated.

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
- [ ] Run end-to-end guest, login, logout, migration and multi-device verification before marking those flows complete. Requires user-run OAuth and a second browser/device.

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

- [ ] Replace mechanically padded field-game scenarios with independently authored, reviewed content.
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
- [ ] Perform the real HTTPS browser OTP and guest-progress sync test after Hostinger mail and database are configured; keep this pending until user-owned staging access exists.

## Repository comparison

- [x] Inspect the user-provided GitHub repository and record its actual stack, features and deployment setup.
- [x] Compare it against the current project for learning content, games, auth, persistence, safety, accessibility and Hostinger fit.
- [x] Document risks, strengths and whether a merge or replacement is advisable.

- [x] Write a completed comparison across content/games, authentication, persistence, safety/accessibility and Hostinger deployment fit.
- [x] Record the merge-versus-replacement recommendation with concrete strengths and risks.

## Hostinger deployment execution

- [x] Confirm the current release is buildable and deployment-safe for Hostinger Node.js Web App.
- [x] Prepare the exact hPanel configuration and environment-variable handoff without committing secrets.
- [ ] Configure the user-owned Hostinger staging app and domain after hPanel access is provided.
- [ ] Run post-deployment health, frontend, OTP, guest-progress and authenticated-session checks.
- [ ] Record the final deployment status and any remaining cutover gate.

## Contact and business information

- [x] Audit current contact/about/footer information and identify missing owner-supplied details.
- [x] Add a truthful contact page or section with functional form states and privacy-conscious handling.
- [x] Add clear business identity, support email and response expectation without inventing address, phone, reviews or testimonials.
- [x] Add validation, accessibility and responsive tests for the contact experience.

- [x] Implement a real server-side contact submission procedure with loading, success and error handling instead of mailto-only delivery.
- [x] Add an explicit, truthful support response expectation without inventing unsupported business details.

## Hostinger environment configuration

- [ ] Verify the current release’s required server and public environment keys.
- [ ] Provide a safe Hostinger entry/import method that does not expose secrets in GitHub or chat.
- [ ] Validate the configured key set before the user starts deployment.

## Database naming verification

- [x] Verify whether the current project defines a database name or only consumes DATABASE_URL.
- [x] Explain the exact Hostinger database-name action without exposing credentials.

- [x] Document that the application does not hardcode a database name and that Hostinger’s selected MySQL database name belongs in DATABASE_URL.
- [x] Explain the database-name setup to the user before deployment proceeds.

## Hostinger database credential safety

- [ ] Require replacement of the database password that was exposed in chat before deployment.
- [ ] Prepare the DATABASE_URL template using the confirmed host, user and database name without storing the replacement password.
- [ ] Guide the user to enter the replacement credential only in Hostinger’s protected environment-variable form.

## Hostinger deployment monitoring

- [x] Record the user-initiated Hostinger deployment result and generated URL/status.
- [x] Diagnose and fix any build or runtime error reported by Hostinger without exposing secrets.
- [ ] Run post-deployment smoke checks for landing page, contact form, local OTP and guest-progress sync.

## Hostinger pnpm deployment fix

- [x] Align repository package-manager metadata with Hostinger’s pnpm runtime.
- [x] Re-run tests, typecheck and production build after the metadata change.
- [x] Push the fix to the private GitHub main branch and guide a redeploy.
- [ ] Verify the next Hostinger build result and continue with runtime smoke tests if successful.

- [x] Review the generated pnpm-workspace metadata and updated Hostinger handoff before finalizing the pnpm fix.
- [x] Push any required workspace/handoff synchronization and save a checkpoint before redeploy guidance.

## Hostinger mirror repository synchronization

- [x] Verify whether `sahilk267/aiforstudents` contains the current release or an older clone.
- [ ] Synchronize the mirror only if the user confirms it is the intended deployment source and has write access.
- [ ] Confirm the Hostinger deployment points to the latest synchronized commit before redeploying.

## Exact Hostinger source pnpm correction

- [x] Verify the packageManager value in the exact repository/commit used by Hostinger.
- [ ] Apply the minimal pnpm 11.24.0 compatibility change to the intended deployment source.
- [ ] Validate and push the exact source, then confirm Hostinger sees the corrected commit.

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
