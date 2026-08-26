import { and, eq, isNull } from "drizzle-orm";
import { createHash, randomBytes } from "node:crypto";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, explorerAttempts, explorerProfiles, explorerShares, learningProgress, users } from "../drizzle/schema";
import { ENV, describeDatabaseConfig } from './_core/env';
import { gt, desc } from "drizzle-orm";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db) {
    if (!ENV.databaseUrl) {
      const state = describeDatabaseConfig(process.env);
      console.warn(`[Database] No usable database configuration: source=${state.source}; valid=${state.valid}; present=${state.presentKeys.join(",") || "none"}`);
      return null;
    }
    try {
      _db = drizzle(ENV.databaseUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    const cause = error instanceof Error ? (error as Error & { cause?: unknown }).cause : undefined;
    if (cause instanceof Error) console.error("[Database] Driver cause:", cause.message);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getLearningProgressForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(learningProgress).where(eq(learningProgress.userId, userId));
}

export async function saveLearningProgress(input: { userId: number; gameId: string; attempts: number; completions: number; bestScore: number; lastScore: number; lastPlayedAt?: Date | null }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select().from(learningProgress).where(and(eq(learningProgress.userId, input.userId), eq(learningProgress.gameId, input.gameId))).limit(1);
  if (existing[0]) {
    await db.update(learningProgress).set({ attempts: input.attempts, completions: input.completions, bestScore: input.bestScore, lastScore: input.lastScore, lastPlayedAt: input.lastPlayedAt ?? new Date() }).where(eq(learningProgress.id, existing[0].id));
    return { ...existing[0], ...input };
  }
  const [created] = await db.insert(learningProgress).values({ ...input, lastPlayedAt: input.lastPlayedAt ?? new Date() });
  return { ...input, id: Number(created.insertId), lastPlayedAt: input.lastPlayedAt ?? new Date() };
}

export function mergeProgressValues(current: { attempts: number; completions: number; bestScore: number; lastScore: number } | undefined, incoming: { attempts: number; completions: number; bestScore: number; lastScore: number }) {
  return {
    attempts: Math.max(current?.attempts ?? 0, incoming.attempts),
    completions: Math.max(current?.completions ?? 0, incoming.completions),
    bestScore: Math.max(current?.bestScore ?? 0, incoming.bestScore),
    lastScore: Math.max(current?.lastScore ?? 0, incoming.lastScore),
  };
}

export async function mergeGuestProgressForUser(userId: number, input: { gameId: string; attempts: number; completions: number; bestScore: number; lastScore: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select().from(learningProgress).where(and(eq(learningProgress.userId, userId), eq(learningProgress.gameId, input.gameId))).limit(1);
  const current = existing[0];
  return saveLearningProgress({ userId, gameId: input.gameId, ...mergeProgressValues(current, input), lastPlayedAt: new Date() });
}

export async function deleteLearningProgressForUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(learningProgress).where(eq(learningProgress.userId, userId));
}

export async function deleteUserAccount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(users).where(eq(users.id, userId));
}

export async function listExplorerProfilesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(explorerProfiles).where(and(eq(explorerProfiles.userId, userId), isNull(explorerProfiles.deletedAt)));
}

export async function listExplorerAttemptsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: explorerAttempts.id, profileId: explorerAttempts.profileId, missionId: explorerAttempts.missionId, completedAt: explorerAttempts.completedAt, ageBand: explorerProfiles.ageBand }).from(explorerAttempts).innerJoin(explorerProfiles, eq(explorerAttempts.profileId, explorerProfiles.id)).where(and(eq(explorerProfiles.userId, userId), isNull(explorerProfiles.deletedAt))).orderBy(desc(explorerAttempts.completedAt));
}

export async function createExplorerProfile(input: {
  userId: number;
  displayName: string;
  ageBand: "5-7" | "8-10" | "11-13" | "14-17";
  language: string;
  consentVersion: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const now = new Date();
  const [created] = await db.insert(explorerProfiles).values({ ...input, consentAt: now });
  return { id: Number(created.insertId), ...input, consentAt: now };
}

export async function saveExplorerAttempt(input: {
  userId: number;
  profileId: number;
  missionId: string;
  attemptNumber: number;
  difficulty: string;
  language: string;
  accessibilityMode: string;
  evidenceJson: string;
  observationJson: string;
  startedAt: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const profile = await db.select().from(explorerProfiles).where(and(eq(explorerProfiles.id, input.profileId), eq(explorerProfiles.userId, input.userId), isNull(explorerProfiles.deletedAt))).limit(1);
  if (!profile[0]) throw new Error("Explorer profile not found");
  const [created] = await db.insert(explorerAttempts).values({
    profileId: input.profileId,
    missionId: input.missionId,
    attemptNumber: input.attemptNumber,
    difficulty: input.difficulty,
    language: input.language,
    accessibilityMode: input.accessibilityMode,
    evidenceJson: input.evidenceJson,
    observationJson: input.observationJson,
    startedAt: input.startedAt,
    completedAt: new Date(),
  });
  return { id: Number(created.insertId), missionId: input.missionId, completedAt: new Date() };
}

export async function createExplorerShare(input: { userId: number; profileId: number; summaryJson: string; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const profile = await db.select().from(explorerProfiles).where(and(eq(explorerProfiles.id, input.profileId), eq(explorerProfiles.userId, input.userId), isNull(explorerProfiles.deletedAt))).limit(1);
  if (!profile[0]) throw new Error("Explorer profile not found");
  const token = randomBytes(24).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const [created] = await db.insert(explorerShares).values({ profileId: input.profileId, tokenHash, summaryJson: input.summaryJson, expiresAt: input.expiresAt });
  return { id: Number(created.insertId), token, expiresAt: input.expiresAt };
}

export async function getExplorerShareByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const rows = await db.select({ id: explorerShares.id, summaryJson: explorerShares.summaryJson, expiresAt: explorerShares.expiresAt }).from(explorerShares).where(and(eq(explorerShares.tokenHash, tokenHash), isNull(explorerShares.revokedAt), gt(explorerShares.expiresAt, new Date()))).limit(1);
  return rows[0];
}

export async function revokeExplorerShare(userId: number, shareId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const owned = await db.select({ id: explorerShares.id }).from(explorerShares).innerJoin(explorerProfiles, eq(explorerShares.profileId, explorerProfiles.id)).where(and(eq(explorerShares.id, shareId), eq(explorerProfiles.userId, userId), isNull(explorerProfiles.deletedAt))).limit(1);
  if (!owned[0]) throw new Error("Explorer share not found");
  await db.update(explorerShares).set({ revokedAt: new Date() }).where(eq(explorerShares.id, shareId));
  return { success: true as const };
}

export async function softDeleteExplorerProfile(userId: number, profileId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(explorerProfiles).set({ deletedAt: new Date() }).where(and(eq(explorerProfiles.id, profileId), eq(explorerProfiles.userId, userId)));
}

