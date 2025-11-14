import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getUserCount() {
        const users_count = await this.databaseService.user.groupBy({
            by: ['role'],
            _count: {
                _all: true,
            },
        });
        const banned_users_count = await this.databaseService.user.count({
            where: {
                banned: true,
            },
        });
        const user_count_role = {};
        let total_users = 0;
        users_count.map((user) => {
            total_users += user._count._all;
            return (user_count_role[user.role] = user._count._all);
        });
        return {
            by_role: user_count_role,
            banned: banned_users_count,
            total: total_users,
        };
    }
}
