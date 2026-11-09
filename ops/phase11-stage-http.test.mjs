import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { probePhase11Staging, validateStagingHttpTarget } from "./phase11-stage-http.mjs";

const config=()=>({
  DEPLOY_TARGET:"staging",STAGING_PUBLIC_ORIGIN:"https://stage.aifs.test",
  PUBLIC_SITE_ORIGIN:"https://stage.aifs.test",
  PRODUCTION_PUBLIC_ORIGIN:"https://aiforstudents.in",
  MANUS_OAUTH_SERVER_ENABLED:"0",
});
function response(status,body="",headers={}) {
  return new Response(body,{status,headers});
}
function fakeFetcher(url,init) {
  const path=new URL(url).pathname;
  const origin=init.headers?.Origin;
  if (path === "/healthz") return Promise.resolve(response(200,'{"status":"ok"}'));
  if (path === "/api/oauth/callback") return Promise.resolve(response(404));
  if (path === "/api/trpc/explorer.getShare") return Promise.resolve(response(403));
  if (init.headers?.["Sec-Fetch-Site"] === "cross-site" || origin === "https://untrusted.invalid") {
    return Promise.resolve(response(403));
  }
  if (path === "/api/trpc/explorer.features") return Promise.resolve(response(
    200,'{"result":{"data":{"json":{"cloudSaveEnabled":false,"aiFeedbackEnabled":false}}}}',
    {"cache-control":"private, no-store"}
  ));
  if (path === "/api/trpc/discoveryCheckpoint.status") return Promise.resolve(response(
    200,'{"result":{"data":{"json":{"enabled":false}}}}',
    {"cache-control":"private, no-store"}
  ));
  return Promise.resolve(response(404));
}
describe("isolated public staging HTTP probe",()=>{
  it("requires distinct HTTPS staging and production origins",()=>{
    assert.equal(validateStagingHttpTarget(config()).ok,true);
    const risk={...config(),STAGING_PUBLIC_ORIGIN:"https://aiforstudents.in"};
    assert.ok(validateStagingHttpTarget(risk).issues.includes("STAGING_EQUALS_PRODUCTION"));
    assert.ok(validateStagingHttpTarget({...config(),STAGING_PUBLIC_ORIGIN:"http://stage.aifs.test"})
      .issues.includes("STAGING_ORIGIN_INVALID"));
    assert.ok(validateStagingHttpTarget({...config(),PUBLIC_SITE_ORIGIN:"https://aiforstudents.in"})
      .issues.includes("CANONICAL_ORIGIN_MISMATCH"));
  });
  it("checks all public safety signals without sending any mutation or credentials",async()=>{
    const calls=[];
    const result=await probePhase11Staging(config(),async(url,init)=>{
      calls.push({url,init});
      return fakeFetcher(url,init);
    });
    assert.equal(result.ok,true);
    assert.equal(result.checks.length,7);
    assert.ok(calls.every(call=>call.init.method==="GET"));
    assert.ok(calls.every(call=>!call.init.headers?.Authorization && !call.init.headers?.Cookie));
    assert.ok(calls.every(call=>call.url.startsWith("https://stage.aifs.test/")));
  });
  it("fails when a private share remains publicly reachable or cache is enabled",async()=>{
    const res=await probePhase11Staging(config(),async(url,init)=>{
      const path=new URL(url).pathname;
      if (path === "/api/trpc/explorer.getShare") return response(200);
      if (path === "/api/trpc/discoveryCheckpoint.status" &&
        init.headers?.Origin === "https://stage.aifs.test") {
          return response(200,'{"enabled":false}');
      }
      return fakeFetcher(url,init);
    });
    assert.equal(res.ok,false);
    assert.ok(res.checks.some(x=>x.code==="LEGACY_CHILD_SHARE_DENIED" && !x.pass));
    assert.ok(res.checks.some(x=>x.code==="SAME_ORIGIN_TRPC_AND_NO_STORE" && !x.pass));
  });
  it("refuses all HTTP requests when config targets production by mistake",async()=>{
    let calls=0;
    const result=await probePhase11Staging({
      ...config(), STAGING_PUBLIC_ORIGIN:"https://aiforstudents.in",
    },async()=>{calls++;throw Error("should not fetch");});
    assert.equal(result.ok,false);
    assert.equal(calls,0);
  });
});
