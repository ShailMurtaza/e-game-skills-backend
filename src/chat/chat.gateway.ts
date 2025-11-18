import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { ConnectedUsersService } from './connected-users.service';
import { ChatService } from './chat.service';
import { from, map, Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { IncomingMessage } from 'http';

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
        console.log('Cookies received:', cookies);

        const token = cookies['accessToken'];

        if (!token) {
            client.close(1008, 'Unauthorized: Missing token');
            return;
        }

        try {
            const payload = this.jwtService.verify(token);
            console.log(payload);
            client.user = payload; // attach user
            this.connectedUsers.add(payload.id, client);
            console.log(`User ${payload.id} connected via WS`);
        } catch (err) {
            console.log(err, 'Invalid/expired token');
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
        @MessageBody() data: any,
        @ConnectedSocket() client: WebSocket & { user: { id: number } },
    ) {
        const senderId = client.user.id;

        // 1. Save message to DB
        const savedMessage = await this.messagesService.create({
            senderId,
            receiverId: data.toUserId,
            content: data.content,
        });

        const payload = {
            id: savedMessage.id,
            content: savedMessage.content,
            senderId,
            receiverId: data.toUserId,
        };

        // 2. Send to receiver if online
        const receiverSockets = this.connectedUsers.getSockets(data.toUserId);
        for (const socket of receiverSockets) {
            socket.send(JSON.stringify({ event: 'newMessage', data: payload }));
        }

        // 3. Send back acknowledgment to sender
        client.send(JSON.stringify({ event: 'messageSent', data: payload }));

        // 4. If receiver offline → will see when they come online (via REST API)
    }
}
