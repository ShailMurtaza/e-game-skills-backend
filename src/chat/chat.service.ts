import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ChatService {
    constructor(private readonly databaseService: DatabaseService) {}
    async create(data: {
        senderId: number;
        receiverId: number;
        content: string;
    }) {
        const user = await this.databaseService.user.findUnique({
            where: {
                id: data.receiverId,
            },
        });
        if (!user) return { message: "User doesn't exist", error: true };
        const message = await this.databaseService.messages.create({
            data: {
                content: data.content,
                sender: { connect: { id: data.senderId } },
                receiver: { connect: { id: data.receiverId } },
            },
            include: {
                receiver: {
                    select: { id: true, username: true },
                },
            },
        });
        return { message: null, erorr: false, data: message };
    }
}
