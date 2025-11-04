-- CreateTable
CREATE TABLE `UserGameLinks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_game_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `value` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WinsLoss` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_game_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `value` INTEGER NOT NULL,
    `type` ENUM('Win', 'Loss') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserGameLinks` ADD CONSTRAINT `UserGameLinks_user_game_id_fkey` FOREIGN KEY (`user_game_id`) REFERENCES `UserGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WinsLoss` ADD CONSTRAINT `WinsLoss_user_game_id_fkey` FOREIGN KEY (`user_game_id`) REFERENCES `UserGame`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
