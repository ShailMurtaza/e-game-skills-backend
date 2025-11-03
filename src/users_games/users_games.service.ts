import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import {
    UserGameCreateInput,
    UserGameUpdateInput,
    UserGameWhereInput,
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
        });
    }

    findOne(id: number) {
        return this.databaseService.userGame.findUnique({
            where: {
                id,
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
}
