import { afterAll, beforeAll, describe, expect, it } from "vitest";
import mysql from "mysql2/promise";
import { createHmac, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  reserveEmailLoginChallenge,
  consumeEmailLoginChallenge,
  cancelEmailLoginChallenge,
} from "./db";

/**
 * Real MySQL behavior — NEVER run against a production DB.
 * CI runs this only with its dedicated ephemeral MySQL service.
 */
const run = process.env.RUN_MYSQL_INTEGRATION === "1" ? describe : describe.skip;
run("email OTP persistence (real, isolated MySQL)", () => {
  const databaseUrl = process.env.DATABASE_URL;
  const dbName = databaseUrl ? new URL(databaseUrl).pathname.slice(1) : "";
  const safeTestDatabase = /^aifs_ci(?:_[a-z0-9_]+)?$/.test(dbName);
  if (process.env.RUN_MYSQL_INTEGRATION === "1" && !safeTestDatabase) throw new Error("OTP integration tests require an isolated aifs_ci database");
  const testUrl = databaseUrl!;
  let connection: mysql.Connection;
  const keys: string[] = [];

  function sample() {
    const emailKey = randomBytes(32).toString("hex");
    const challengeId = randomBytes(32).toString("base64url");
    const codeHash = createHmac("sha256", "not-a-production-key").update(challengeId).digest("hex");
    keys.push(emailKey);
    const now = new Date(Date.now() - 2000);
    return { emailKey, challengeId, codeHash, now, expiresAt: new Date(now.getTime() + 10 * 60_000) };
  }

  beforeAll(async () => {
    connection = await mysql.createConnection(testUrl);
    const schema = readFileSync(resolve(process.cwd(), "ops/auth-email-otp-hardening.sql"), "utf8");
    // One CREATE TABLE statement; comments are part of the input.
    await connection.query(schema);
    await connection.query("DELETE FROM authEmailChallenges");
  });

  afterAll(async () => {
    if (!connection) return;
    if (keys.length) await connection.query("DELETE FROM authEmailChallenges WHERE emailKey IN (?)", [keys]);
    await connection.end();
  });

  it("enforces the global resend cooldown atomically across concurrent requests", async () => {
    const a = sample();
    const b = { ...sample(), emailKey: a.emailKey };
    const results = await Promise.all([reserveEmailLoginChallenge(a), reserveEmailLoginChallenge(b)]);
    expect(results.filter(Boolean)).toHaveLength(1);
    const [row] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT challengeId, attempts, consumedAt FROM authEmailChallenges WHERE emailKey = ?", [a.emailKey],
    );
    expect(row).toHaveLength(1);
    expect([a.challengeId, b.challengeId]).toContain(row[0].challengeId);
    expect(row[0].attempts).toBe(0);
    expect(row[0].consumedAt).toBeNull();
  });

  it("permits one-time correct consumption, never a replay, even concurrently", async () => {
    const a = sample();
    expect(await reserveEmailLoginChallenge(a)).toBe(true);
    const input = { emailKey: a.emailKey, challengeId: a.challengeId, codeHash: a.codeHash, now: new Date() };
    const results = await Promise.all(Array.from({ length: 8 }, () => consumeEmailLoginChallenge(input)));
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(await consumeEmailLoginChallenge(input)).toBe(false);
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT attempts, consumedAt FROM authEmailChallenges WHERE emailKey = ?", [a.emailKey]);
    expect(rows[0].attempts).toBe(1);
    expect(rows[0].consumedAt).not.toBeNull();
  });

  it("locks the code after five wrong guesses (including simultaneous guesses)", async () => {
    const a = sample();
    expect(await reserveEmailLoginChallenge(a)).toBe(true);
    const wrong = { emailKey: a.emailKey, challengeId: a.challengeId, codeHash: "f".repeat(64), now: new Date() };
    expect((await Promise.all(Array.from({ length: 12 }, () => consumeEmailLoginChallenge(wrong)))).every(v => v === false)).toBe(true);
    expect(await consumeEmailLoginChallenge({ ...wrong, codeHash: a.codeHash })).toBe(false);
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT attempts, consumedAt FROM authEmailChallenges WHERE emailKey = ?", [a.emailKey]);
    expect(rows[0].attempts).toBe(5);
    expect(rows[0].consumedAt).toBeNull();
  });

  it("rejects expired challenges and supports cancellation without affecting others", async () => {
    const expired = sample();
    expired.expiresAt = new Date(Date.now() - 1000);
    expect(await reserveEmailLoginChallenge(expired)).toBe(true);
    expect(await consumeEmailLoginChallenge({
      emailKey: expired.emailKey, challengeId: expired.challengeId,
      codeHash: expired.codeHash, now: new Date(),
    })).toBe(false);

    const another = sample();
    expect(await reserveEmailLoginChallenge(another)).toBe(true);
    await cancelEmailLoginChallenge(another.emailKey, randomBytes(32).toString("base64url"));
    const [before] = await connection.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS total FROM authEmailChallenges WHERE emailKey = ?", [another.emailKey]);
    expect(before[0].total).toBe(1);
    await cancelEmailLoginChallenge(another.emailKey, another.challengeId);
    const [after] = await connection.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS total FROM authEmailChallenges WHERE emailKey = ?", [another.emailKey]);
    expect(after[0].total).toBe(0);
  });

  it("issues a new opaque challenge only after the cooldown passes", async () => {
    const old = sample();
    expect(await reserveEmailLoginChallenge(old)).toBe(true);
    const next = { ...sample(), emailKey: old.emailKey, now: new Date(old.now.getTime() + 61_000) };
    next.expiresAt = new Date(next.now.getTime() + 600_000);
    expect(await reserveEmailLoginChallenge(next)).toBe(true);
    expect(await consumeEmailLoginChallenge({
      emailKey: old.emailKey, challengeId: old.challengeId, codeHash: old.codeHash, now: next.now,
    })).toBe(false);
    expect(await consumeEmailLoginChallenge({
      emailKey: next.emailKey, challengeId: next.challengeId, codeHash: next.codeHash, now: next.now,
    })).toBe(true);
  });
});
