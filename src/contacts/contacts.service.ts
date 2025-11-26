import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateContactDto } from './dto/contacts.dto';

@Injectable()
export class ContactsService {
    private readonly contacts_per_page = 3;
    constructor(private readonly databaseService: DatabaseService) {}
    async create(data: CreateContactDto) {
        return this.databaseService.contacts.create({ data: data });
    }

    async read(page: number) {
        const total_contacts = await this.databaseService.contacts.count();
        const max_pages = Math.ceil(total_contacts / this.contacts_per_page);
        if (page > max_pages)
            throw new NotFoundException('Invalid Page number');
        const contacts = await this.databaseService.contacts.findMany({
            take: this.contacts_per_page,
            skip: (page - 1) * this.contacts_per_page,
            orderBy: {
                timestamp: 'desc',
            },
        });
        return { max_pages: max_pages, contacts: contacts };
    }
}
