import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/generated/prisma/enums';
import { Roles_Key } from 'src/auth/roles.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly usersService: UsersService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            Roles_Key,
            [context.getHandler(), context.getClass()],
        );
        const decodedJwt = context.switchToHttp().getRequest().user;
        const user = await this.usersService.findOne({ id: decodedJwt.userId });
        if (!user) throw new BadRequestException('User Not Found');
        const hasRequiredRole = requiredRoles.some(
            (role) => user.role === role,
        );
        return hasRequiredRole;
    }
}
