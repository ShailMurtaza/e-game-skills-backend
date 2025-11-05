import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import {
    UserGameCreateInput,
    UserGameUpdateInput,
    WinsLossCreateWithoutUser_gameInput,
} from 'generated/prisma/models';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersGamesService {
    constructor(private readonly databaseService: DatabaseService) {}

    create(userGameCreateInput: UserGameCreateInput) {
        return this.databaseService.userGame.create({
            data: userGameCreateInput,
        });
    }

    async findAll(filters?: Record<string, any>) {
        return this.databaseService.userGame.findMany({
            where: {
                user_id: filters?.user_id,
                game_id: filters?.game_id,
            },
            include: {
                attribute_values: {
                    include: {
                        game_attribute: true,
                    },
                },
                custom_attributes: true,
                Links: true,
                WinsLoss: true,
                game: true,
            },
        });
    }

    findOne(filters?: Record<string, any>) {
        return this.databaseService.userGame.findUnique({
            where: {
                id: filters?.id ? Number(filters.id) : undefined,
                user_id_game_id: {
                    // Matches @@unique name
                    user_id: filters?.user_id,
                    game_id: filters?.game_id,
                },
            },
        });
    }

    update(id: number, userGameUpdateInput: UserGameUpdateInput) {
        return this.databaseService.userGame.update({
            where: {
                id,
            },
            data: userGameUpdateInput,
        });
    }

    async remove(userGameId: number, currentUserId: number) {
        // 1. Find the UserGame with user_id
        const userGame = await this.databaseService.userGame.findUnique({
            where: { id: userGameId },
            select: { user_id: true },
        });

        // 2. Not found → 404
        if (!userGame) {
            throw new NotFoundException(
                `UserGame with ID ${userGameId} not found`,
            );
        }

        // 3. Ownership check
        if (userGame.user_id !== currentUserId) {
            throw new ForbiddenException(
                'You can only delete your own game progress',
            );
        }

        // 4. Delete (with cascade if needed)
        return this.databaseService.userGame.delete({
            where: { id: userGameId },
        });
    }

    async removeUsingGameId(game_id: number, userId: number) {
        // 1. Find the UserGame with user_id
        const userGame = await this.findOne({
            user_id: userId,
            game_id: game_id,
        });

        // 2. Not found → 404
        if (!userGame) {
            throw new NotFoundException('Not Found');
        }

        // 3. Delete (with cascade if needed)
        return this.databaseService.userGame.delete({
            where: { id: userGame.id },
        });
    }

    async SaveAllData(userId: number, allData: any) {
        var user_game: any = await this.findOne({
            user_id: userId,
            game_id: allData.game_id,
        });
        // Delete usergame if it already exists
        if (user_game) {
            await this.remove(user_game.id, userId);
        }

        // Set attribute values
        const attribute_values = allData.UserGameAttributeValue.map((attr) => {
            return { game_attribute_id: attr.id, value: attr.value };
        });
        // Set wins_loss
        var wins_loss: WinsLossCreateWithoutUser_gameInput[] = [];
        allData.Wins.map((win) => {
            const date = new Date(win.name);
            if (isNaN(date.getTime())) {
                return;
            }
            wins_loss.push({
                date: date,
                value: Number(win.value),
                type: 'Win',
            });
        });
        allData.Loss.map((loss) => {
            const date = new Date(loss.name);
            if (isNaN(date.getTime())) {
                return;
            }
            wins_loss.push({
                date: date,
                value: Number(loss.value),
                type: 'Loss',
            });
        });

        await this.databaseService.userGame.create({
            data: {
                user: { connect: { id: userId } },
                game: { connect: { id: allData.game_id } },

                // Create related records
                attribute_values: {
                    create: attribute_values,
                },
                custom_attributes: {
                    create: allData.UserGameCustomAttribute,
                },
                Links: {
                    create: allData.UserGameLinks,
                },
                WinsLoss: {
                    create: wins_loss,
                },
            },
        });

        return { message: 'Data Saved' };
    }
}
