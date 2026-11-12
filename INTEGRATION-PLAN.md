# AI for Students — Integrated Learning Expansion Plan

## Product direction

AI for Students will become a practical learning platform with four connected surfaces: **Learn AI** for guided understanding, **Study with AI** for real academic workflows, **Robotics Lab** for visual systems thinking, and **AI Explorer Lab** for age-banded strengths-in-practice activities. The platform will guide learners toward observable practice and useful next steps; it will not diagnose IQ, personality, mindset or future careers.

### What “game” means in this product

A game is an interactive challenge with a goal, visible state, meaningful choices, feedback, replay and a clear way to improve. It is not limited to reading a question, writing an answer or selecting a quiz option. The visual-first track will use colors, shapes, positions, memory, sorting, matching, sequencing, drag/tap planning, changing conditions and safe retry loops. Text will be a short helper, not the main gate; no typing, camera or microphone is required for the first visual game slice.

The system will distinguish **play evidence** from **claims**. A Pattern Builder round can record a correct sequence choice and a retry; it cannot declare intelligence, personality or a fixed career. Reports will use “current game-based signal,” “areas to explore” and “based on current gameplay,” with confidence increasing only after varied evidence from multiple games.

## Experience architecture

| Surface | Learner promise | Primary interaction | Existing seam | Persistence |
|---|---|---|---|---|
| Learn AI | Understand one useful AI idea in a short, clear session | Choose a path, read a bite-sized card, try a micro-check, open a related game | `/topics`, `curriculumTopics.ts`, `gameCatalog.ts` | Local completion first; account sync through existing progress where applicable |
| Study with AI | Use AI without handing over the thinking | Choose a task workflow, enter a real task, copy a guided prompt, review before use | `/mission`, `MissionPage.tsx`, `AIChatBox.tsx` | Local mission history; existing account controls remain available |
| Robotics Lab | Build systems by arranging goals, sensors, rules and actions | Visual planning/assembly rounds with age and difficulty variants | `MoreAIGames.tsx`, `gameCatalog.ts`, `learningProgress.ts` | Same game progress, score, replay and guest-to-account sync contracts |
| Explorer Lab | Notice practiced strengths through varied challenges | Visual-first mission families, then optional explanation and evidence | `explorerLab.ts`, `ExplorerPage.tsx`, parent profile and consent sync | Browser-local evidence by default; explicit parent-consented sync only |

## Learn AI hub

The current topic list will become a guided hub rather than a directory. It will contain an entry-level path, age-neutral essentials, topic tracks, a “continue where you left off” cue, and cards that connect each concept to a practice game or mission. Content will be short, plain-language and supported by examples. The first release will use the existing 120-topic catalog and add richer metadata instead of duplicating content.

## Study with AI hub

The existing Mission Studio will become the core of a task-based Study with AI route. It will expose a small library of workflows grouped by **Understand**, **Practice**, **Research**, **Write**, **Create** and **Review**. Each workflow will retain the current three-step contract: describe a real task, build a starting workflow, and review before use. New workflows will reuse the existing local-only copy/share behavior and will not silently upload learner work.

## Robotics Lab game

The first Robotics game, **Robot Route Builder**, will teach systems thinking rather than robotics trivia. Each round presents a small goal such as “move the delivery bot to the charging station” or “make the greenhouse react when soil is dry.” The learner arranges visual blocks in the order **goal → sensor → condition → action → check**, then runs the plan and repairs one intentional mistake.

| Age band | Mechanics | Learning outcomes |
|---|---|---|
| 5–7 | Drag-free visual ordering with icons and 3–4 blocks | Sequence, cause/effect, observation and retry |
| 8–10 | Sensor/action matching and simple if/then choices | Rules, conditions, debugging and planning |
| 11–13 | Multi-step control-flow sorting with constraints | Decomposition, variables-as-values and testing |
| 14–17 | Trade-off rounds with energy, safety and reliability constraints | Systems design, iteration, evidence and responsible automation |

The game will use a deterministic authored bank, answer IDs rather than rendered positions, session-seeded ordering, 30 reviewed rounds, standard/advanced difficulty and a final score that matches saved progress. Feedback will describe the practiced skill and next experiment, never a capability label or career prediction.

## Explorer Lab expansion

Explorer currently provides a six-family pilot across four age bands. The expansion will keep the current mission schema and parent-controlled sync while adding new families in slices: **Robot Route**, **Pattern Remix**, **Signal Sort**, **Build a Helper**, **Plan Under Change** and **Explain a System**. Each new mission will have visual interaction first, optional reason selection, minimal typing, localized Hinglish/Hindi/English copy, evidence fields, rubric metadata and a safe fallback.

Expansion will be additive. Existing mission IDs, records, profile ownership, consent version, share expiry and report privacy will remain stable. New missions will be unlocked through age-band progression in the browser; account sync will remain an explicit parent action. Explorer reports will continue to say “observed practice signals” and “next experiments,” with uncertainty and human-review language visible.

## Shared integration contracts

The Robotics game will be added to the closed `GameId` union, seeded progress object, catalog filters, route switcher, analytics events, badges, share output and account-backed sync. Learn AI and Study with AI will link into these routes rather than create a second progress model. All local storage keys will be namespaced and all external persistence will use existing tRPC procedures.

