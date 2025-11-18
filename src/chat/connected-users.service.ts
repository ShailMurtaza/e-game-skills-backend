// services/connected-users.service.ts
import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';

interface ConnectedUser {
    userId: number;
    socket: WebSocket;
}

@Injectable()
export class ConnectedUsersService {
    private connected = new Map<number, Set<WebSocket>>();

    add(userId: number, socket: WebSocket) {
        if (!this.connected.has(userId)) {
            this.connected.set(userId, new Set());
        }
        this.connected.get(userId)!.add(socket);
    }

    remove(userId: number, socket: WebSocket) {
        this.connected.get(userId)?.delete(socket);
        if (this.connected.get(userId)?.size === 0) {
            this.connected.delete(userId);
        }
    }

    getSockets(userId: number): Set<WebSocket> {
        return this.connected.get(userId) || new Set();
    }

    isOnline(userId: number): boolean {
        return this.connected.has(userId);
    }
}
