import {
    Controller,
    UseGuards,
    Get,
    Query,
    DefaultValuePipe,
    Post,
    Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { UpdateUserDto } from 'src/users/dto/create-user.dto';

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
}
