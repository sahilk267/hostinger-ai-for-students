CREATE TABLE `explorerShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`tokenHash` varchar(128) NOT NULL,
	`summaryJson` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `explorerShares_id` PRIMARY KEY(`id`),
	CONSTRAINT `explorerShares_tokenHash_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
ALTER TABLE `explorerShares` ADD CONSTRAINT `explorerShares_profileId_explorerProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `explorerProfiles`(`id`) ON DELETE cascade ON UPDATE no action;