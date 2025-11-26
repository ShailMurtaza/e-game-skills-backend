import { IsNumber } from 'class-validator';

export class ConversationGetDto {
    @IsNumber()
    sender_id: number;

    @IsNumber()
    receiver_id: number;
}
