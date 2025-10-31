-- AlterTable
ALTER TABLE `User` ADD COLUMN `provider` ENUM('google', 'discord') NULL,
    ADD COLUMN `providerId` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `role` ENUM('player', 'team', 'admin', 'pending') NULL;
