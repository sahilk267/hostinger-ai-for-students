import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectPreviewSafety, printPreviewSafety } from "./preview-safety.mjs";

const base = {
  DEPLOY_TARGET: "preview",
  PUBLIC_SITE_ORIGIN: "https://preview-1.hostingersite.com",
  PREVIEW_PUBLIC_ORIGIN: "https://preview-1.hostingersite.com",
  PRODUCTION_PUBLIC_ORIGIN: "https://aiforstudents.in",
  EXPLORER_CLOUD_SAVE_ENABLED: "0",
  EXPLORER_AI_FEEDBACK_ENABLED: "0",
  DISCOVERY_CHECKPOINTS_ENABLED: "0",
  PREVIEW_DATA_MODE: "guest-only",
};

test("accepts distinct guest-only preview with no DB or email credentials", () => {
  const result = inspectPreviewSafety(base);
  assert.equal(result.ok, true);
  assert.match(printPreviewSafety(result), /PASS/);
});
test("rejects preview sharing the production public origin", () => {
  const result = inspectPreviewSafety({ ...base, PUBLIC_SITE_ORIGIN: base.PRODUCTION_PUBLIC_ORIGIN, PREVIEW_PUBLIC_ORIGIN: base.PRODUCTION_PUBLIC_ORIGIN });
  assert.equal(result.ok, false);
  assert.match(result.issues.join("|"), /Preview origin must be different/);
});
test("rejects database credentials in guest-only preview", () => {
  for (const data of [
    { DATABASE_URL: "mysql://user:real-secret@127.0.0.1:3306/prod" },
    { DATABASE_NAME: "production_db" },
    { MYSQL_PASSWORD: "another-secret" },
    { HOSTINGER_MAIL_API_TOKEN: "mail-secret" },
  ]) assert.equal(inspectPreviewSafety({ ...base, ...data }).ok, false);
});
test("rejects any child data, checkpoints or external coaching being enabled", () => {
  for (const flag of ["EXPLORER_CLOUD_SAVE_ENABLED","EXPLORER_AI_FEEDBACK_ENABLED","DISCOVERY_CHECKPOINTS_ENABLED"]) {
    const result = inspectPreviewSafety({ ...base, [flag]: "1" });
    assert.equal(result.ok, false);
    assert.match(result.issues.join("|"), new RegExp(flag));
  }
});
test("accepts distinctly named and owned staged MySQL if explicitly configured", () => {
  const result = inspectPreviewSafety({
    ...base,
    PREVIEW_DATA_MODE: "separate-db",
    DATABASE_URL: "mysql://stg_user:staging-pass@127.0.0.1:3306/u12345_preview",
    PRODUCTION_DATABASE_NAME: "u12345_prod",
    PRODUCTION_DATABASE_USER: "prod_user",
    PREVIEW_TEST_MAIL_ONLY: "yes",
  });
  assert.equal(result.ok, true, result.issues.join("|"));
  assert.ok(result.warnings.length > 0);
});
test("rejects a production DB even if its name contains preview", () => {
  const result = inspectPreviewSafety({
    ...base, PREVIEW_DATA_MODE: "separate-db",
    DATABASE_URL: "mysql://prod_user:secret@127.0.0.1:3306/u123_preview",
    PRODUCTION_DATABASE_NAME: "u123_preview",
    PRODUCTION_DATABASE_USER: "prod_user",
    PREVIEW_TEST_MAIL_ONLY: "yes",
  });
  assert.equal(result.ok, false);
  assert.match(result.issues.join("|"), /names must differ/);
  assert.match(result.issues.join("|"), /distinct least-privilege/);
});
test("errors and printed output never contain database credentials", () => {
  const secret = "do-not-display-this-password";
  const env = {
    ...base, PREVIEW_DATA_MODE: "separate-db",
    DATABASE_URL: "mysql://person:" + secret + "@127.0.0.1:3306/somedb",
    PRODUCTION_DATABASE_NAME: "somedb",
    PRODUCTION_DATABASE_USER: "person",
    PREVIEW_TEST_MAIL_ONLY: "no",
  };
  const report = printPreviewSafety(inspectPreviewSafety(env));
  assert.equal(report.includes(secret), false);
  assert.equal(report.includes("mysql://"), false);
  assert.equal(report.includes("person"), false);
});
test("requires distinct HTTPS origins and explicit preview mode", () => {
  const result = inspectPreviewSafety({
    ...base, DEPLOY_TARGET: "production",
    PUBLIC_SITE_ORIGIN: "http://preview-1.hostingersite.com",
    PREVIEW_PUBLIC_ORIGIN: "http://preview-1.hostingersite.com",
  });
  assert.equal(result.ok, false);
  assert.match(result.issues.join("|"), /DEPLOY_TARGET/);
  assert.match(result.issues.join("|"), /HTTPS origin/);
});
