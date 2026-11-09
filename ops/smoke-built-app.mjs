/**
 * Local-only build smoke test. Starts compiled Express, exercises the public
 * health check, SPA routes and default-off private flags, then stops it.
 * This script never contacts Hostinger, sends mail or opens a database.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const port = 43177;
const base = "http://127.0.0.1:" + port;
const env = {
  ...process.env,
  NODE_ENV: "production",
  PORT: String(port),
  DATABASE_URL: "",
  DATABASE_HOST: "",
  DB_HOST: "",
  MYSQL_HOST: "",
  JWT_SECRET: "CI-SMOKE-ONLY-NOT-A-PRODUCTION-SECRET",
  PUBLIC_SITE_ORIGIN: base,
  EXPLORER_CLOUD_SAVE_ENABLED: "0",
  EXPLORER_AI_FEEDBACK_ENABLED: "0",
  DISCOVERY_CHECKPOINTS_ENABLED: "0",
  HOSTINGER_MAIL_API_TOKEN: "",
  RUN_MYSQL_INTEGRATION: "0",
};
const child = spawn(process.execPath, ["dist/index.js"], {
  env, stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
child.stdout.on("data", chunk => { output += String(chunk).slice(0, 1500); });
child.stderr.on("data", chunk => { output += String(chunk).slice(0, 1500); });

async function request(path, init = {}) {
  return fetch(base + path, { ...init, signal: AbortSignal.timeout(3000) });
}
async function assert(condition, message) {
  if (!condition) throw new Error("Build smoke: " + message);
}

try {
  let healthy = false;
  for (let i = 0; i < 30; i++) {
    if (child.exitCode !== null) throw new Error("Compiled server exited before becoming healthy");
    try {
      const response = await request("/healthz");
      if (response.ok) {
        const body = await response.json();
        healthy = body.status === "ok";
        if (healthy) break;
      }
    } catch { /* still starting */ }
    await sleep(300);
  }
  await assert(healthy, "compiled Express did not become healthy");

  for (const route of ["/", "/explorer/adventure", "/guardian", "/explorer/checkpoint"]) {
    const response = await request(route);
    const html = await response.text();
    await assert(response.status === 200 && html.includes('id="root"'),
      "expected SPA fallback for " + route);
  }
  const apiPath = "/api/trpc/discoveryCheckpoint.status";
  const allowed = await request(apiPath, { headers: { Origin: base } });
  await assert(allowed.status === 200, "same-origin public tRPC query must be permitted");
  const statusBody = await allowed.text();
  await assert(statusBody.includes('"enabled":false'), "checkpoint preview must default OFF");
  await assert(allowed.headers.get("cache-control")?.includes("no-store"),
    "API responses must prevent caching of private account records");
  await assert(allowed.headers.get("x-content-type-options") === "nosniff",
    "API responses must disable MIME sniffing");
  const sharing = await request("/api/trpc/explorer.getShare?input=" +
    encodeURIComponent(JSON.stringify({ json: { token: "A".repeat(40) } })), {
      headers: { Origin: base },
    });
  await assert(sharing.status === 403, "share-token lookup must stay disabled with cloud child data OFF");
  const oversized = await request("/api/trpc/auth.logout", {
    method: "POST",
    headers: { Origin: base, "Content-Type": "application/json" },
    body: JSON.stringify({ json: { padding: "X".repeat(600 * 1024) } }),
  });
  await assert(oversized.status === 413, "oversized JSON must be rejected before the API procedure");
  const blocked = await request(apiPath, { headers: { Origin: "https://untrusted.invalid" } });
  await assert(blocked.status === 403, "cross-origin tRPC request must be blocked");
  const spoofedHost = await request(apiPath, {
    headers: { Origin: "https://untrusted.invalid", Host: "untrusted.invalid" },
  });
  await assert(spoofedHost.status === 403, "spoofed Host must not bypass configured public origin");
  const browserCrossSite = await request(apiPath, {
    headers: { "Sec-Fetch-Site": "cross-site" },
  });
  await assert(browserCrossSite.status === 403, "originless cross-site browser API request must be blocked");
  const unsafeOriginless = await request(apiPath, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
  });
  await assert(unsafeOriginless.status === 403, "originless unsafe request must be blocked without same-origin metadata");
  console.log("Compiled app smoke PASS: health, routes, no-store security headers, disabled child sharing, bounded request body, origin guard");
} catch (error) {
  // Do not expose env values or any security tokens in CI failure output.
  console.error(error instanceof Error ? error.message : "Build smoke failed");
  console.error(output.slice(-800));
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
  await Promise.race([new Promise(resolve => child.once("exit", resolve)), sleep(1500)]);
  if (child.exitCode === null) child.kill("SIGKILL");
}
