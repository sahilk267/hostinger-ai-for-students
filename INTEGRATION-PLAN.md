# AI for Students — Integrated Learning Expansion Plan

## Product direction

AI for Students will become a practical learning platform with four connected surfaces: **Learn AI** for guided understanding, **Study with AI** for real academic workflows, **Robotics Lab** for visual systems thinking, and **AI Explorer Lab** for age-banded strengths-in-practice activities. The platform will guide learners toward observable practice and useful next steps; it will not diagnose IQ, personality, mindset or future careers.

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

First, build the Learn AI and Study with AI hubs and their reusable cards. Next, implement Robot Route Builder using the shared game renderer and progress contract. Then add the first Explorer expansion slice with two new mission families. Finally, wire catalog, journey, dashboard, badges, analytics, sharing and tests, followed by desktop/mobile visual QA and Hostinger synchronization.

## Release gates

A release is ready only when the new routes have useful above-the-fold content, the Robotics game can be played without typing, Explorer expansion works for all four age bands, existing auth/progress tests remain green, answer ordering remains fair, safety copy remains non-diagnostic, and production build plus responsive screenshots pass. Human comprehension claims and content revisions remain gated on anonymized pilot evidence.
