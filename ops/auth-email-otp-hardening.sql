-- Required before deploying the hardened email-OTP routes.
-- Back up database and review constraints; the change is NOT applied automatically.
-- No plaintext email or OTP: both email identifier and code digest are keyed HMACs.
CREATE TABLE IF NOT EXISTS `authEmailChallenges` (
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
