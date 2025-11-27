import { Module } from '@nestjs/common';
import { AireportsService } from './aireports.service';
import { ConfigModule, registerAs } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

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
    ],
    providers: [AireportsService],
    exports: [AireportsService],
})
export class AireportsModule {}
