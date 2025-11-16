import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [DatabaseModule, UsersModule],
    controllers: [GamesController],
    providers: [GamesService],
})
export class GamesModule {}
