import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

// Export DatabaseService to use DatabaseService in users module which will import it
@Module({
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
