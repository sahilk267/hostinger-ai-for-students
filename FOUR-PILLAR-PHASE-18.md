# Phase 18 — Accessibility and responsive smoke

**Date:** 2026-11-14. No deployment.

## Added automated checks
- Parent activity buttons are keyboard focusable and activate with Space, exposing updated aria-pressed.
- Teacher session length buttons activate with Enter and expose aria-pressed.
- Teacher topic dropdown is discoverable by its associated accessible label.
- At 390px and 1280px, the primary main container of /start, /parents, /teachers and /discovery-lab stays within the viewport.
- Existing full visual game completion, progress persistence, worksheet downloads and guide checks remain in the same Chromium suite.

## Verification boundary
- Phase 17 source and browser CI passed (43473637155 and 43473636779).
- Phase 18 CI must be checked separately before claiming success.
- These are targeted automated smoke checks, not a WCAG audit; manual screen-reader, zoom, focus visibility, contrast, touch target and real-device tests remain pending.
