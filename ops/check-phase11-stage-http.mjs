/** A staging-only, public-only HTTPS GET verification. No account actions. */
import { probePhase11Staging } from "./phase11-stage-http.mjs";
const outcome = await probePhase11Staging(process.env);
for (const item of outcome.checks) {
  console.log((item.pass ? "PASS: " : "BLOCK: ") + item.code);
}
console.log("This public-only probe does not verify JWT/OTP, private DB contents, proxy IP, browser QA or a served commit.");
if (!outcome.ok) process.exitCode = 1;
