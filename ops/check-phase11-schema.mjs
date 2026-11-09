/** No writes, no credential echo; requires isolated staging declarations. */
import { inspectPhase11StagingSchema } from "./phase11-schema-read.mjs";
const result=await inspectPhase11StagingSchema(process.env);
for (const code of result.issues) console.error("BLOCK: "+code);
if(result.ok) console.log("READ_ONLY_STAGING_SCHEMA_PASS: security table columns, PKs and account cascade match.");
console.log("A pass verifies DB structure, not login UX, true hosting isolation, peer-IP topology or production approval.");
if(!result.ok) process.exitCode=1;
