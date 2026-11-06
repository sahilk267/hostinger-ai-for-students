-- Discovery secure checkpoint PREVIEW (feature flag OFF by default)
-- Backup MySQL first. Apply with authorized database migration tooling before enabling.
-- Store only account ownership and minimal checkpoint practice state.
CREATE TABLE IF NOT EXISTS `discoveryCheckpoints` (
  `id` INT NOT NULL AUTO_INCREMENT,
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
