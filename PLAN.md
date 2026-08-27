# Prompt Detective — Learning Game Plan

## Game concept

Prompt Detective is a short, replayable learning game inside AI for Students. The player reads a goal and chooses the strongest prompt from three options. After each choice, the game explains why the answer is effective or weak. The game teaches prompt clarity, context, constraints, verification and responsible AI use.

## Learning outcomes

By the end of a round, the player should be able to identify a prompt with a clear goal, useful context, explicit output format and a verification step. The player should also recognize common mistakes such as vague requests, asking AI to do assessed work entirely, and trusting an answer without checking it.

## MVP game loop

1. Player selects a lesson: Clear Goals, Better Context or Verify the Answer.
2. A scenario card presents a realistic student task.
3. Three prompt choices appear.
4. Player chooses one answer.
5. The game reveals correctness, score and an explanation.
6. Player continues through five questions.
7. A result card shows score, concepts learned and a next study action.

## Risk slices

| Risk | Slice | Verification |
|---|---|---|
| Question correctness | Use a fixed, reviewed question bank | Unit-check answer keys and manually review every explanation |
| Learning value | Explain why each option succeeds or fails | Every answer includes one actionable lesson |
| Replayability | Randomize question order without changing correctness | Same five-question session remains deterministic under `?demo` |
| Mobile interaction | Large answer cards and no hover dependency | Test at 390px viewport and keyboard navigation |
| Accessibility | Semantic buttons, focus states and live feedback | Navigate a full round using keyboard only |
| Progress state | Persist best score locally without accounts | Reload preserves best score and reset works |
| Brand fit | Use desk-note, index and saffron signal motifs | Screenshot visibly matches Study Desk Editorial system |

## Out of scope for MVP

Real-time AI calls, multiplayer, leaderboards, avatars, accounts, payments and user-generated questions.

## Definition of done

The game is complete when a player can start a lesson from the platform, finish five reviewed questions, receive an explanation for every answer, see a score and next action, replay the lesson, and use the entire flow on mobile and keyboard without runtime errors.


# Next AI game expansion

## Goal
Upgrade the seven additional AI field games from answer-only rounds into varied, play-first practice while preserving the existing 30-round content, balanced answer ordering, progress IDs and Explorer privacy boundaries.

## First release slice

1. **Bias Buster**: classify a representation or evaluation signal, then reveal an inspectable explanation.
2. **Data Detective**: inspect a visual/data clue before choosing the strongest interpretation.
3. **Decision Studio**: choose the human-boundary action and confirm the risk level.
4. Keep Creative Director, Code Coach, Tool Matchmaker and AI Decoder on the shared renderer until the first slice is validated.

## Risk slices and acceptance criteria

- The shared renderer must continue to render all 30 reviewed scenarios per game.
- Answer IDs, not display positions, determine correctness; each session uses a fresh seed.
- Every interaction must be keyboard reachable, readable in the available language surfaces, and usable on mobile.
- No game may imply IQ, diagnosis, personality labels or career prediction.
- Existing `GameId` values and `learningProgress` writes remain unchanged.

## Verification

Run TypeScript, the non-live Vitest suite, production build, and representative desktop/mobile preview checks for the upgraded games.
