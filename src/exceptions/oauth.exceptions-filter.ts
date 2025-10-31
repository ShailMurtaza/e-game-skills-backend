import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class OAuthExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception.message?.includes?.('invalid_grant')) {
            return response.redirect('/login?error=oauth_invalid_grant');
        }

        if (exception.message?.includes?.('Bad Request')) {
            return response.status(400).json({
                message:
                    'OAuth provider rejected the request. Please try again.',
                error: 'invalid_grant',
            });
        }

        // Let other errors pass through
        throw exception;
    }
}
