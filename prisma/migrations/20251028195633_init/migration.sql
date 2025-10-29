-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_region_id_fkey`;

-- DropIndex
DROP INDEX `User_region_id_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `region_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `Region`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
