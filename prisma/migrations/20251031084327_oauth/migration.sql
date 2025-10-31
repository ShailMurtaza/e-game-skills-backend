-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('player', 'team', 'admin', 'pending') NOT NULL DEFAULT 'pending';
