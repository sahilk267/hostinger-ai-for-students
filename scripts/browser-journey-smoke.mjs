/** Browser smoke against built Vite preview; no backend/OAuth/database required.
 * Isolated Playwright install: /tmp/aifs-browser-smoke/node_modules.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const require = createRequire("/tmp/aifs-browser-smoke/package.json");
const { chromium } = require("playwright");
const base = process.env.BROWSER_BASE_URL || "http://127.0.0.1:4173";
const evidence = "/tmp/aifs-browser-smoke/screenshots";
await mkdir(evidence, { recursive: true });
let ready = false;
for (let attempt = 0; attempt < 40; attempt++) {
  try { const response = await fetch(base + "/"); if (response.ok) { ready = true; break; } }
  catch { /* Preview still starting. */ }
  await new Promise(resolve => setTimeout(resolve, 500));
}
assert(ready, "Vite preview did not become ready");
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{width: 390, height: 844}, {width: 1280, height: 800}]) {
    const context = await browser.newContext({ viewport, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const visit = async (path, heading) => {
      await page.goto(base + path, { waitUntil: "domcontentloaded" });
      await page.getByRole("heading", { name: heading }).first().waitFor();
    };
    try {
      await visit("/start", "What would you like to explore?");
      await page.getByRole("button", { name: /Make a small prediction/ }).click();
      await page.getByText("Make a small prediction", { exact: true }).first().waitFor();

      // Complete a real five-round visual game and verify device-local persistence.
      await visit("/discovery-lab?game=pattern-builder", "Think with your eyes.");
      await page.getByRole("button", { name: "Start visual challenge" }).click();
      for (let round = 1; round <= 5; round++) {
        await page.locator(".visual-board-top").getByText("ROUND " + round + " / 5").waitFor();
        await page.locator(".visual-challenge .visual-tile").first().click();
        if (round < 5) await page.locator(".visual-board-top").getByText("ROUND " + (round + 1) + " / 5").waitFor();
      }
      await page.getByRole("heading", { name: "Challenge complete" }).waitFor();
      const persisted = await page.evaluate(() => {
        const raw = localStorage.getItem("ai-students-learning-progress");
        return raw ? JSON.parse(raw)["pattern-builder"] : null;
      });
      assert(persisted, "Pattern Builder progress missing from localStorage");
      assert.equal(persisted.attempts, 1, "Expected exactly one started session");
      assert.equal(persisted.completions, 1, "Expected exactly one completed session");
      await page.reload({ waitUntil: "domcontentloaded" });
      const afterReload = await page.evaluate(() => {
        const raw = localStorage.getItem("ai-students-learning-progress");
        return raw ? JSON.parse(raw)["pattern-builder"] : null;
      });
      assert.equal(afterReload?.completions, 1, "Completion must survive a reload");
      await visit("/start", "What would you like to explore?");
      await page.getByRole("button", { name: /Think with patterns/ }).click();
      await page.getByText("COMPLETED ON THIS DEVICE").waitFor();

      await visit("/teachers", "Generate an activity pack");
      await page.getByRole("heading", { name: "End the lesson with an exit ticket" }).waitFor();
      await page.locator("#teacher-topic").selectOption("robotics");
      await page.getByText("Which step did you revise after testing?").first().waitFor();
      const teacherDownload = page.waitForEvent("download");
      await page.getByRole("button", { name: "Download worksheet" }).click();
      const teacherFile = await teacherDownload;
      assert.match(teacherFile.suggestedFilename(), /exit-ticket-robotics\.txt$/);

      await visit("/parents", "Choose an activity for today");
      await page.getByRole("heading", { name: "Talk about what you learned" }).waitFor();
      await page.getByRole("button", { name: "Plan a robot route" }).click();
      await page.getByText("Which step did we change after testing?").first().waitFor();
      const parentDownload = page.waitForEvent("download");
      await page.getByRole("button", { name: "Download worksheet" }).click();
      assert.match((await parentDownload).suggestedFilename(), /family-reflection-2\.txt$/);

      await visit("/guides/how-to-check-ai-answers", "How to Fact-Check AI Answers and Spot Hallucinations");
      await page.getByRole("heading", { name: "Worked examples and practice" }).waitFor();
      assert.equal(errors.length, 0, "Browser runtime errors: " + errors.join(" | "));
      console.log("PASS browser journeys at " + viewport.width + "px: start, game completion and persistence, teacher export, parent export, guide");
    } catch (error) {
      await page.screenshot({ path: evidence + "/failure-" + viewport.width + ".png", fullPage: true }).catch(() => {});
      throw error;
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
