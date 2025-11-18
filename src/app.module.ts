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
import { GamesModule } from './games/games.module';
import { UsersGamesModule } from './users_games/users_games.module';
import { AdminModule } from './admin/admin.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ChatModule } from './chat/chat.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        UsersModule,
        DatabaseModule,
        OtpModule,
        EmailModule,
        AuthModule,
        GamesModule,
        UsersGamesModule,
        AdminModule,
        AnnouncementsModule,
        ChatModule,
    ],
    controllers: [AppController],
    providers: [AppService, DatabaseService],
})
export class AppModule {}
