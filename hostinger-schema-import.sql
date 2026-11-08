-- AI for Students blank-database schema import
-- Run this ONLY for a completely blank database after selecting it in phpMyAdmin.
-- Do NOT re-import into an existing seven-table deployment. The two optional
-- Phase 11 security tables are a separate staging-only migration in
-- ops/auth-session-abuse-hardening.sql.
-- This file creates tables and constraints only; it contains no users, credentials or seed data.

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `openId` varchar(64) NOT NULL,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `users_id` PRIMARY KEY (`id`),
  CONSTRAINT `users_openId_unique` UNIQUE (`openId`)
);

CREATE TABLE `learningProgress` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `gameId` varchar(64) NOT NULL,
  `attempts` int NOT NULL DEFAULT 0,
  `completions` int NOT NULL DEFAULT 0,
  `bestScore` int NOT NULL DEFAULT 0,
  `lastScore` int NOT NULL DEFAULT 0,
  `lastPlayedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `learningProgress_id` PRIMARY KEY (`id`),
  CONSTRAINT `learningProgress_user_game_unique` UNIQUE (`userId`, `gameId`),
  CONSTRAINT `learningProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `explorerProfiles` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `displayName` varchar(80) NOT NULL,
  `ageBand` enum('5-7','8-10','11-13','14-17') NOT NULL,
  `language` varchar(32) NOT NULL DEFAULT 'en',
  `consentVersion` varchar(32) NOT NULL,
  `consentAt` timestamp NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL,
  CONSTRAINT `explorerProfiles_id` PRIMARY KEY (`id`),
  CONSTRAINT `explorerProfiles_user_displayName_unique` UNIQUE (`userId`, `displayName`),
  CONSTRAINT `explorerProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `explorerAttempts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `profileId` int NOT NULL,
  `missionId` varchar(80) NOT NULL,
  `attemptNumber` int NOT NULL DEFAULT 1,
  `difficulty` varchar(24) NOT NULL DEFAULT 'standard',
  `language` varchar(32) NOT NULL DEFAULT 'en',
  `accessibilityMode` varchar(64) NOT NULL DEFAULT 'standard',
  `evidenceJson` text NOT NULL,
  `observationJson` text NOT NULL,
  `startedAt` timestamp NOT NULL,
  `completedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `explorerAttempts_id` PRIMARY KEY (`id`),
  CONSTRAINT `explorerAttempts_profile_mission_unique` UNIQUE (`profileId`, `missionId`, `attemptNumber`),
  CONSTRAINT `explorerAttempts_profileId_explorerProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `explorerProfiles` (`id`) ON DELETE CASCADE
);

CREATE TABLE `explorerShares` (
  `id` int AUTO_INCREMENT NOT NULL,
  `profileId` int NOT NULL,
  `tokenHash` varchar(128) NOT NULL,
  `summaryJson` text NOT NULL,
  `expiresAt` timestamp NOT NULL,
  `revokedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `explorerShares_id` PRIMARY KEY (`id`),
  CONSTRAINT `explorerShares_tokenHash_unique` UNIQUE (`tokenHash`),
  CONSTRAINT `explorerShares_profileId_explorerProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `explorerProfiles` (`id`) ON DELETE CASCADE
);


-- Browser-independent practice check (default-disabled feature flag).
CREATE TABLE `discoveryCheckpoints` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `userId` INT NOT NULL,
  `ageBand` ENUM('8-10','11-13','14-17') NOT NULL,
  `challengeId` VARCHAR(64) NOT NULL,
  `attempts` INT NOT NULL DEFAULT 0,
  `solvedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `discoveryCheckpoints_user_challenge_unique` (`userId`,`challengeId`),
  CONSTRAINT `discoveryCheckpoints_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Required for hardened OTP login; no plaintext email or code is stored.
CREATE TABLE `authEmailChallenges` (
  `emailKey` VARCHAR(64) NOT NULL,
  `challengeId` VARCHAR(64) NOT NULL,
  `codeHash` VARCHAR(64) NOT NULL,
  `expiresAt` TIMESTAMP NOT NULL,
  `requestedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attempts` INT NOT NULL DEFAULT 0,
  `consumedAt` TIMESTAMP NULL,
  PRIMARY KEY (`emailKey`),
  UNIQUE KEY `authEmailChallenges_challengeId_unique` (`challengeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Verification queries (run after import):
-- SHOW TABLES;
-- SHOW COLUMNS FROM users;
-- SHOW CREATE TABLE users;
-- SELECT COUNT(*) AS users_count FROM users;
