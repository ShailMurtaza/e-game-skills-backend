import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BannedGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const decodedJwt = context.switchToHttp().getRequest().user;
        const user = await this.usersService.findOne({ id: decodedJwt.userId });
        if (!user) throw new BadRequestException('User Not Found');

        const isNotBanned = !user.banned;
        return isNotBanned;
    }
}
