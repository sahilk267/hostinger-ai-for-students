import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createHash, randomBytes } from "node:crypto";
import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isAuthSessionActive, registerAuthSession, revokeAuthSession, spendAuthRequestBudget } from "./db";
import { authRequestBucket } from "./authSessionSecurity";

const run = process.env.RUN_MYSQL_INTEGRATION === "1" ? describe : describe.skip;
run("session revocation and distributed abuse limits (isolated MySQL)", () => {
  const uri = process.env.DATABASE_URL ?? "";
  if (process.env.RUN_MYSQL_INTEGRATION === "1" &&
    (!uri || !/^aifs_ci(?:_[a-z0-9_]+)?$/.test(new URL(uri).pathname.slice(1))
      || !["127.0.0.1","localhost"].includes(new URL(uri).hostname))) {
    throw new Error("Session/rate integration suite requires only local aifs_ci DB");
  }
  let connection: mysql.Connection;
  const userIds: number[] = [];
  const bucketKeys: string[] = [];
  const rawSql = readFileSync(resolve(process.cwd(), "ops/auth-session-abuse-hardening.sql"), "utf8");

  beforeAll(async () => {
    connection = await mysql.createConnection(uri);
    await connection.query("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,openId VARCHAR(64) NOT NULL UNIQUE,name TEXT NULL,email VARCHAR(320) NULL,loginMethod VARCHAR(64) NULL,role ENUM('user','admin') NOT NULL DEFAULT 'user',createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB");
    for (const table of ["authSessions","authRequestBuckets"]) {
      const start = rawSql.indexOf("CREATE TABLE IF NOT EXISTS `" + table + "` (");
      const end = rawSql.indexOf(";",start);
      if (start < 0 || end < 0) throw new Error("Missing security migration table: " + table);
      await connection.query(rawSql.slice(start,end+1));
    }
  });
  afterAll(async () => {
    if (!connection) return;
    for (const key of bucketKeys) await connection.query("DELETE FROM authRequestBuckets WHERE bucketKey = ?", [key]);
    for (const id of userIds) await connection.query("DELETE FROM users WHERE id = ?", [id]);
    await connection.end();
  });
  async function addUser() {
    const openId = "ci:" + randomBytes(22).toString("hex");
    const [result] = await connection.query<mysql.ResultSetHeader>("INSERT INTO users(openId) VALUES(?)", [openId]);
    userIds.push(result.insertId);
    return result.insertId;
  }
  it("tracks token digests, enforces owner match, expiry, revocation, and deletion cascade", async () => {
    const owner = await addUser();
    const stranger = await addUser();
    const token = randomBytes(48).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60_000);
    await registerAuthSession({ tokenHash, userId: owner, expiresAt });
    expect(await isAuthSessionActive(tokenHash,owner)).toBe(true);
    expect(await isAuthSessionActive(tokenHash,stranger)).toBe(false);
    // MySQL TIMESTAMP has whole-second precision; use a definite later instant.
    expect(await isAuthSessionActive(tokenHash,owner,new Date(expiresAt.getTime()+60_000))).toBe(false);
    const [rows] = await connection.query<mysql.RowDataPacket[]>("SELECT tokenHash FROM authSessions WHERE tokenHash = ?", [tokenHash]);
    expect(rows).toHaveLength(1);
    expect(JSON.stringify(rows)).not.toContain(token);
    await revokeAuthSession(tokenHash);
    expect(await isAuthSessionActive(tokenHash,owner)).toBe(false);
    await revokeAuthSession(tokenHash);
    const nextHash = randomBytes(32).toString("hex");
    await registerAuthSession({ tokenHash: nextHash, userId: owner, expiresAt });
    await connection.query("DELETE FROM users WHERE id = ?",[owner]);
    userIds.splice(userIds.indexOf(owner),1);
    expect(await isAuthSessionActive(nextHash,owner)).toBe(false);
  });
  it("allows exactly five concurrent requests in one shared MySQL bucket", async () => {
    const bucket = authRequestBucket("contact","127.0.0.1",Date.now(),"CI-DUMMY-NOT-PRODUCTION-KEY-32-CHARS");
    bucketKeys.push(bucket.bucketKey);
    const calls = await Promise.all(Array.from({length:22},()=>spendAuthRequestBudget({ ...bucket, limit: 5 })));
    expect(calls.filter(Boolean)).toHaveLength(5);
    expect(await spendAuthRequestBudget({ ...bucket, limit:5 })).toBe(false);
    const [rows] = await connection.query<mysql.RowDataPacket[]>("SELECT hits FROM authRequestBuckets WHERE bucketKey = ?", [bucket.bucketKey]);
    expect(rows[0].hits).toBe(5);
  });
  it("uses distinct buckets for other peer or window (no plaintext address stored)", async () => {
    const now=Date.now();
    const a=authRequestBucket("otp-request","198.51.100.6",now,"CI-DUMMY-NOT-PRODUCTION-KEY-32-CHARS");
    const b=authRequestBucket("otp-request","198.51.100.7",now,"CI-DUMMY-NOT-PRODUCTION-KEY-32-CHARS");
    bucketKeys.push(a.bucketKey,b.bucketKey);
    expect(a.bucketKey).not.toEqual(b.bucketKey);
    expect(await spendAuthRequestBudget({ ...a,limit:1 })).toBe(true);
    expect(await spendAuthRequestBudget({ ...b,limit:1 })).toBe(true);
  });
});
