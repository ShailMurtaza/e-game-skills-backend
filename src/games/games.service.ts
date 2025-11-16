import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GameCreateInput, GameUpdateInput } from 'generated/prisma/models';
import GameUpdateDto from './dto/game.update.dto';
import { GameWithAttributes } from './dto/game.dto';

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
            include: {
                attributes: true,
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

    async updateMany(data: GameUpdateDto) {
        let game: GameWithAttributes | null = null;
        if (data?.id) {
            await this.databaseService.$transaction(async (tx) => {
                await tx.game.update({
                    where: {
                        id: data.id,
                    },
                    data: {
                        name: data.name,
                    },
                });

                for (const attr of data.attributes) {
                    if (attr.action === 'create') {
                        await tx.gameAttribute.create({
                            data: {
                                name: attr.name,
                                game_id: attr.game_id,
                            },
                        });
                    } else if (attr.action === 'update') {
                        await tx.gameAttribute.update({
                            where: {
                                id: attr.id,
                            },
                            data: {
                                name: attr.name,
                            },
                        });
                    } else if (attr.action === 'delete') {
                        await tx.gameAttribute.delete({
                            where: {
                                id: attr.id,
                            },
                        });
                    }
                }
            });
            game = await this.findOne(data.id);
        } else {
            const createGame: GameCreateInput = {
                name: data.name,
                attributes: {
                    createMany: {
                        data: data.attributes.map((attr) => ({
                            name: attr.name,
                        })),
                    },
                },
            };
            game = await this.databaseService.game.create({
                data: createGame,
                include: {
                    attributes: true,
                },
            });
        }
        return { message: 'Game Saved', game: game };
    }
}
