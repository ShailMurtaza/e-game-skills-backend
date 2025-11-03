import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersGamesService } from './users_games.service';
import type {
    UserGameCreateInput,
    UserGameUpdateInput,
} from 'generated/prisma/models';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users-games')
export class UsersGamesController {
    constructor(private readonly usersGamesService: UsersGamesService) {}

    @Post()
    create(@Body() userGameCreateInput: UserGameCreateInput) {
        return this.usersGamesService.create(userGameCreateInput);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getUserGame(@Req() req) {
        const filter = {
            user_id: req.user.userId,
        };
        return this.usersGamesService.findAll(filter);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersGamesService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() userGameUpdateInput: UserGameUpdateInput,
    ) {
        return this.usersGamesService.update(+id, userGameUpdateInput);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.usersGamesService.remove(+id, req.user.userId);
    }
}
