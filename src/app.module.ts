import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RegionModule } from './region/region.module';
import { GamesModule } from './games/games.module';
import { UsersGamesModule } from './users_games/users_games.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        UsersModule,
        DatabaseModule,
        OtpModule,
        EmailModule,
        AuthModule,
        RegionModule,
        GamesModule,
        UsersGamesModule,
    ],
    controllers: [AppController],
    providers: [AppService, DatabaseService],
})
export class AppModule {}
