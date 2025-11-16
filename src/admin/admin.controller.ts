import {
    Controller,
    UseGuards,
    Get,
    Query,
    DefaultValuePipe,
    Post,
    Body,
    Patch,
    Delete,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { UpdateUserDto } from 'src/users/dto/create-user.dto';
import {
    CreateAnnouncementDto,
    UpdateAnnouncementDto,
} from 'src/announcements/dto/create-announcement.dto';
import { AnnouncementsService } from 'src/announcements/announcements.service';

@Roles(Role.admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly announcementService: AnnouncementsService,
    ) {}
    @Get()
    getAdmin() {
        return 'Welcome Admin';
    }

    @Get('user_count')
    async getUserCount() {
        return await this.adminService.getUserCount();
    }

    @Post('users')
    async getUsers(
        @Body() filter: Record<string, any>,
        @Query('page', new DefaultValuePipe(1)) page: number,
    ) {
        page = Math.max(1, page);
        return await this.adminService.getUsers(page, filter);
    }

    @Post('user/update')
    async UpdateUser(@Body() data: UpdateUserDto) {
        const result = await this.adminService.updateUser(data);
        if (result) return { message: 'User Updated' };
    }

    @Post('announcement')
    async createAnnouncement(@Body() data: CreateAnnouncementDto) {
        const result = await this.announcementService.create(data);
        if (result) return { message: 'Created', announcement: result };
    }

    @Patch('announcement')
    async updateAnnouncement(@Body() data: UpdateAnnouncementDto) {
        const result = await this.announcementService.update(data);
        if (result) return { message: 'Updated', announcement: data };
    }

    @Delete('announcement/:id')
    async deleteAnnouncement(@Param('id', ParseIntPipe) id: number) {
        const result = await this.announcementService.remove(id);
        if (result) return { message: 'Announcement Deleted' };
    }
}
