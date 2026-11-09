/**
 * Isolated staging acceptance probe. It sends ONLY unauthenticated GETs to
 * known public routes. Never sends mail, credentials, mutations or student data.
 * It checks real HTTP behavior, not the deployed Git commit, DB schema or users.
 */
const parsedOrigin = value => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) return null;
    return url.origin;
  } catch { return null; }
};

export function validateStagingHttpTarget(env) {
  const issues = [];
  if (env.DEPLOY_TARGET !== "staging") issues.push("TARGET_NOT_STAGING");
  const stage = parsedOrigin(env.STAGING_PUBLIC_ORIGIN);
  const prod = parsedOrigin(env.PRODUCTION_PUBLIC_ORIGIN);
  if (!stage) issues.push("STAGING_ORIGIN_INVALID");
  if (!prod) issues.push("PRODUCTION_ORIGIN_INVALID");
  if (stage && prod && stage === prod) issues.push("STAGING_EQUALS_PRODUCTION");
  if (stage && parsedOrigin(env.PUBLIC_SITE_ORIGIN) !== stage) issues.push("CANONICAL_ORIGIN_MISMATCH");
  return { ok: issues.length === 0, issues, stage };
}

export async function probePhase11Staging(env, requester = fetch) {
  const target = validateStagingHttpTarget(env);
  if (!target.ok) return { ok: false, checks: target.issues.map(code => ({ code, pass: false })) };
  const base = target.stage;
  const cases = [
    {
      code: "HEALTH_ENDPOINT",
      path: "/healthz", expected: 200,
      verify: async res => (await res.json())?.status === "ok",
    },
    {
      code: "SAME_ORIGIN_TRPC_AND_NO_STORE",
      path: "/api/trpc/discoveryCheckpoint.status", expected: 200,
      headers: { Origin: base, "Sec-Fetch-Site": "same-origin" },
      verify: async res => res.headers.get("cache-control")?.includes("no-store")
        && (await res.text()).includes('"enabled":false'),
    },
    {
      code: "CHILD_CLOUD_AND_AI_DEFAULT_OFF",
      path: "/api/trpc/explorer.features", expected: 200,
      headers: { Origin: base, "Sec-Fetch-Site": "same-origin" },
      verify: async res => {
        const response = await res.text();
        return response.includes('"cloudSaveEnabled":false')
          && response.includes('"aiFeedbackEnabled":false');
      },
    },
    {
      code: "FOREIGN_ORIGIN_DENIED",
      path: "/api/trpc/discoveryCheckpoint.status", expected: 403,
      headers: { Origin: "https://untrusted.invalid" },
    },
    {
      code: "CROSS_SITE_FETCH_METADATA_DENIED",
      path: "/api/trpc/discoveryCheckpoint.status", expected: 403,
      headers: { "Sec-Fetch-Site": "cross-site" },
    },
    {
      code: "LEGACY_CHILD_SHARE_DENIED",
      path: "/api/trpc/explorer.getShare?input=" +
        encodeURIComponent(JSON.stringify({json:{token:"A".repeat(40)}})),
      expected: 403,
      headers: { Origin: base, "Sec-Fetch-Site": "same-origin" },
    },
  ];
  if (env.MANUS_OAUTH_SERVER_ENABLED !== "1") cases.push({
    code: "OPTIONAL_OAUTH_DISABLED",
    path: "/api/oauth/callback?code=not-real&state=not-real",
    expected: 404,
  });
  const checks = [];
  for (const entry of cases) {
    let pass = false;
    try {
      const response = await requester(base + entry.path, {
        method: "GET", headers: entry.headers ?? {},
        redirect: "manual", signal: AbortSignal.timeout(8000),
      });
      pass = response.status === entry.expected
        && (!entry.verify || Boolean(await entry.verify(response)));
    } catch { pass = false; }
    checks.push({ code: entry.code, pass });
  }
  return { ok: checks.every(item => item.pass), checks };
}
