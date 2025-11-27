import { MessagesGetPayload } from 'generated/prisma/models';

export type CreatedMessage = MessagesGetPayload<{
    include: {
        sender: { select: { id: true; username: true; avatar: true } };
        receiver: { select: { id: true; username: true; avatar: true } };
    };
}>;
