import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Role } from 'generated/prisma/client';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsInt()
    region_id?: number;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    password?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsInt()
    region_id?: number;
}
