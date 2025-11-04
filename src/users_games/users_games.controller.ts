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
    ParseIntPipe,
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

    @UseGuards(JwtAuthGuard)
    @Post('allData')
    saveLinks(@Body() allData: any, @Req() req) {
        return this.usersGamesService.SaveAllData(req.user.userId, allData);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersGamesService.findOne({ id: +id });
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
    @Delete(':game_id')
    async remove(@Param('game_id', ParseIntPipe) game_id: number, @Req() req) {
        if (
            await this.usersGamesService.removeUsingGameId(
                game_id,
                req.user.userId,
            )
        )
            return { message: 'Deleted Game Successfuly' };
        else throw new Error('Failed');
    }
}
