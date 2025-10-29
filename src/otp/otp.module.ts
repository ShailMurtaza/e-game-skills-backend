import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';

// Export OtpService to use OtpService in users module which will import it
@Module({
    providers: [OtpService],
    exports: [OtpService],
})
export class OtpModule {}
