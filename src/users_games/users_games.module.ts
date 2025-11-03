import { Module } from '@nestjs/common';
import { UsersGamesService } from './users_games.service';
import { UsersGamesController } from './users_games.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UsersGamesController],
    providers: [UsersGamesService],
})
export class UsersGamesModule {}
