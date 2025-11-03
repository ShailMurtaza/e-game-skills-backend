// Only for updating. So it shouldn't accept any other fields
import { IsOptional, IsString, IsNumber } from 'class-validator';
export class UpdateUserProfileDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    region_id?: number;
}
