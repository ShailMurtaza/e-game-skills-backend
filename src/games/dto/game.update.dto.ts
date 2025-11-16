import { Type } from 'class-transformer';
import {
    IsArray,
    IsNumber,
    ValidateNested,
    IsString,
    IsOptional,
} from 'class-validator';
import { GameAttribute } from 'generated/prisma/client';

interface GameAttributeWithAction extends GameAttribute {
    action: 'create' | 'update' | 'delete';
}

class GameAttributeUpdateDto {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    name: string;

    @IsNumber()
    @IsOptional()
    game_id: number;

    @IsString()
    action: 'create' | 'update' | 'delete';
}

export default class GameUpdateDto {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GameAttributeUpdateDto)
    attributes: GameAttributeUpdateDto[];
}
