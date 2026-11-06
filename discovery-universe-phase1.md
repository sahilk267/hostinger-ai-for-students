# Discovery Universe — Phase 1 playable pilot

## What this branch adds
- A free, original, mobile-friendly 11–13-year-old discovery adventure at \`/explorer/adventure\`.
- Three visual worlds (Logic Galaxy, Mystery Island, Creator Studio) with nine complete authored missions.
- Three reusable interaction types: ordered cards, select one, select two. No remote model calls.
- Fully authored English, Hindi and Hinglish strings for all nine missions and their explanatory feedback.
- Keyboard-friendly buttons, focus-visible states, reduced-motion support, responsive CSS illustrations.
- Local-only session outcomes, including **first attempt**, **eventually solved**, and **explicitly reported enjoyment**, with a printable private practice summary.
- New entry points on the home page and existing Explorer page. No changes to authenticated Explorer evidence or account data.

## Phase 2 usability and evidence-integrity improvements in this draft PR
- Mission options are shuffled per play session. Ordered answers are never shown correctly from top to bottom by accident.
- Nine localized optional learning hints help children recover; first-attempt correctness, **first attempt without hint**, retries and hint-assisted attempts are separately recorded.
- Browser report now distinguishes **first unassisted solutions** from **later solutions after an incorrect first try**, without presenting them as talent, aptitude or psychological measurements.
- Parent snapshot offers a next practice mission: first retry an unsolved task; otherwise try an unattempted task. The only interest suggestion is based on a learner's explicit yes/no enjoyment response, not inferred behavior.
- Local results can be deleted from the adventure interface on shared devices after confirmation.
- Four missions now have lightweight, original educational visual evidence: map, an *illustrative misleading-axis chart*, fictional social claim and unclear poster. These are examples, not real-world survey data.
- Added regression tests for randomized option order, multilingual hints, report counts, next-step selection and visual-scene presence.

**No automated test result or browser QA is asserted by this document.** Re-run `pnpm check`, `pnpm test`, `pnpm build`, accessibility QA and educator review after every change.

## Phase 3 — age-specific learning adventures (this PR)
- Added a three-way **age-band selector**: 8–10 Junior Adventurers, 11–13 Skill Detectives (existing pilot preserved), 14–17 Future Builders.
- A new authored catalog supplies **18 genuinely different missions** (9 per new age band), resulting in 27 bilingual/trilingual pilot missions overall: three reusable worlds × three scenarios per age band.
- Junior tasks use concrete robots, patterns, school notices and inclusive playground choices; teen tasks use project dependencies, evidence quality, causal reasoning, survey bias, accessibility and human review of AI outputs.
- All new missions have authored English, Hindi and Hinglish text, feedback and optional hints; no runtime LLM is used.
- The same engine supports ordered cards, one-choice and two-choice problems with shuffled option layouts.
- Ages have **different world descriptions and visual treatments**, plus new authored CSS evidence scenes: watering robot, pattern trail, missing-source notice, survey sampling, accessible app and correlation comparison.
- Practice records persist only on this browser, keyed by unique mission ID. **Only the selected age band's missions enter its snapshot or next-practice suggestions.** Never compare scores across ages or use this demo as a validated aptitude/career predictor.
- The age choice is a broad preference, not a date of birth, and does not create a child profile.
- Original 5–7 and 14–17 age-band Explorer missions remain at `/explorer`. **A dedicated 5–7 audio-first adventure remains future work** and is not implied by this PR.
- The original free 11–13 demo continues to use its nine original mission IDs, preserving existing browser-local progress.

### Phase 3 acceptance checklist
1. Confirm all **27 mission contracts**, correct localized strings, age selection and age-isolated reports in CI.
2. Test real phone layouts at 320–400px, Hindi line wrapping and focus visibility.
3. Confirm answers from one age band do not appear in any other age band's parent summary.
4. Test changing age band during report review, after returning to the map and after refresh.
5. Educational and language reviewers should verify age appropriateness and factual validity.
6. Do not treat the nine scenarios per band as a norm-referenced or diagnostic test; no career, IQ or fixed talent claims.
7. Keep actual parent accounts, payment collection and verified completion certificates disabled until legal, security and content review.

## Phase 4 — private parent reporting and local completion evidence
- Added `discoveryReport.ts`: age-scoped, deterministic report aggregation with per-task evidence states: **not started**, **attempted but unsolved**, **first try without hint**, **first try with hint**, and **solved after an earlier incorrect attempt**.
- New reusable `DiscoveryParentReport` view, translated to English, Hindi and Hinglish, showing attempted/solved totals, independent first-try practice, revised solutions, hint-assisted submissions and *explicitly reported* enjoyment. Each world's missions are listed with practice status and practice-area tags.
- Three age-appropriate **family conversation prompts**, one per world, support a parent's conversation with the learner without asserting an innate strength or future career prediction.
- Printable age-specific report uses browser-only data; no names, DOB, account, child profile or remote database synchronization are involved.
- **Demo practice milestone** unlocks only when **all 9 age-band missions were actually solved at least once**, not when nine cards were opened or attempted. The date, if valid, comes from local browser metadata.
- **Not a verified or accredited certificate**. The scoring rules and local browser records can be read or modified by users, so authoritative identity checks and server-verified awards would be misleading. A future official verification endpoint requires secure guardian-managed accounts, proper consent/legal review, protected server-side assessment integrity, versioned criteria, audit logs and revocation capability.
- New automated tests cover completion eligibility, invalid timestamps, cross-age isolation, distinctions between independent/hinted/revised results and the no-remote-call contract.
- **QA still required**: print-to-PDF on mobile, 320px layout, Hindi/Hinglish educational review, accessibility including screen readers, guardian review and shared-device reset behavior.

## Student and parent value
The learner must actively decide, order or compare, then receives an explanation and the option to retry. The summary records **only observed performance in these nine practice tasks**. A self-report of enjoyment is not inferred from clicks or playtime.

It must not be marketed as a psychometric assessment, validated aptitude test, intelligence estimate, permanent skill label, or future-career predictor. The demo badge is not an accredited certificate. Young learners should use the site with appropriate parent/guardian supervision.

## Privacy and hosting cost
This pilot collects no name, email, school, exact age, location, uploaded photo, payment or identity. Attempt summaries stay under \`aifs-discovery-adventure-v1\` in browser localStorage. They are **not synced** to the original Explorer account data. Clearing browser storage deletes them. No additional APIs, SaaS subscriptions, server sessions, WebSocket workers, Redis or database tables are required to play.

## Suggested pilot test before monetizing
1. Run \`pnpm install\`, \`pnpm check\`, \`pnpm test\` and \`pnpm build\`. These have **not been executed in this branch's authoring environment**.
2. Visit \`/explorer/adventure\` on real mobile devices, and verify all three languages and all nine missions.
3. Check keyboard-only play, screen-reader semantics, long Hindi text wrapping, low-end Android performance and reduced-motion setting.
4. Verify that answers are not sent to the server; test private browsing / disabled localStorage fallback.
5. Recruit a small group of families with appropriate parent involvement and independent educational reviewers; assess clarity, enjoyment and whether report claims are grounded.
6. Do **not** sell a program or promise certificates until the complete paid deliverables, refund process, data protection and assessments are reviewed.

## Next implementation slices, not part of this PR
**Phase 2 — assessment quality:** diversify scenarios per construct; age-appropriate task validation; separate observed performance from interest; fair comparisons across languages; independent educator review; meaningful equivalent follow-up tasks. Report low evidence honestly, without invalid personality/career inference.

**Phase 3 — full age bands and accessible content:** reuse existing Explorer age-band definitions (5–7, 8–10, 11–13, 14–17) and add 18+ only after demand. Each needs genuinely different reading level, mechanics, session length and testing, not simply easier labels. Expand from three into six worlds only as content quality permits. Audio narration, translated content QA and accessible alternative interactions should accompany younger bands.

**Phase 4 — parent accounts and verified completion:** consent/verification requirements reviewed for children's data; minimal server-side evidence, guardian-controlled export/deletion, rate-limited sync, age-appropriate feedback, versioned assessment records, authenticated completion certificate with a privacy-safe verification endpoint. Never expose child learning evidence publicly.

**Phase 5 — paid discovery program:** 30-day reviewed curriculum and private parent report; only after demand validation add direct business UPI payments, claimed UTR records, time-bounded manual review, Telegram **admin-only** webhook approval, idempotent entitlements and refunds/disputes workflow. Payment requests are never proof of payment; verify actual credited bank/UPI transaction before approval. Keep 72-hour pending reviews visible rather than auto-rejecting paid customers. No payment code or gateway is included in this pilot.

**Phase 6 — growth:** demand-led language packs, age cohorts, premium follow-up journeys, truthful retention metrics, static asset optimization and indexed MySQL queries. Upgrade Hostinger hosting only after measurement indicates a real bottleneck.

## Business experiment gates
- **Engagement:** do first-time users complete the free adventure and voluntarily attempt another world?
- **Educational usefulness:** can children explain what they learned, and do parents understand the report as a bounded observation?
- **Real demand:** do independent parents express willingness to pay for an actual reviewed, delivered 30-day program?
- **Trust:** no misleading claims, privacy leakage or payment pressure directed at minors.

The objective is to establish meaningful value before adding subscription complexity or paid infrastructure.
