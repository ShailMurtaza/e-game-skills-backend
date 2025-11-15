import {
    Controller,
    UseGuards,
    Get,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Roles(Role.admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    @Get()
    getAdmin() {
        return 'Welcome Admin';
    }

    @Get('user_count')
    async getUserCount() {
        return await this.adminService.getUserCount();
    }

    @Get('users')
    async getUsers(@Query('page', new DefaultValuePipe(1)) page: number) {
        page = Math.max(1, page);
        return await this.adminService.getUsers(page);
    }
}
