import { GameGetPayload } from 'src/generated/prisma/models';

export type GameWithAttributes = GameGetPayload<{
    include: { attributes: true };
}>;
