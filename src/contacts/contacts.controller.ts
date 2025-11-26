import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/contacts.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/auth/roles.decorator';

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}

    @Post()
    async createContactMessage(@Body() data: CreateContactDto) {
        const result = await this.contactsService.create(data);
        if (result) return { message: 'Your message have been sent' };
    }

    @Roles(Role.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getContacts(@Query('page', new DefaultValuePipe(1)) page: number) {
        return await this.contactsService.read(page);
    }
}
