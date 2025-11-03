import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { GamesService } from './games.service';
import type { GameCreateInput, GameUpdateInput } from 'generated/prisma/models';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @Post()
    create(@Body() gameCreateInput: GameCreateInput) {
        return this.gamesService.create(gameCreateInput);
    }

    @Get()
    findAll() {
        return this.gamesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gamesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() gameUpdateInput: GameUpdateInput) {
        return this.gamesService.update(+id, gameUpdateInput);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.gamesService.remove(+id);
    }
}
