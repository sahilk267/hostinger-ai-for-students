CREATE TABLE `explorerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(80) NOT NULL,
	`ageBand` enum('5-7','8-10','11-13','14-17') NOT NULL,
	`language` varchar(32) NOT NULL DEFAULT 'en',
	`consentVersion` varchar(32) NOT NULL,
	`consentAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deletedAt` timestamp,
	CONSTRAINT `explorerProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `explorerProfiles_user_displayName_unique` UNIQUE(`userId`,`displayName`)
);
--> statement-breakpoint
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
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `explorerAttempts_id` PRIMARY KEY(`id`),
	CONSTRAINT `explorerAttempts_profile_mission_unique` UNIQUE(`profileId`,`missionId`,`attemptNumber`)
);
--> statement-breakpoint
ALTER TABLE `explorerProfiles` ADD CONSTRAINT `explorerProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `explorerAttempts` ADD CONSTRAINT `explorerAttempts_profileId_explorerProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `explorerProfiles`(`id`) ON DELETE cascade ON UPDATE no action;
