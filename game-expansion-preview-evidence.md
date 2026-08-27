# Game expansion preview evidence

The sandbox preview is running project version f29a4861. On Bias Buster, the initial round renders a `STEP 1 / INSPECT` card with `Reveal the clue`; answer choices are absent until that button is clicked. After clicking it, three randomized answer buttons appear and the `Next case` control remains visible. The preview is authenticated as a test session, but no personal data was submitted. Desktop and mobile full-page screenshots also show the catalog and start card without overflow.

Creative Director also starts as a 30-case field game. After selecting an answer, the preview shows answer feedback followed by `STEP 2 / CHECK YOUR CONFIDENCE` with three keyboard-accessible choices: Not sure yet, Somewhat sure and Very sure. The `Next case` control remains gated until a confidence choice is made.

Data Detective verification: after Start the field game, the round initially shows STEP 1 / INSPECT and no answer choices. After Reveal the clue, STEP 2 / BUILD THE ORDER appears with three answer options and a disabled Lock my order button. Selecting an option marks it with position 1 and keeps unselected options available. This confirms the interaction is not answer-only.

The updated mobile entry cards for Data Detective, Tool Matchmaker and Creative Director render without horizontal overflow. Data Detective was launched in the sandbox: answers remain hidden behind Reveal the clue, then the sorting board shows three choices and Lock my order. Selecting the correct move marks it as position 1 and leaves the other options available. Tool Matchmaker entry renders correctly in desktop preview; direct browser interaction timed out twice, so no claim is made about its live countdown interaction beyond the passing type/tests/build contracts.
