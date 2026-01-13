import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async register(data: RegisterDto) {
    if (!data.password || !data.email || !data.username) {
      throw new BadRequestException('All fields are required');
    }

    const hash = await bcrypt.hash(data.password, 10);

    return this.userService.create({
      username: data.username,
      email: data.email,
      password: hash,
    });
  }

  async login(data: LoginDto) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required');
   }

    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, role: user.role };

    return {
      accessToken: this.jwt.sign(payload)
    };
  }
}
