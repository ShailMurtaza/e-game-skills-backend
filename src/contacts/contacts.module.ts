import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [DatabaseModule, UsersModule],
    controllers: [ContactsController],
    providers: [ContactsService],
})
export class ContactsModule {}
