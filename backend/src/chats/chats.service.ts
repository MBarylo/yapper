import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllChats(userId: string) {
    return await this.chatRepository.find({
      relations: {
        participants: true,
      },
      where: {
        participants: {
          id: userId,
        },
      },
    });
  }

  async getById(chatId: string) {
    const chat = await this.chatRepository.findOneBy({
      id: chatId,
    });
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat) return chat;
  }

  async createChat(userId: string, dto: CreateChatDto): Promise<Chat> {
    // 1. Знайти поточного користувача
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Знайти другого користувача
    const participant = await this.userRepository.findOneBy({
      id: dto.participantId,
    });
    if (!participant) {
      throw new NotFoundException('User not found');
    }
    if (user.id === participant.id) {
      throw new BadRequestException('Cannot create chat with yourself');
    }

    const uniqueKey = [user.id, participant.id].sort().join('_');

    // 3. Перевірити, чи існує вже чат між ними
    const existingChat = await this.chatRepository.findOne({
      where: {
        uniqueKey,
      },
      relations: {
        participants: true,
      },
    });

    // 4. Якщо існує — повернути його
    if (existingChat) {
      return existingChat;
    }

    // 5. Створити новий чат
    const newChat = this.chatRepository.create({
      uniqueKey,
      participants: [user, participant],
    });

    const savedChat = await this.chatRepository.save(newChat);

    const chat = await this.chatRepository.findOne({
      where: {
        id: savedChat.id,
      },
      relations: {
        participants: true,
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }
}
