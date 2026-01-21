import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ROLE } from 'src/common/enum/role.enum';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private repo: Repository<User>,
        private jwt: JwtService
    ) { }

    async register(dto) {

        const exists = await this.repo.findOne({ where: { email: dto.email } });
        if (exists) throw new BadRequestException("Email already exists");

        if (dto.role === ROLE.ADMIN) {
            throw new BadRequestException('You cannot register as admin');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const role = dto.role === 'TEACHER' ? ROLE.TEACHER : ROLE.STUDENT;

        const user = this.repo.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: role
        });

        return this.repo.save(user);
    }

  async login(dto) {
  const user = await this.repo.findOne({ where: { email: dto.email } });

  if (!user) {
    throw new UnauthorizedException('Email is not registered');
  }

  const match = await bcrypt.compare(dto.password, user.password);

  if (!match) {
    throw new UnauthorizedException('Incorrect password');
  }

  const token = this.jwt.sign({
    id: user.id,
    role: user.role,
  });

  const { password, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
}

}
