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
    Put,
} from '@nestjs/common';
import { UsersGamesService } from './users_games.service';
import type {
    UserGameCreateInput,
    UserGameUpdateInput,
} from 'src/generated/prisma/models';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import SearchDataDto from './dto/search.dto';

@Controller('users-games')
export class UsersGamesController {
    constructor(private readonly usersGamesService: UsersGamesService) {}

    @Post()
    create(@Body() userGameCreateInput: UserGameCreateInput) {
        return this.usersGamesService.create(userGameCreateInput);
    }

    @Post('search')
    async search(@Body() data: SearchDataDto) {
        return await this.usersGamesService.search(data);
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
    @Put('saveAllData')
    saveAllData(@Body() allData: any, @Req() req) {
        return this.usersGamesService.SaveAllData(req.user.userId, allData);
    }

    @Get('allData/:user_id')
    getUserGames(@Param('user_id', ParseIntPipe) userId: number) {
        return this.usersGamesService.findAll({ user_id: userId });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersGamesService.findOne({ id: +id });
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() userGameUpdateInput: UserGameUpdateInput,
    ) {
        return this.usersGamesService.update(id, userGameUpdateInput);
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
