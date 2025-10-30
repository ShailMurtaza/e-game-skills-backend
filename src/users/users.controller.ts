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
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
    CreateUserDto,
    ResetPasswordDto,
    UpdateUserDto,
} from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async create(@Body() createUserDto: CreateUserDto) {
        await this.usersService.create(createUserDto);
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
    async findOne(@Body() user: { email: string; password: string }) {
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
}
