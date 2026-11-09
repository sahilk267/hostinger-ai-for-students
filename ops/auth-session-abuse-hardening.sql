-- Phase 11 optional security tables. REVIEW and BACK UP the correct staging DB.
-- Never auto-run against production; this does not delete existing user rows.
-- Enable AUTH_SESSIONS_ENFORCED=1 and AUTH_ABUSE_DB_ENABLED=1 only after
-- confirming both tables and proxy/IP handling in isolated staging.
CREATE TABLE IF NOT EXISTS `authSessions` (
  `tokenHash` VARCHAR(64) NOT NULL,
  `userId` INT NOT NULL,
  `expiresAt` TIMESTAMP NOT NULL,
  `revokedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tokenHash`),
  KEY `authSessions_userId_idx` (`userId`),
  CONSTRAINT `authSessions_userId_users_id_fk`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `authRequestBuckets` (
  `bucketKey` VARCHAR(64) NOT NULL,
  `hits` INT NOT NULL DEFAULT 0,
  `expiresAt` TIMESTAMP NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bucketKey`),
  KEY `authRequestBuckets_expiresAt_idx` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Read-only verification AFTER import:
-- SHOW TABLES LIKE 'authSessions';
-- SHOW TABLES LIKE 'authRequestBuckets';
-- SHOW CREATE TABLE authSessions;
-- SELECT COUNT(*) FROM authSessions;
-- Cleanup of expired entries needs a separately scheduled, reviewed maintenance job.
