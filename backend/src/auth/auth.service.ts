import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) throw new ConflictException('Email already taken');

    const existingUsername = await this.usersService.findByUsername(
      dto.username,
    );
    if (existingUsername) throw new ConflictException('Username already taken');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });
    return {
      user: { id: user.id, username: user.username, email: user.email },
      token,
    };
  }

  async login(login: string, password: string) {
    const user =
      (await this.usersService.findByEmail(login)) ??
      (await this.usersService.findByUsername(login));

    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Wrong password');

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
      token,
    };
  }
}
