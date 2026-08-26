# Play-first multilingual Explorer QA

## Completed in this slice

The Explorer setup now exposes language selection for Hinglish, Hindi and English; language choice persists locally; mission detail presents a play-first visual move choice before the written evidence area; reason chips can satisfy the first reflection without typing; read-aloud is available when browser speech synthesis supports it; and the page includes a clear optional-typing message.

## Visual checks

| View | Result | Notes |
|---|---|---|
| Desktop `/explorer` | Pass | Language bar is visible below the hero and age-band setup remains reachable. |
| Mobile `/explorer` at 390px | Pass | Language cards wrap without horizontal overflow; hero and private-by-default notice remain readable. |

## Current boundary

The interaction labels and control copy are localized, while the 24 pilot mission bodies remain authored in English with read-aloud support. Full mission-by-mission Hinglish/Hindi translation still requires careful editorial review rather than an automatic machine translation being treated as final child-facing content. The pilot and report must not be considered multilingual-complete until those translations are reviewed in each age band.

## Visual-mode and mission-translation pass

The desktop `/explorer` view keeps the private-by-default notice, locale controls and setup card readable. The 375px view preserves the heading hierarchy, privacy notice and language selector without horizontal overflow. Mission detail visual-mode cards and localized mission copy were validated by source contracts and production build; live child comprehension and audio behavior remain human review gates.

## Journey anchor integration QA

The desktop `/journey` view shows Day 1 ready with the existing one-mission-today state and the new Explorer anchor is implemented within the action card. The `/explorer?mission=plan-rescue` entry remains readable and preserves private-by-default messaging and locale controls; the pilot mission is selected after an age band is chosen. No visual overflow was observed in the captured desktop flow.

## Facilitator pilot-review route QA

The desktop `/explorer/pilot-review` view clearly presents the pilot-only purpose, local-only storage boundary and structured session form. At 375px, the hero, privacy notice and form start remain readable with no horizontal overflow; the form stacks into a single column. The route is intentionally not evidence of child ability and remains a facilitator capture tool pending real anonymized sessions.

## Explorer simplicity and Hinglish correction QA

The mission detail flow now orders the challenge/evidence layout before the play controls, so the scenario appears earlier on mobile instead of arriving after every option group. Visual choices, play choices and reasons use compact native selects with visible labels and keyboard focus. The reason select includes an explicit own-words option. The first pilot title now reads “Plan ko batao” and its task uses “Apna plan batao.” Desktop and mobile entry-route captures remain readable; TypeScript, 14 targeted Explorer/Journey tests and production build passed. Full-suite validation still has the unrelated live Hostinger Mail API Cloudflare 403 gate.

## Explorer two-panel consolidation QA

The supplied desktop and tall mobile screenshots were inspected in ordered overlapping crops. They confirmed the redundant sequence: answer card, then a separate yellow visual-game block, then a separate green play-first block. The mission markup now renders one two-column structure: green challenge card on the left and one answer card on the right; on mobile the challenge card comes first and the answer card follows. Visual move, play move, reason, read-aloud and evidence controls are consolidated inside the answer card. Desktop and mobile Explorer entry routes still render cleanly after the change. TypeScript, 14 focused Explorer/Journey tests and production build passed.

## Explorer flattened answer-panel QA

The supplied screenshots confirmed the nested green answer-controls panel was visually separate from the white answer card and duplicated the lower play section. The latest markup removes that nested colored treatment: the answer card now has one restrained answer-controls area on its own surface, with the read-aloud button in the answer header, compact selects, a short proof instruction and the evidence fields below. The challenge card remains left/first. Updated desktop and mobile Explorer entry-route previews render cleanly. TypeScript, 14 focused Explorer/Journey tests and production build passed.

## Explorer answer form cleanup QA

The duplicate choice and reason textareas were removed from the rendered evidence field list. Their values are still captured by the move and reason dropdowns and remain in the saved evidence object, while the remaining mission-specific proof fields continue to be required for completion. Dropdowns now have an explicit dark border, inset contrast and keyboard focus ring. Desktop and mobile Explorer entry previews remain clean after the change. TypeScript, 14 focused tests and production build passed.

## Explorer minimal answer-panel QA

Removed the repeated proof notice and the “Kya naya samajh aaya?” reflection textarea from the learner-facing answer form. The remaining answer flow is now limited to visual/play/reason selections, a short privacy-safe explanation, two explicit completion confirmations and the save action. The choice and reason values continue to be persisted as evidence; no typing is required to complete this pilot mission. Desktop and mobile Explorer previews render cleanly after the change. TypeScript, 14 focused tests and production build passed.
