/*
  Warnings:

  - You are about to alter the column `toxicity` on the `AIReports` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `AIReports` MODIFY `toxicity` DOUBLE NOT NULL;
