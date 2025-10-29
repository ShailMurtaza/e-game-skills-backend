import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OtpModule } from 'src/otp/otp.module';

// import DatabaseModule and OtpModule to use them in users module
@Module({
    imports: [DatabaseModule, OtpModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
