import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [DatabaseModule, UsersModule],
    controllers: [ReportsController],
    providers: [ReportsService],
})
export class ReportsModule {}
