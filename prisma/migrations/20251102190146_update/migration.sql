/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `avatar_url`,
    ADD COLUMN `avatar` BINARY(16) NULL,
    MODIFY `username` VARCHAR(50) NOT NULL,
    MODIFY `description` TEXT NULL;
