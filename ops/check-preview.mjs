import { inspectPreviewSafety, printPreviewSafety } from "./preview-safety.mjs";

/**
 * Read-only: does not connect to MySQL, send mail or print values/secrets.
 * Pass the staging/preview environment to this command securely (not via Git).
 */
const result = inspectPreviewSafety(process.env);
console.log(printPreviewSafety(result));
if (!result.ok) process.exitCode = 1;
