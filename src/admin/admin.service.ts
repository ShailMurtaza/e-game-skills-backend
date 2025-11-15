import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminService {
    private readonly users_per_page: number = 3;
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

    async getUsers(page: number) {
        const total_users = await this.databaseService.user.count();
        const max_pages = Math.ceil(total_users / this.users_per_page);
        if (page > max_pages)
            throw new NotFoundException('Invalid Page number');
        const users = await this.databaseService.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                notes: true,
                banned: true,
            },
            take: this.users_per_page,
            skip: (page - 1) * this.users_per_page,
            orderBy: {
                id: 'asc',
            },
        });
        return {
            users: users,
            max_pages: max_pages,
        };
    }
}
