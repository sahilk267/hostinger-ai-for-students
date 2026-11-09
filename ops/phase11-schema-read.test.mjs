import { describe,it } from "node:test";
import assert from "node:assert/strict";
import { assessPhase11SecuritySchema, validateReadOnlySchemaTarget } from "./phase11-schema-read.mjs";

function env() {
  return {
    DEPLOY_TARGET:"staging",STAGING_DATA_MODE:"isolated-db",
    STAGING_PUBLIC_ORIGIN:"https://stage.aifs.invalid",
    PUBLIC_SITE_ORIGIN:"https://stage.aifs.invalid",
    PRODUCTION_PUBLIC_ORIGIN:"https://aiforstudents.in",
    DATABASE_URL:"mysql://stageuser:example-pass@localhost:3306/aifs_stage",
    PRODUCTION_DATABASE_NAME:"aifs_live",
    PRODUCTION_DATABASE_USER:"aifs_live_user",
  };
}
const cols=[
  ["authSessions","tokenHash","varchar",64,"NO"],
  ["authSessions","userId","int",null,"NO"],
  ["authSessions","expiresAt","timestamp",null,"NO"],
  ["authSessions","revokedAt","timestamp",null,"YES"],
  ["authSessions","createdAt","timestamp",null,"NO"],
  ["authRequestBuckets","bucketKey","varchar",64,"NO"],
  ["authRequestBuckets","hits","int",null,"NO"],
  ["authRequestBuckets","expiresAt","timestamp",null,"NO"],
  ["authRequestBuckets","createdAt","timestamp",null,"NO"],
].map(([tableName,columnName,dataType,maxLength,isNullable])=>
  ({tableName,columnName,dataType,maxLength,isNullable}));
const primary=[
  {tableName:"authSessions",columnName:"tokenHash"},
  {tableName:"authRequestBuckets",columnName:"bucketKey"},
];
const foreign=[
  {tableName:"authSessions",columnName:"userId",refTable:"users",refColumn:"id",deleteRule:"CASCADE"},
];
describe("read-only security schema checker",()=>{
  it("allows isolated staging only; no production reuse or secrets in errors",()=>{
    assert.equal(validateReadOnlySchemaTarget(env()).ok,true);
    const prod={...env(),DATABASE_URL:"mysql://aifs_live_user:SECRET@localhost:3306/aifs_live"};
    const result=validateReadOnlySchemaTarget(prod);
    assert.equal(result.ok,false);
    assert.ok(result.issues.includes("DATABASE_NAME_NOT_ISOLATED"));
    assert.ok(result.issues.includes("DATABASE_USER_NOT_ISOLATED"));
    assert.ok(!JSON.stringify(result).includes("SECRET"));
    assert.ok(validateReadOnlySchemaTarget({...env(),DEPLOY_TARGET:"production"}).issues.includes("TARGET_NOT_STAGING"));
  });
  it("verifies precise columns, nullability, primary keys, and cascade",()=>{
    assert.deepEqual(assessPhase11SecuritySchema(cols,primary,foreign),{ok:true,issues:[]});
    assert.ok(assessPhase11SecuritySchema(cols.filter(c=>c.columnName!=="revokedAt"),
      primary,foreign).issues.includes("SESSION_COLUMNS_INVALID"));
    assert.ok(assessPhase11SecuritySchema(cols,[],foreign).issues.includes("ABUSE_PRIMARY_KEY_INVALID"));
    assert.ok(assessPhase11SecuritySchema(cols,primary,
      [{...foreign[0],deleteRule:"RESTRICT"}]).issues.includes("SESSION_ACCOUNT_CASCADE_MISSING"));
  });
  it("rejects mismatched stale tables even when CREATE TABLE IF NOT EXISTS was used",()=>{
    const stale=cols.map(c=>c.columnName==="tokenHash"?{...c,maxLength:32}:c);
    assert.ok(assessPhase11SecuritySchema(stale,primary,foreign).issues.includes("SESSION_COLUMNS_INVALID"));
  });
});
