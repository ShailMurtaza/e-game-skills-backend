/*
  Warnings:

  - You are about to drop the column `region_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_region_id_fkey`;

-- DropIndex
DROP INDEX `User_region_id_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `region_id`,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `region` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Region`;
