import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAnnouncementDto {
    @IsNumber()
    id: number;

    @IsString()
    title: string;

    @IsString()
    announcement: string;

    @IsString()
    date: string;
}

export class CreateAnnouncementDto {
    @IsString()
    title: string;

    @IsString()
    announcement: string;

    @IsString()
    date: string;
}
