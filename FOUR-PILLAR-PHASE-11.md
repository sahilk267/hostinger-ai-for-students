# Phase 11 — Visible, Privacy-Safe Guide-to-Practice Decision Checks
**Date:** 2026-11-13
**Repository:** sahilk267/hostinger-ai-for-students, main
**Scope:** Source and editorial material only. No deployment or payment activation.

## Why this phase
Six published SEO guides already had steps, worked exercises and a checklist, but learners had no immediate answer-feedback interaction before entering a game. That left the guide-to-practice transition passive.

## Delivered in source
- Every one of the six public how-to guides now has an authored fictional one-minute decision with three distinct responses and specific actionable feedback, including for incorrect choices.
- Learners can retry without score, time limit, account or personal input. A relevant activity link appears after the useful decision; the existing game link remains accessible to everyone.
- The public guides index explicitly tells visitors about the new interaction.
- Production Node HTML includes the decision question, options and learning note for no-JS crawler/fallback visibility; React adds the interactive behavior.
- The optional aggregate analytics event guide_skill_check_completed includes only a known guide slug, not the chosen response, free text or personal/child data. It fires at most once per guide page visit after a useful choice. A click to the activity uses the existing guide_practice_click convention.
- Regression checks validate exactly one correct choice, three unique options, substantial explanations and valid bounds across all published guides. GitHub Actions is configured to run these checks.

## Acceptance evidence and release caveats
- **Source:** GitHub commit and changed-file review confirm authored content and wiring.
- **Automation (verified):** GitHub Actions run [43416149358](https://github.com/sahilk267/hostinger-ai-for-students/actions/runs/43416149358) completed successfully for source commit [3ae36c0](https://github.com/sahilk267/hostinger-ai-for-students/commit/3ae36c0a786babe54e8c5a0dbc57bf95e49040a4). All job steps passed: dependency installation, TypeScript, included learning and guide check tests, Vite/Node production build, server SEO bundle, HTTP smoke test and expected build artifacts. This does not verify browser UX, real traffic or indexing.
- **Manual pending:** Test narrow mobile widths, zoom, keyboard / focus order, screen reader announcement, blocked storage, optional analytics and the real guide-to-game path in a deployed browser.
- **SEO pending:** Confirm deployed Node response includes one canonical per guide, configured real host, crawlable text and Search Console coverage.
- **Business pending:** No adult subscription feature, paid plan, checkout, demographic profiling or private student answer tracking was introduced.

## Next priority
Pilot the guide check with a learner and a parent/teacher, fix confused explanations from observed anonymous feedback, then verify the deployed funnel (guide visits → completed decision → game starts → game completions). Do not represent these as learner outcome scores or a validated assessment.
