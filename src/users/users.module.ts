import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OtpModule } from 'src/otp/otp.module';

@Module({
    imports: [DatabaseModule, OtpModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