All new interfaces will support keyboard navigation, visible focus, native controls where possible, mobile-first layouts, reduced motion and low-reading interaction cues. Any future AI feedback will remain optional and constrained behind deterministic feedback and safety checks.

## Delivery order

First, build the Learn AI and Study with AI hubs and their reusable cards. The first visual Discovery Lab slice now uses one reusable interaction shell for Pattern Builder, Memory Adventure, Mini Scientist, Bridge Builder, Robot Programmer, Traffic Controller and Mission Commander, all using the existing progress contract. Continue with Creative Studio and Performance Arena only when they can remain accessible without mandatory reading, camera or microphone. Explorer expansion remains additive and parent-consented. Finally, wire centralized skill evidence, age-normalized early estimates, field exploration language, catalog, dashboard, badges, analytics, sharing and tests, followed by desktop/mobile visual QA and Hostinger synchronization.

## Release gates

A release is ready only when the new routes have useful above-the-fold content, the Robotics game can be played without typing, Explorer expansion works for all four age bands, existing auth/progress tests remain green, answer ordering remains fair, safety copy remains non-diagnostic, and production build plus responsive screenshots pass. Human comprehension claims and content revisions remain gated on anonymized pilot evidence.

## Visual game contract (implemented foundation)

Each visual game is a catalog item plus a `GameId`, a local progress slot, a route mode, and a set of visual actions. The shared `visualGameEngine.ts` accepts session events such as start, observe, choose, retry, hint, timeout, complete and abandon. It scores only the first valid choice per round, so duplicate clicks cannot inflate a result. Every summary carries the boundary label “Based on current gameplay” and is not an IQ score, diagnosis, personality label or career prediction.

The current Discovery Lab contains nine visual worlds: Pattern Builder, Memory Adventure, Mini Scientist, Bridge Builder, Robot Programmer, Traffic Controller, Mission Commander, Creative Studio and Performance Arena. They use colors, shapes, memory tiles, balance blocks, arrows, lanes, symbols and silent rhythm patterns. Text is helper copy, not the primary interaction. Their visual signals map to the centralized taxonomy only as practice areas, and the Progress dashboard shows source-game counts plus non-diagnostic fields worth exploring after at least two matching signals.

The next safe engineering slice is to add elapsed-time context, optional hint/retry events, idle/rapid-click quality flags and tests around the engine. Those signals must affect evidence confidence rather than punish a child, and they must never be presented as a fixed ability score. Age-normalized estimates remain disabled until varied, reviewed evidence exists.


## November 2026 — visible family practice guidance

The Progress route now includes an above-the-discovery-signals section named **A small thing to try together**. It uses `getPracticeNextStep` to choose a concrete Discovery Lab game from completion/attempt data, explain why varied practice is useful, and provide a short parent-child discussion prompt. Its recommendation is an activity selection only, never a diagnostic statement. It works with existing local and account-merged progress without introducing new stored learner data or sending identifiable analytics. This slice includes four Vitest cases. TypeScript, test runner, build and browser checks remain verification gates until executed in a project-capable environment.


## 2026-11-12 — Four-pillar ecosystem implementation

The homepage, header and footer now prioritize four explicit entry paths: **Free Learning** (`/learn`), **Visual Practice** (`/discovery-lab`), **Parent Guidance** (`/parents`) and **Teacher Solutions** (`/teachers`). Existing student content, visual games, progress and responsible AI guidance remain accessible and are not duplicated. New parent-facing activity selection and teacher-facing lesson-pack builder provide immediate, actionable value without login, student data collection or unvalidated learner scores. New parent/teacher public route metadata and initial server HTML support organic discovery. Detailed coverage and remaining quality gates are in `FOUR-PILLAR-ECOSYSTEM.md`.


## 2026-11-12 — Four-pillar phase 2: learner activation and resource exports

A guided /start experience now connects lessons, four existing playable activities and their recorded local completions. Parent Guidance now generates a five-day browser-only activity schedule with selectable durations and downloadable/printable output. Teacher Solutions now exports and prints the generated classroom pack without student roster storage. The homepage CTA, sitemap and public server HTML include the learner starter route. Scope, privacy boundaries, and pending post-game completion flow are tracked in FOUR-PILLAR-PHASE-2.md.


## 2026-11-12 — Four-pillar phase 3: visible learning continuation

The platform now shares one practical next-step completion card across its core games, interactive labs, seven additional AI games, all nine Discovery Lab games and Robotics. The follow-up mapping covers all 22 game IDs, leading to a complementary game, learning path or relevant safety guide. Parent Guidance now displays local observed practice starts and completions for four family activities. See FOUR-PILLAR-PHASE-3.md for scope and limitations. These practice summaries are not validated intelligence or aptitude measures; app source is pushed but deployment and browser testing remain outstanding.

## 2026-11-12 — Four-pillar phase 4

Parent Guidance now includes a device-local family activity check-in with honest lifetime vs latest-seven-day distinctions, a recommended family conversation and optional text/print export. Teacher Solutions includes three curated multi-session AI literacy collections with observable objectives, direct game/guide links, facilitator reflection prompts, and copy/download/print actions. This is a source implementation, not a production deployment or verified educational efficacy claim. Details and limitations are in FOUR-PILLAR-PHASE-4.md.
