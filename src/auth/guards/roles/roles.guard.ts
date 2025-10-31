import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma/enums';
import { Roles_Key } from 'src/auth/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            Roles_Key,
            [context.getHandler(), context.getClass()],
        );
        const user = context.switchToHttp().getRequest().user;
        const hasRequiredRole = requiredRoles.some(
            (role) => user.role === role,
        );
        return hasRequiredRole;
    }
}
