import {
    Body,
    Controller,
    Get,
    Post,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    UseGuards,
    Req,
    Res,
    UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { OAuthExceptionFilter } from 'src/exceptions/oauth.exceptions-filter';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() loginDto: LoginDto) {
        return this.authService.localLogin(loginDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('verify-user')
    async verifyOtp(
        @Body('email') email: string,
        @Body('otp', ParseIntPipe) otp: number,
    ) {
        return this.authService.verifyUser(email, otp);
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    async googleLogin() {}

    @UseFilters(OAuthExceptionFilter)
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@Req() req) {
        const response = await this.authService.OAuthLogin(req.user.id);
        return response;
    }
}
