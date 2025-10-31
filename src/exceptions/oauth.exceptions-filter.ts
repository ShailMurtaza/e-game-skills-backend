import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch(Error)
export class OAuthExceptionFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) {}
    catch(exception: any, host: ArgumentsHost) {
        console.log(exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const frontend_url =
            this.configService.getOrThrow<string>('FRONTEND_URL');
        if (
            exception.code === 'invalid_grant' ||
            exception.message?.includes?.('invalid_grant') ||
            exception.response?.error === 'invalid_grant' ||
            exception.message?.includes?.('Bad Request')
        ) {
            return response.redirect(
                302,
                frontend_url +
                    '/auth?action=signin&error=OAuth provider rejected the request. Please try again.',
            );
            // return response.status(400).json({
            //     message:
            //         'OAuth provider rejected the request. Please try again.',
            //     error: 'invalid_grant',
            // });
        } else if (
            exception.response?.message?.includes?.('Email already in use')
        ) {
            return response.redirect(
                302,
                frontend_url +
                    '/auth?action=signin&error=Email already in use by other signin method',
            );
        }

        // Let other errors pass through
        throw exception;
    }
}
