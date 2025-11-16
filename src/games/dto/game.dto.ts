import { GameGetPayload } from 'generated/prisma/models';

export type GameWithAttributes = GameGetPayload<{
    include: { attributes: true };
}>;
