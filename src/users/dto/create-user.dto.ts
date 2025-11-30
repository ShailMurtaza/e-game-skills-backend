import {
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsBoolean,
    IsNumber,
} from 'class-validator';
import { Provider, Role } from 'src/generated/prisma/client';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsInt()
    region_id?: number;

    @IsOptional()
    @IsBoolean()
    verified?: boolean;

    @IsOptional()
    @IsBoolean()
    banned?: boolean;

    @IsOptional()
    @IsEnum(Provider)
    provider?: Provider;

    @IsOptional()
    @IsString()
    providerId?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsOptional()
    @IsInt()
    region_id?: number;

    @IsOptional()
    @IsBoolean()
    verified?: boolean;

    @IsOptional()
    @IsBoolean()
    banned?: boolean;

    @IsOptional()
    @IsEnum(Provider)
    provider?: Provider;

    @IsOptional()
    @IsString()
    providerId?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsNumber()
    otp: number;
}
