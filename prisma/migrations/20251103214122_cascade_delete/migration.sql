-- DropForeignKey
ALTER TABLE `GameAttribute` DROP FOREIGN KEY `GameAttribute_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserGame` DROP FOREIGN KEY `UserGame_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserGameAttributeValue` DROP FOREIGN KEY `UserGameAttributeValue_game_attribute_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserGameAttributeValue` DROP FOREIGN KEY `UserGameAttributeValue_user_game_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserGameCustomAttribute` DROP FOREIGN KEY `UserGameCustomAttribute_user_game_id_fkey`;

-- DropIndex
DROP INDEX `GameAttribute_game_id_fkey` ON `GameAttribute`;

-- DropIndex
DROP INDEX `UserGame_game_id_fkey` ON `UserGame`;

-- DropIndex
DROP INDEX `UserGameAttributeValue_game_attribute_id_fkey` ON `UserGameAttributeValue`;

-- DropIndex
DROP INDEX `UserGameCustomAttribute_user_game_id_fkey` ON `UserGameCustomAttribute`;

-- AddForeignKey
ALTER TABLE `GameAttribute` ADD CONSTRAINT `GameAttribute_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGame` ADD CONSTRAINT `UserGame_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGameAttributeValue` ADD CONSTRAINT `UserGameAttributeValue_user_game_id_fkey` FOREIGN KEY (`user_game_id`) REFERENCES `UserGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGameAttributeValue` ADD CONSTRAINT `UserGameAttributeValue_game_attribute_id_fkey` FOREIGN KEY (`game_attribute_id`) REFERENCES `GameAttribute`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGameCustomAttribute` ADD CONSTRAINT `UserGameCustomAttribute_user_game_id_fkey` FOREIGN KEY (`user_game_id`) REFERENCES `UserGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
