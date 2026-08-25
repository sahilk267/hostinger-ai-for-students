import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const learningProgress = mysqlTable("learningProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameId: varchar("gameId", { length: 64 }).notNull(),
  attempts: int("attempts").default(0).notNull(),
  completions: int("completions").default(0).notNull(),
  bestScore: int("bestScore").default(0).notNull(),
  lastScore: int("lastScore").default(0).notNull(),
  lastPlayedAt: timestamp("lastPlayedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userGameUnique: uniqueIndex("learningProgress_user_game_unique").on(table.userId, table.gameId),
}));

export type LearningProgress = typeof learningProgress.$inferSelect;
export type InsertLearningProgress = typeof learningProgress.$inferInsert;

export const explorerProfiles = mysqlTable("explorerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  displayName: varchar("displayName", { length: 80 }).notNull(),
  ageBand: mysqlEnum("ageBand", ["5-7", "8-10", "11-13", "14-17"]).notNull(),
  language: varchar("language", { length: 32 }).default("en").notNull(),
  consentVersion: varchar("consentVersion", { length: 32 }).notNull(),
  consentAt: timestamp("consentAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deletedAt"),
}, (table) => ({
  userDisplayNameUnique: uniqueIndex("explorerProfiles_user_displayName_unique").on(table.userId, table.displayName),
}));

export type ExplorerProfile = typeof explorerProfiles.$inferSelect;
export type InsertExplorerProfile = typeof explorerProfiles.$inferInsert;

export const explorerAttempts = mysqlTable("explorerAttempts", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => explorerProfiles.id, { onDelete: "cascade" }),
  missionId: varchar("missionId", { length: 80 }).notNull(),
  attemptNumber: int("attemptNumber").default(1).notNull(),
  difficulty: varchar("difficulty", { length: 24 }).default("standard").notNull(),
  language: varchar("language", { length: 32 }).default("en").notNull(),
  accessibilityMode: varchar("accessibilityMode", { length: 64 }).default("standard").notNull(),
  evidenceJson: text("evidenceJson").notNull(),
  observationJson: text("observationJson").notNull(),
  startedAt: timestamp("startedAt").notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  profileMissionUnique: uniqueIndex("explorerAttempts_profile_mission_unique").on(table.profileId, table.missionId, table.attemptNumber),
}));

export type ExplorerAttempt = typeof explorerAttempts.$inferSelect;
export type InsertExplorerAttempt = typeof explorerAttempts.$inferInsert;

export const explorerShares = mysqlTable("explorerShares", {
  id: int("id").autoincrement().primaryKey(),
  profileId: int("profileId").notNull().references(() => explorerProfiles.id, { onDelete: "cascade" }),
  tokenHash: varchar("tokenHash", { length: 128 }).notNull().unique(),
  summaryJson: text("summaryJson").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  revokedAt: timestamp("revokedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExplorerShare = typeof explorerShares.$inferSelect;
export type InsertExplorerShare = typeof explorerShares.$inferInsert;
