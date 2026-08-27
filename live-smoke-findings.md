# Live smoke findings

Date: 2026-08-27

The deployed homepage at `https://aiforstudents.in/` loaded successfully with the branded navigation, Learn AI, Study with AI, 30-Day Journey, Explorer Lab, Prompts, Tools, Career and Progress entry points.

After Hostinger deployment, `https://aiforstudents.in/discovery-lab` loaded successfully instead of returning 404. The page displayed the visual-first selector with nine worlds: Pattern Builder, Memory Adventure, Mini Scientist, Bridge Builder, Robot Programmer, Traffic Controller, Mission Commander, Creative Studio and Performance Arena. It also displayed the non-diagnostic practice-only boundary and the “No long reading. No typing.” copy. No login or form submission was performed during this inspection.

The live `/play` route loaded the existing Prompt Detective/Game Hub experience; its extracted content began with “PROMPT DETECTIVE / FIELD GAME 01” and “Thirty cases. Three choices.” The guessed `/games` route returned the expected 404 because the local router defines Game Hub at `/play`, not `/games`. No user data was submitted.

The live `/learn` route loaded a content-rich hub with 9 lessons, including robot planning, visual pattern, memory and science lessons. It reported 0 of 9 lessons tried and exposed low-reading “Play first” activities.

The live `/study` route loaded a task-based workflow with Describe, Practise and Review steps, a Mission Studio link and a Practise in a game link. No login, form submission or personal data was used.

The live `/progress` route loaded a clear guest-safe dashboard showing 0/22 games complete, local-device progress language, a Discovery Lab practice-signals section and a link to open Discovery Lab. It did not require login for this passive inspection.

The live `/robotics` route loaded the Robot Route Builder with 8 rounds, 4 age bands, visual-first copy and “No typing needed.” It presented the goal/sensor/rule/action/check planning concept without a blank or 404 state. No gameplay submission was performed.
