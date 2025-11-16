import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { AnnouncementsModule } from 'src/announcements/announcements.module';

@Module({
    imports: [DatabaseModule, UsersModule, AnnouncementsModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}
