import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  login!: string; // username або email

  @IsString()
  password!: string;
}
