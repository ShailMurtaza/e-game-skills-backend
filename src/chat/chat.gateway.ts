import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { ConnectedUsersService } from './connected-users.service';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { IncomingMessage } from 'http';
import { MessagesService } from 'src/messages/messages.service';
import { AireportsService } from 'src/aireports/aireports.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(3002, { transports: ['websocket'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly connectedUsers: ConnectedUsersService,
        private readonly chatService: ChatService,
        private readonly messagesService: MessagesService,
        private readonly jwtService: JwtService,
        private readonly aiReports: AireportsService,
        private readonly userService: UsersService,
    ) {}

    handleConnection(client: WebSocket & { user?: any }, req: IncomingMessage) {
        if (!req?.headers?.cookie) {
            console.log('No cookies in WebSocket upgrade request');
            client.close(1008, 'Unauthorized: No cookie');
            return;
        }

        const cookies = cookie.parse(req.headers.cookie);

        const token = cookies['accessToken'];

        if (!token) {
            client.close(1008, 'Unauthorized: Missing token');
            return;
        }

        try {
            const payload = this.jwtService.verify(token);
            client.user = payload; // attach user
            this.connectedUsers.add(payload.id, client);
        } catch (err) {
            // console.log(err, 'Invalid/expired token');
            client.close(1008, 'Unauthorized: Invalid token');
        }
    }

    handleDisconnect(client: WebSocket & { user?: { id: number } }) {
        if (client.user?.id) {
            this.connectedUsers.remove(client.user.id, client);
        }
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: { toUserId: number; content: string },
        @ConnectedSocket() client: WebSocket & { user: { id: number } },
    ) {
        const senderId = client.user.id;
        const receiverId = data.toUserId;
        const senderUser = await this.userService.findOne({ id: senderId });
        const receiverUser = await this.userService.findOne({ id: receiverId });

        if (!receiverUser.banned && !senderUser.banned) {
            const result = await this.chatService.create({
                senderId,
                receiverId: receiverId,
                content: data.content,
            });

            const receiverSockets = this.connectedUsers.getSockets(receiverId);
            for (const socket of receiverSockets) {
                socket.send(
                    JSON.stringify({ event: 'newMessage', data: result }),
                );
            }

            client.send(JSON.stringify({ event: 'messageSent', data: result }));

            if (result.data)
                this.aiReports.report(result.data.id, result.data.content);
        } else {
            client.send(
                JSON.stringify({
                    event: null,
                    data: {
                        error: true,
                        message: receiverUser.banned
                            ? 'Receiver is banned'
                            : 'You are banned',
                    },
                }),
            );
        }
    }

    @SubscribeMessage('isOnline')
    async handleIsOnline(
        @MessageBody() users: number[],
        @ConnectedSocket() client: WebSocket & { user: { id: number } },
    ) {
        if (users) {
            const result = users.map((id: number) => ({
                id: id,
                online: this.connectedUsers.isOnline(id),
            }));
            client.send(
                JSON.stringify({
                    event: 'isOnline',
                    data: {
                        error: false,
                        message: null,
                        data: result,
                    },
                }),
            );
        }
    }

    @SubscribeMessage('setRead')
    async setRead(
        @MessageBody() data: number,
        @ConnectedSocket() client: WebSocket & { user: { id: number } },
    ) {
        await this.chatService.setRead(data, client.user.id);
        const unreadMsg = await this.messagesService.unreadCount(
            client.user.id,
        );
        client.send(
            JSON.stringify({
                event: 'setUnread',
                data: {
                    error: false,
                    message: null,
                    data: unreadMsg,
                },
            }),
        );
    }
}
