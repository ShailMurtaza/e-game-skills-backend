import { IsString } from 'class-validator';

export class CreateContactDto {
    @IsString()
    email: string;

    @IsString()
    name: string;

    @IsString()
    message: string;
}
