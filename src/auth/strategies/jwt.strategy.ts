import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // 1. Try cookie first
                (request: Request) => {
                    return request?.cookies?.accessToken || null;
                },
                // 2. Fallback to Authorization header
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    // It receives decoded payload and return it. Its purpose is not to decode or validate JWT token itself.
    async validate(payload: any) {
        return {
            userId: payload.id,
        };
    }
}
