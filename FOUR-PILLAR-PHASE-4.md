# Four-Pillar Ecosystem — Phase 4: Family Check-ins & Teacher Collections
**Date:** 2026-11-12
**Branch:** main

## What this release implements

### Parent Guidance: honest family practice check-in
- New `client/src/lib/familyPracticeSummary.ts` derives observable activity counts from the existing `LearningProgress` store. No extra personal information is collected.
- Parent hub displays number of distinct games started, number of distinct games completed, recently visited games where the *latest recorded visit* falls in the past seven days, and a simple next discussion activity.
- Explicitly distinguishes lifetime game counts from last-seven-days timestamps; the underlying model has only one `lastPlayed` per game, **not a full event history or weekly completion count**.
- Local download and print/SAVE PDF options for the family check-in using the existing browser-only exporter.
- Refresh control reads the current browser's recorded practice; it is not an account-wide dashboard and cannot compare children.

### Teacher Solutions: multi-session classroom collections
- New `client/src/data/classroomCollections.ts` contains three curated, editable teaching sequences:
  1. AI Literacy Foundations (3 sessions)
  2. Privacy and Responsible AI (3 sessions)
  3. Visual Thinking and Robotics (4 sessions)
- Each session has an observable learning objective, duration, facilitator activity, existing practice link and reflection prompt.
- `/teachers` now lets educators switch collections, read individual sessions, open practice activities, and copy/download/print the full collection.
- Collections are not accredited curricula, independently reviewed education outcomes or validated learning assessments; educators must adapt them to age, accessibility and school requirements.

## Connection to the ecosystem
- Free Learning: provides guides for the teacher sessions.
- Visual Practice: supplies playable exercises.
- Parent Guidance: shows observed activity history and family discussion prompts.
- Teacher Solutions: sequences guides and games into multi-session reusable plans.
- This complements Phase 3's shared 22-game completion cards.

## Source changes
- `client/src/lib/familyPracticeSummary.ts` (new)
- `client/src/pages/ParentsPage.tsx`
- `client/src/data/classroomCollections.ts` (new)
- `client/src/pages/TeachersPage.tsx`

## Remaining priorities
- Strengthen topic→lesson matching and indexable SEO content with real task-based examples.
- Add careful lesson review workflow before claiming research-backed learning outcomes.
- Keep subscription and school accounts conditional on adult demand, data protection and pilot evidence.
- Production browser/build accessibility and PDF print behavior remain unverified. No deployment was performed.
- Search Console and revenue performance cannot be inferred from committed code.
