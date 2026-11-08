import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluatePhase11Staging } from "./phase11-staging-gate.mjs";

const valid = () => ({
  DEPLOY_TARGET:"staging",
  STAGING_PUBLIC_ORIGIN:"https://stage.aifs.test",
  PRODUCTION_PUBLIC_ORIGIN:"https://aiforstudents.in",
  PUBLIC_SITE_ORIGIN:"https://stage.aifs.test",
  STAGING_DATA_MODE:"isolated-db",
  DATABASE_HOST:"127.0.0.1",DATABASE_NAME:"stage_aifs",DATABASE_USER:"stage_user",DATABASE_PASSWORD:"staging-private-example",
  PRODUCTION_DATABASE_NAME:"prod_aifs",PRODUCTION_DATABASE_USER:"prod_user",
  JWT_SECRET:"never-production-staging-testing-secret-value",
  STAGING_TEST_MAIL_ONLY:"yes",HOSTINGER_MAIL_API_TOKEN:"staging-token-placeholder",AUTH_MAIL_FROM:"test@stage.aifs.test",
  EXPLORER_CLOUD_SAVE_ENABLED:"0",EXPLORER_AI_FEEDBACK_ENABLED:"0",DISCOVERY_CHECKPOINTS_ENABLED:"0",
  MANUS_STORAGE_PROXY_ENABLED:"0",AUTH_SESSIONS_ENFORCED:"0",AUTH_ABUSE_DB_ENABLED:"0",
});
describe("Phase 11 read-only staging release policy",()=>{
  it("accepts a clearly isolated default-off staging declaration",()=>{
    assert.deepEqual(evaluatePhase11Staging(valid()),{ok:true,issues:[]});
  });
  it("rejects production origin, reused DB name/user and missing mail without leaking inputs",()=>{
    const env=valid();
    env.PUBLIC_SITE_ORIGIN=env.PRODUCTION_PUBLIC_ORIGIN;
    env.DATABASE_USER=env.PRODUCTION_DATABASE_USER;
    env.DATABASE_NAME=env.PRODUCTION_DATABASE_NAME;
    env.HOSTINGER_MAIL_API_TOKEN="";
    const out=evaluatePhase11Staging(env);
    assert.equal(out.ok,false);
    for(const key of ["PUBLIC_ORIGIN_NOT_STAGING","DATABASE_USER_NOT_ISOLATED",
      "DATABASE_NAME_NOT_ISOLATED","STAGING_MAIL_NOT_CONFIGURED"])assert.ok(out.issues.includes(key));
    assert.ok(!JSON.stringify(out).includes(env.JWT_SECRET));
    assert.ok(!JSON.stringify(out).includes(env.DATABASE_PASSWORD));
  });
  it("rejects active session ledger until schema review/import acknowledged",()=>{
    const env={...valid(),AUTH_SESSIONS_ENFORCED:"1"};
    assert.ok(evaluatePhase11Staging(env).issues.includes("SECURITY_SCHEMA_IMPORT_UNACKNOWLEDGED"));
    env.STAGING_SECURITY_SCHEMA_REVIEWED="yes";
    env.STAGING_SECURITY_SCHEMA_APPLIED="yes";
    assert.equal(evaluatePhase11Staging(env).ok,true);
  });
  it("never approves IP budgets without separate proxy topology acknowledgement",()=>{
    const env={...valid(),AUTH_ABUSE_DB_ENABLED:"1",
      STAGING_SECURITY_SCHEMA_REVIEWED:"yes",STAGING_SECURITY_SCHEMA_APPLIED:"yes"};
    assert.ok(evaluatePhase11Staging(env).issues.includes("PEER_IP_ISOLATION_UNACKNOWLEDGED"));
    env.STAGING_PEER_IP_ISOLATED="yes";
    assert.equal(evaluatePhase11Staging(env).ok,true);
  });
  it("rejects public children flags, storage signing, malformed origins and optional OAuth stubs",()=>{
    const env={...valid(),EXPLORER_CLOUD_SAVE_ENABLED:"1",
      MANUS_STORAGE_PROXY_ENABLED:"1",STAGING_PUBLIC_ORIGIN:"http://stage.aifs.test",
      VITE_MANUS_OAUTH_ENABLED:"1"};
    const check=evaluatePhase11Staging(env);
    assert.equal(check.ok,false);
    assert.ok(check.issues.includes("UNSAFE_CHILD_FLAG_EXPLORER_CLOUD_SAVE_ENABLED"));
    assert.ok(check.issues.includes("STORAGE_PROXY_NOT_DISABLED"));
    assert.ok(check.issues.includes("STAGING_HTTPS_ORIGIN_INVALID"));
    assert.ok(check.issues.includes("OPTIONAL_OAUTH_NOT_CONFIGURED"));
  });
  it("supports a separate MySQL URL without returning URL credentials",()=>{
    const env=valid();
    delete env.DATABASE_HOST;
    delete env.DATABASE_USER;
    delete env.DATABASE_PASSWORD;
    delete env.DATABASE_NAME;
    env.DATABASE_URL="mysql://stage_user:staging-password@localhost:3306/stage_aifs";
    assert.equal(evaluatePhase11Staging(env).ok,true);
    env.DATABASE_URL="mysql://prod_user:secret@localhost:3306/prod_aifs";
    const result=evaluatePhase11Staging(env);
    assert.ok(result.issues.includes("DATABASE_NAME_NOT_ISOLATED"));
    assert.ok(result.issues.includes("DATABASE_USER_NOT_ISOLATED"));
    assert.ok(!JSON.stringify(result).includes("secret"));
  });
});
