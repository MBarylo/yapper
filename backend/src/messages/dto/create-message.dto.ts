import { IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateMessageDto {
  @PrimaryGeneratedColumn('uuid')
  chatId!: string;

  @IsString()
  text!: string;
}
