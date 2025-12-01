import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MessagesService {
    constructor(private readonly databaseService: DatabaseService) {}
    async findAll(user_id: number) {
        const users = await this.databaseService.user.findMany({
            where: {
                OR: [
                    { received_messages: { some: { sender_id: user_id } } },
                    { sent_messages: { some: { receiver_id: user_id } } },
                ],
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                banned: true,
                received_messages: {
                    where: {
                        sender_id: user_id,
                    },
                    select: {
                        id: true,
                        content: true,
                        sender_id: true,
                        receiver_id: true,
                        read: true,
                        timestamp: true,
                    },
                    orderBy: {
                        timestamp: 'desc',
                    },
                },
                sent_messages: {
                    where: {
                        receiver_id: user_id,
                    },
                    select: {
                        id: true,
                        content: true,
                        sender_id: true,
                        receiver_id: true,
                        read: true,
                        timestamp: true,
                    },
                    orderBy: {
                        timestamp: 'desc',
                    },
                },
            },
        });
        return users.map((user) => {
            return {
                ...user,
                avatar: user.avatar
                    ? Buffer.from(user.avatar).toString('hex')
                    : null,
            };
        });
    }

    async unreadCount(user_id: number) {
        const unreadCounts = await this.databaseService.messages.groupBy({
            by: ['sender_id'],
            where: {
                receiver_id: user_id,
                read: false,
            },
            _count: {
                _all: true,
            },
        });
        const formatedUnreadCounts = unreadCounts.map((data) => ({
            sender_id: data.sender_id,
            unreadMsgs: data._count._all,
        }));
        return formatedUnreadCounts;
    }
}
