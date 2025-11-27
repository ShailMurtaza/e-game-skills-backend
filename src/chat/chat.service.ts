import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatedMessage } from 'src/messages/dto/create-message.dto';

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
        const message: CreatedMessage =
            await this.databaseService.messages.create({
                data: {
                    content: data.content,
                    sender: { connect: { id: data.senderId } },
                    receiver: { connect: { id: data.receiverId } },
                },
                include: {
                    receiver: {
                        select: { id: true, username: true, avatar: true },
                    },
                    sender: {
                        select: { id: true, username: true, avatar: true },
                    },
                },
            });

        const receiver_avatar = message.receiver.avatar
            ? Buffer.from(message.receiver.avatar).toString('hex')
            : null;
        const sender_avatar = message.sender.avatar
            ? Buffer.from(message.sender.avatar).toString('hex')
            : null;
        return {
            message: null,
            erorr: false,
            data: {
                ...message,
                receiver: { ...message.receiver, avatar: receiver_avatar },
                sender: { ...message.sender, avatar: sender_avatar },
            },
        };
    }

    async setRead(msg_user_id: number, user_id: number) {
        await this.databaseService.messages.updateMany({
            where: {
                AND: [
                    {
                        receiver_id: user_id,
                    },
                    {
                        sender_id: msg_user_id,
                    },
                ],
            },
            data: {
                read: true,
            },
        });
    }
}
