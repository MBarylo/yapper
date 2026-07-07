import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.messages)
  author!: User;

  @Column()
  text!: string;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat!: Chat;

  @Column({ default: false })
  isViewed?: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  editedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
