/*
  Warnings:

  - You are about to drop the `GameAttributes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `GameAttributes` DROP FOREIGN KEY `GameAttributes_game_id_fkey`;

-- DropTable
DROP TABLE `GameAttributes`;

-- CreateTable
CREATE TABLE `GameAttribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `game_id` INTEGER NOT NULL,
    `datatype` ENUM('text', 'number', 'date') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `game_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGameAttributeValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `textValue` VARCHAR(50) NULL,
    `numberValue` DOUBLE NULL,
    `dateValue` DATETIME(3) NULL,
    `user_game_id` INTEGER NOT NULL,
    `game_attribute_id` INTEGER NOT NULL,

    UNIQUE INDEX `UserGameAttributeValue_user_game_id_game_attribute_id_key`(`user_game_id`, `game_attribute_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGameCustomAttribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_game_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `value` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameAttribute` ADD CONSTRAINT `GameAttribute_game_id_fkey` FOREIGN KEY (`game_id`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGameAttributeValue` ADD CONSTRAINT `UserGameAttributeValue_user_game_id_fkey` FOREIGN KEY (`user_game_id`) REFERENCES `UserGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGameAttributeValue` ADD CONSTRAINT `UserGameAttributeValue_game_attribute_id_fkey` FOREIGN KEY (`game_attribute_id`) REFERENCES `GameAttribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGameCustomAttribute` ADD CONSTRAINT `UserGameCustomAttribute_user_game_id_fkey` FOREIGN KEY (`user_game_id`) REFERENCES `UserGame`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
