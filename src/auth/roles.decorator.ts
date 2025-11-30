import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';

export const Roles_Key = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(Roles_Key, roles);
