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
        return this.databaseService.messages.create({
            data: {
                content: data.content,
                sender: { connect: { id: data.senderId } },
                receiver: { connect: { id: data.receiverId } },
            },
            include: {
                sender: {
                    select: { id: true, username: true },
                },
                receiver: {
                    select: { id: true, username: true },
                },
            },
        });
    }
}
