// Only for updating. So it shouldn't accept any other fields
import { IsOptional, IsString } from 'class-validator';
export class UpdateUserProfileDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    region?: string;
}
