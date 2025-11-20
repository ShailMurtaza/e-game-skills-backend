import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}
    @Get()
    async findAll(@Req() req) {
        return await this.messagesService.findAll(req.user.userId);
    }

    @Get('unread')
    async unreadCount(@Req() req) {
        return {
            count: await this.messagesService.unreadCount(req.user.userId),
        };
    }
}
