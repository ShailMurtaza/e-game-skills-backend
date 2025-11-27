-- CreateTable
CREATE TABLE `AIReports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `target_message_id` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_reviewed` BOOLEAN NOT NULL DEFAULT false,
    `toxicity` INTEGER NOT NULL,

    UNIQUE INDEX `AIReports_target_message_id_key`(`target_message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AIReports` ADD CONSTRAINT `AIReports_target_message_id_fkey` FOREIGN KEY (`target_message_id`) REFERENCES `Messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
