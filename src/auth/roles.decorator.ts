import { SetMetadata } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';

export const Roles_Key = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(Roles_Key, roles);
