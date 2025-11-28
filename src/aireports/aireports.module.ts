import { Module } from '@nestjs/common';
import { AireportsService } from './aireports.service';
import { ConfigModule, registerAs } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AireportsController } from './aireports.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [
                registerAs('hf', () => ({
                    token: process.env.HUGGINGFACE_API_KEY!,
                    model: 'unitary/unbiased-toxic-roberta',
                })),
            ],
            isGlobal: true,
        }),
        DatabaseModule,
        UsersModule,
    ],
    providers: [AireportsService],
    exports: [AireportsService],
    controllers: [AireportsController],
})
export class AireportsModule {}
