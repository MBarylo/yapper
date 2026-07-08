import { Module } from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message])],
})
export class ChatsModule {}
