import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GameCreateInput, GameUpdateInput } from 'generated/prisma/models';

@Injectable()
export class GamesService {
    constructor(private readonly databaseService: DatabaseService) {}

    create(gameCreateInput: GameCreateInput) {
        return this.databaseService.game.create({
            data: gameCreateInput,
        });
    }

    findAll() {
        return this.databaseService.game.findMany({
            include: {
                attributes: true,
            },
        });
    }

    findOne(id: number) {
        return this.databaseService.game.findUnique({
            where: {
                id: id,
            },
        });
    }

    update(id: number, gameUpdateInput: GameUpdateInput) {
        return this.databaseService.game.update({
            where: {
                id: id,
            },
            data: gameUpdateInput,
        });
    }

    remove(id: number) {
        return this.databaseService.game.delete({
            where: {
                id: id,
            },
        });
    }
}
