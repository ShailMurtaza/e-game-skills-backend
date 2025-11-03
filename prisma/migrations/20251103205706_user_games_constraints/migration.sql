/*
  Warnings:

  - A unique constraint covering the columns `[user_id,game_id]` on the table `UserGame` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserGame_user_id_game_id_key` ON `UserGame`(`user_id`, `game_id`);
