import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chats.service';
import { JwtGuard } from 'src/auth/jwt-guard';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('auth')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/chats')
  getChats(@Req() req) {
    return this.chatService.getAllChats(req.user.id);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(@Req() req, @Body() dto: CreateChatDto) {
    return this.chatService.createChat(req.user.id, dto);
  }
}
