import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
    CreateUserDto,
    ResetPasswordDto,
    UpdateUserDto,
} from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'generated/prisma/enums';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async create(@Body() createUserDto: CreateUserDto) {
        await this.usersService.createLocalUser(createUserDto);
        return { message: 'User created successfully' };
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.usersService.resetPassword(resetPasswordDto);
    }

    @Get()
    findAll(@Query() query: Record<string, any>) {
        return this.usersService.findAll(query);
    }

    @Post('verify')
    async Verify(@Body() user: { email: string; password: string }) {
        return this.usersService.verifyCredentials(user.email, user.password);
    }

    @Post('generate-otp')
    async generateOtp(@Body('email') email: string) {
        return this.usersService.generateOtp(email);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        return 'User Id: ' + req.user.userId;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.admin)
    @Get('admin')
    async getAdmin(@Req() req: any) {
        return 'Welcome Admin';
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne({ id: id });
    }
}
