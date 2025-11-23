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
import { stringify } from 'querystring';

@WebSocketGateway(3002, { transports: ['websocket'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private connectedUsers: ConnectedUsersService,
        private messagesService: ChatService,
        private jwtService: JwtService,
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
            console.log(`User ${payload.id} connected via WS`);
        } catch (err) {
            // console.log(err, 'Invalid/expired token');
            client.close(1008, 'Unauthorized: Invalid token');
        }
    }

    handleDisconnect(client: WebSocket & { user?: { id: number } }) {
        if (client.user?.id) {
            this.connectedUsers.remove(client.user.id, client);
            console.log(`User ${client.user.id} disconnected`);
        }
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @MessageBody() data: { toUserId: number; content: string },
        @ConnectedSocket() client: WebSocket & { user: { id: number } },
    ) {
        const senderId = client.user.id;

        const result = await this.messagesService.create({
            senderId,
            receiverId: data.toUserId,
            content: data.content,
        });

        const receiverSockets = this.connectedUsers.getSockets(data.toUserId);
        for (const socket of receiverSockets) {
            socket.send(JSON.stringify({ event: 'newMessage', data: result }));
        }

        client.send(JSON.stringify({ event: 'messageSent', data: result }));
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
}
