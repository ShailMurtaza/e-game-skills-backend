import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
    CreateAnnouncementDto,
    UpdateAnnouncementDto,
} from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
    constructor(private readonly databaseService: DatabaseService) {}
    async create(createAnnouncementDto: CreateAnnouncementDto) {
        return await this.databaseService.announcements.create({
            data: {
                ...createAnnouncementDto,
                date: new Date(createAnnouncementDto.date),
            },
        });
    }

    async findAll() {
        return await this.databaseService.announcements.findMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} announcement`;
    }

    async update(updateAnnouncementDto: UpdateAnnouncementDto) {
        return await this.databaseService.announcements.update({
            where: {
                id: updateAnnouncementDto.id,
            },
            data: {
                ...updateAnnouncementDto,
                date: new Date(updateAnnouncementDto.date),
            },
        });
    }

    async remove(id: number) {
        return await this.databaseService.announcements.delete({
            where: { id },
        });
    }
}
