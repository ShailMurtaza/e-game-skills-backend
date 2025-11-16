import { Controller, Get } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
    constructor(private readonly announcementsService: AnnouncementsService) {}

    @Get()
    async findAll() {
        return await this.announcementsService.findAll();
    }
}
