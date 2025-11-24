import { IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
    @IsNumber()
    user_id: number;

    @IsString()
    reason: string;

    @IsString()
    description: string;
}
