/*
  Warnings:

  - You are about to drop the column `datatype` on the `GameAttribute` table. All the data in the column will be lost.
  - You are about to drop the column `dateValue` on the `UserGameAttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `numberValue` on the `UserGameAttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `textValue` on the `UserGameAttributeValue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GameAttribute` DROP COLUMN `datatype`;

-- AlterTable
ALTER TABLE `UserGameAttributeValue` DROP COLUMN `dateValue`,
    DROP COLUMN `numberValue`,
    DROP COLUMN `textValue`,
    ADD COLUMN `value` VARCHAR(50) NULL;
