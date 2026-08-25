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
