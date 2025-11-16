import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import type { GameCreateInput } from 'generated/prisma/models';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import GameUpdateDto from './dto/game.update.dto';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}
    @Roles(Role.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
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

    @Roles(Role.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('')
    update(@Body() gameUpdateInput: GameUpdateDto) {
        return this.gamesService.updateMany(gameUpdateInput);
    }

    @Roles(Role.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.gamesService.remove(+id);
    }
}
