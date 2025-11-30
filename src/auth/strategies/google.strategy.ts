import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Provider } from 'src/generated/prisma/enums';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.getOrThrow<string>(
                'GOOGLE_CLIENT_SECRET',
            ),
            callbackURL: configService.getOrThrow<string>(
                'GOOGLE_CALLBACK_URL',
            ),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        const user = await this.authService.validateOAuthUser({
            email: profile.emails[0].value,
            username: profile.displayName,
            provider: Provider.google,
            providerId: profile.id,
        });

        done(null, user);
    }
}
