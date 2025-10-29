import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('verifyOtp')
    async verifyOtp(
        @Body('email') email: string,
        @Body('otp', ParseIntPipe) otp: number,
    ) {
        return this.authService.verifyOtp(email, otp);
    }
}
