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
import { DiscordAuthGuard } from './guards/discord-auth/discord-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    private FRONTEND_URL: string;
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        this.FRONTEND_URL =
            this.configService.getOrThrow<string>('FRONTEND_URL');
    }

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
    async googleCallback(@Req() req, @Res() res) {
        const result = await this.authService.OAuthLogin(req.user.id);
        if (!result)
            return res.redirect(`${this.FRONTEND_URL}/auth?action=signin`);
        this.setAuthCookie(res, result.accessToken);
        res.redirect(result.redirect);
    }

    @UseGuards(DiscordAuthGuard)
    @Get('discord/login')
    async discordLogin() {}

    @UseFilters(OAuthExceptionFilter)
    @UseGuards(DiscordAuthGuard)
    @Get('discord/callback')
    async discordCallback(@Req() req, @Res() res) {
        const result = await this.authService.OAuthLogin(req.user.id);
        if (!result)
            return res.redirect(`${this.FRONTEND_URL}/auth?action=signin`);
        this.setAuthCookie(res, result.accessToken);
        res.redirect(result.redirect);
    }

    private setAuthCookie(res: Response, token: string) {
        const isProduction =
            this.configService.getOrThrow('NODE_ENV') === 'production';

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: isProduction, // HTTPS only in prod
            sameSite: 'lax', // or 'strict'
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
    }
}
