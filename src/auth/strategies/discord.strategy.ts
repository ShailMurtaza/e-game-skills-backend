import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-discord';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Provider } from 'src/generated/prisma/enums';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.getOrThrow<string>('DISCORD_CLIENT_ID'),
            clientSecret: configService.getOrThrow<string>(
                'DISCORD_CLIENT_SECRET',
            ),
            callbackURL: configService.getOrThrow<string>(
                'DISCORD_CALLBACK_URL',
            ),
            scope: ['identify', 'email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        const user = await this.authService.validateOAuthUser({
            email: profile.email,
            username: profile.username ?? profile.global_name,
            provider: Provider.discord,
            providerId: profile.id,
        });

        done(null, user);
    }
}
