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
    Res,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import multer from 'multer';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

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

    @Get('profile/:userId')
    async getProfile(@Param('userId', ParseIntPipe) userId: number) {
        return await this.usersService.getPublicProfileData(userId);
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.pending)
    @Get('set-role/:role')
    async setRole(@Req() req: any, @Param('role') role: Role) {
        await this.usersService.update(req.user.userId, { role: role });
        return { message: 'Role has been set', role: role };
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

    @UseGuards(JwtAuthGuard)
    @Post('update_profile')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: multer.memoryStorage(),
            fileFilter: (req, file, cb) => {
                const allowedTypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/webp',
                    'image/gif',
                ];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(
                        new Error(
                            'Invalid file type. Only JPEG, PNG, WebP allowed.',
                        ),
                        false,
                    );
                }
            },
            limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
        }),
    )
    async updateProfile(
        @UploadedFile() file: Express.Multer.File | undefined,
        @Body() dto: UpdateUserProfileDto,
        @Req() req: any,
    ) {
        const userId = req.user?.userId;
        if (!userId) throw new BadRequestException('User not authenticated');

        const result = await this.usersService.updateProfile(userId, dto, file);
        return result;
    }

    @Get('avatar/:name')
    async avatar(@Param('name') name: string, @Res() res) {
        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            throw new NotFoundException('Invalid filename');
        }
        const filePath = join(process.cwd(), 'uploads/avatars', `${name}.webp`);

        try {
            await fs.access(filePath);
        } catch {
            throw new NotFoundException('Avatar not found');
        }
        return res.sendFile(filePath);
    }
}
