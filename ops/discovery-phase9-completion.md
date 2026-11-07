# Phase 9 — 12-task completion showcase and parent improvement plan

This feature is implemented on the existing Draft PR #1, not a verified or accredited certificate.

## Learner journey

1. Open /explorer/adventure; choose ages 8–10, 11–13 or 14–17 and English, Hindi or Hinglish.
2. Solve all nine age-specific practice missions. Hints, retries and first-independent attempts are recorded separately.
3. The Thinking Challenge then unlocks: three new scenarios per age group, each requiring BOTH a practical decision and the evidence-based reason. No hints. First try and later success remain distinct.
4. All nine practice missions plus all three fresh challenges correctly solved unlock the printable private Learning Milestone.
5. Parents get age-specific mission outcomes, world-by-world observations, suggested next practice, three actionable 10-minute home activities and discussion prompts.
6. Delete all local practice clears the nine practice results and three transfer results across age groups on this browser.

## Scope & privacy

- New features run locally in React; no paid LLM API, third-party account provider, MySQL migration or identity collection needed.
- The page intentionally does NOT assign a child's name, certificate serial number, QR verification link, institution accreditation, field-fit ranking or career forecast.
- Browser-local progress and client-side assessment answer keys are user-editable: this is NEVER tamper-resistant evidence of identity or an accredited qualification.
- The completion showcase states these limitations in all three languages. No user-facing claim of officially verified certification is warranted.
- Previously introduced data-collection features remain disabled unless separately approved and configured: EXPLORER_CLOUD_SAVE_ENABLED=0, EXPLORER_AI_FEEDBACK_ENABLED=0, DISCOVERY_CHECKPOINTS_ENABLED=0.

## Manual release acceptance checklist

- [ ] 9/9 practice solved but 2/3 transfer solved → milestone locked.
- [ ] 9/9 and 3/3 → printable milestone opens, with correct age band and counts.
- [ ] Wrong action OR wrong reason → retry. First incorrect then correct → improvement, not first-try.
- [ ] New scenario and reason texts are correct in all three languages and all three age groups.
- [ ] Parent report includes evidence-bounded, 10-minute home activities, not a claimed ability diagnosis.
- [ ] Switching age bands cannot show another band's transfer score as current.
- [ ] Clearing local practice then refreshing clears BOTH storage keys.
- [ ] Test keyboard-only navigation, mobile 320px, Hindi wrapping, print-to-PDF and screen-reader focus.
- [ ] Validate actual served Hostinger commit, environment, browser errors and configured domain after any auto-deployment.
- [ ] TypeScript, unit tests, production build, compiled-app smoke and separate MySQL security CI pass.

## Pending beyond Phase 9

Independent guardian/learner identity verification, real server-verified revocable certificates, legal consent and real-user educational validity studies are not completed by this browser-only release. Commercial payment flow remains separate. PR remains Draft pending live browser and educational QA.

If Hostinger auto-deploys this feature branch, pushing the commit may start that configured workflow. Verify the actual Hostinger preview/live version separately: CI tests are not browser QA.
