import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ConnectedUsersService } from './connected-users.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesModule } from 'src/messages/messages.module';
import { AireportsModule } from 'src/aireports/aireports.module';

@Module({
    imports: [
        DatabaseModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
        MessagesModule,
        AireportsModule,
    ],
    providers: [ChatGateway, ChatService, ConnectedUsersService],
})
export class ChatModule {}
