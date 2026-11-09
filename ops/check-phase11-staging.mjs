/** Staging-only, read-only, no-secret operational check. */
import { evaluatePhase11Staging } from "./phase11-staging-gate.mjs";
const result = evaluatePhase11Staging(process.env);
for (const issue of result.issues) console.error("BLOCK: " + issue);
if (result.ok) console.log("STATIC_CONFIG_PASS: Phase 11 staging settings satisfy declared policy.");
console.log("This does NOT verify staging isolation, successful MySQL import, real client IP, live server, or browser QA.");
if (!result.ok) process.exitCode = 1;
