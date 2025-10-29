import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

// Export EmailService to use EmailService in users module which will import it
@Module({
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
