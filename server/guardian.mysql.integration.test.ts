import { beforeAll, afterAll, describe, expect, it } from "vitest";
import mysql from "mysql2/promise";
import { randomBytes } from "node:crypto";
import { exportExplorerRecordsForAccount, softDeleteExplorerProfile } from "./db";

/** Temporary CI database only. Tests actual account scoping and foreign-key cascades. */
const run = process.env.RUN_MYSQL_INTEGRATION === "1" ? describe : describe.skip;
run("Explorer guardian data integrity (real MySQL)", () => {
  const url = process.env.DATABASE_URL;
  if (process.env.RUN_MYSQL_INTEGRATION === "1" &&
    (!url || !/^aifs_ci(?:_[a-z0-9_]+)?$/.test(new URL(url).pathname.slice(1)))) {
    throw new Error("Guardian tests must use an isolated aifs_ci database");
  }
  let connection: mysql.Connection;
  const userIds: number[] = [];

  const q = async (statement: string, params: unknown[] = []) => {
    const [result] = await connection.query<mysql.ResultSetHeader>(statement, params);
    return result;
  };
  const count = async (table: "explorerProfiles" | "explorerAttempts" | "explorerShares", id: number) => {
    const field = table === "explorerProfiles" ? "id" : "profileId";
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM " + table + " WHERE " + field + " = ?", [id]);
    return Number(rows[0].total);
  };
  const addUser = async () => {
    const result = await q("INSERT INTO users(openId) VALUES(?)", ["ci:" + randomBytes(26).toString("hex")]);
    userIds.push(result.insertId);
    return result.insertId;
  };
  const addProfile = async (userId: number, nickname: string) => {
    const result = await q(
      "INSERT INTO explorerProfiles(userId,displayName,ageBand,language,consentVersion,consentAt) VALUES(?,?,'11-13','en','explorer-consent-v1',NOW())",
      [userId,nickname]);
    return result.insertId;
  };

  beforeAll(async () => {
    connection = await mysql.createConnection(url!);
    await q("CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,openId VARCHAR(64) NOT NULL UNIQUE,name TEXT NULL,email VARCHAR(320) NULL,loginMethod VARCHAR(64) NULL,role ENUM('user','admin') NOT NULL DEFAULT 'user',createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB");
    await q("CREATE TABLE IF NOT EXISTS explorerProfiles (id INT AUTO_INCREMENT PRIMARY KEY,userId INT NOT NULL,displayName VARCHAR(80) NOT NULL,ageBand ENUM('5-7','8-10','11-13','14-17') NOT NULL,language VARCHAR(32) NOT NULL DEFAULT 'en',consentVersion VARCHAR(32) NOT NULL,consentAt TIMESTAMP NOT NULL,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,deletedAt TIMESTAMP NULL,UNIQUE KEY explorerProfiles_user_displayName_unique(userId,displayName),FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE) ENGINE=InnoDB");
    await q("CREATE TABLE IF NOT EXISTS explorerAttempts (id INT AUTO_INCREMENT PRIMARY KEY,profileId INT NOT NULL,missionId VARCHAR(80) NOT NULL,attemptNumber INT NOT NULL DEFAULT 1,difficulty VARCHAR(24) NOT NULL DEFAULT 'standard',language VARCHAR(32) NOT NULL DEFAULT 'en',accessibilityMode VARCHAR(64) NOT NULL DEFAULT 'standard',evidenceJson TEXT NOT NULL,observationJson TEXT NOT NULL,startedAt TIMESTAMP NOT NULL,completedAt TIMESTAMP NULL,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE KEY explorerAttempts_profile_mission_unique(profileId,missionId,attemptNumber),FOREIGN KEY(profileId) REFERENCES explorerProfiles(id) ON DELETE CASCADE) ENGINE=InnoDB");
    await q("CREATE TABLE IF NOT EXISTS explorerShares (id INT AUTO_INCREMENT PRIMARY KEY,profileId INT NOT NULL,tokenHash VARCHAR(128) NOT NULL UNIQUE,summaryJson TEXT NOT NULL,expiresAt TIMESTAMP NOT NULL,revokedAt TIMESTAMP NULL,createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(profileId) REFERENCES explorerProfiles(id) ON DELETE CASCADE) ENGINE=InnoDB");
  });

  afterAll(async () => {
    if (!connection) return;
    for (const id of userIds) await q("DELETE FROM users WHERE id = ?", [id]);
    await connection.end();
  });

  it("keeps account export scoped to the correct owner", async () => {
    const ownerA = await addUser();
    const ownerB = await addUser();
    const profileA = await addProfile(ownerA, "StudyBuddyA");
    const profileB = await addProfile(ownerB, "StudyBuddyB");
    await q("INSERT INTO explorerAttempts(profileId,missionId,evidenceJson,observationJson,startedAt) VALUES(?, 'plan-rescue-11-13', ?, '{}', NOW())", [profileA, '{"privateAnswer":"private-to-A"}']);
    await q("INSERT INTO explorerAttempts(profileId,missionId,evidenceJson,observationJson,startedAt) VALUES(?, 'plan-rescue-11-13', ?, '{}', NOW())", [profileB, '{"privateAnswer":"private-to-B"}']);
    const a = await exportExplorerRecordsForAccount(ownerA);
    const b = await exportExplorerRecordsForAccount(ownerB);
    expect(a.profiles).toHaveLength(1);
    expect(a.attempts).toHaveLength(1);
    expect(a.attempts[0].profileId).toBe(profileA);
    expect(a.attempts[0].evidenceJson).toContain("private-to-A");
    expect(JSON.stringify(a)).not.toContain("private-to-B");
    expect(b.attempts[0].profileId).toBe(profileB);
    expect(JSON.stringify(b)).not.toContain("private-to-A");
  });

  it("disallows cross-account deletion and cascades correct-owner deletion", async () => {
    const owner = await addUser();
    const stranger = await addUser();
    const profile = await addProfile(owner, "LearningNickname");
    await q("INSERT INTO explorerAttempts(profileId,missionId,evidenceJson,observationJson,startedAt) VALUES(?, 'plan-rescue-11-13', '{}', '{}', NOW())", [profile]);
    const token = randomBytes(32).toString("hex");
    await q("INSERT INTO explorerShares(profileId,tokenHash,summaryJson,expiresAt) VALUES(?,?,'{}',DATE_ADD(NOW(), INTERVAL 7 DAY))", [profile,token]);
    await softDeleteExplorerProfile(stranger, profile);
    expect(await count("explorerProfiles", profile)).toBe(1);
    expect(await count("explorerAttempts", profile)).toBe(1);
    expect(await count("explorerShares", profile)).toBe(1);
    await softDeleteExplorerProfile(owner, profile);
    expect(await count("explorerProfiles", profile)).toBe(0);
    expect(await count("explorerAttempts", profile)).toBe(0);
    expect(await count("explorerShares", profile)).toBe(0);
  });
});
