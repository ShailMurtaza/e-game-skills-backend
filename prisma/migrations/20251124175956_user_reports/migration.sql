-- AddForeignKey
ALTER TABLE `UserReports` ADD CONSTRAINT `UserReports_reporter_id_fkey` FOREIGN KEY (`reporter_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserReports` ADD CONSTRAINT `UserReports_target_id_fkey` FOREIGN KEY (`target_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
