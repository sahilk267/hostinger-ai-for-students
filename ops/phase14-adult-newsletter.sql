-- Phase 14 adult-only email opt-in, for isolated staging/approved rollout only.
-- Never import into production without backup and privacy review.
-- Existing 7 learner/auth tables and Phase 11 schema are unchanged.
CREATE TABLE IF NOT EXISTS `newsletterSubscribers` (
  `emailKey` VARCHAR(64) NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `confirmHash` VARCHAR(64) NOT NULL,
  `confirmExpiresAt` TIMESTAMP NOT NULL,
  `requestedAt` TIMESTAMP NOT NULL,
  `confirmedAt` TIMESTAMP NULL,
  `unsubscribedAt` TIMESTAMP NULL,
  PRIMARY KEY (`emailKey`),
  KEY `newsletterSubscribers_confirmedAt_idx` (`confirmedAt`),
  KEY `newsletterSubscribers_unsubscribedAt_idx` (`unsubscribedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Read-only verification after staging-only import:
-- SHOW CREATE TABLE newsletterSubscribers;
-- SELECT COUNT(*) AS total, COUNT(confirmedAt) AS ever_confirmed FROM newsletterSubscribers;
--
-- A subscriber is active only when confirmedAt IS NOT NULL AND unsubscribedAt IS NULL.
-- No automatic newsletter delivery/campaigns have been configured.
-- Owner must provide privacy notice, retention/deletion and safe mail sending.
-- Review maintenance policy before enabling:
-- DELETE FROM newsletterSubscribers WHERE confirmedAt IS NULL
--   AND requestedAt < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 7 DAY);
-- DELETE FROM newsletterSubscribers WHERE unsubscribedAt IS NOT NULL
--   AND unsubscribedAt < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY);
