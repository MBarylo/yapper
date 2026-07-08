import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  ManyToMany,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages!: Message[];

  @ManyToMany(() => User)
  @JoinTable()
  participants!: User[];

  @Column({ unique: true })
  uniqueKey!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
