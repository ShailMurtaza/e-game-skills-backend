import { IsNumber, IsObject, IsString } from 'class-validator';

export default class SearchDataDto {
    @IsString()
    name: string;

    @IsNumber()
    game_id: number;

    @IsObject()
    attributes: Record<number, string>;
}
