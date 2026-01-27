import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./dto/create-auth.dto";
import { ROLE } from "../common/enum/role.enum";
import bcrypt from 'bcrypt';
import { Student } from "src/student/entities/student.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private repo: Repository<User>,
    private jwt: JwtService
  ) { }

  async register(dto: RegisterUserDto) {

  const exists = await this.repo.findOne({ where: { email: dto.email } });
  if (exists) {
    throw new BadRequestException("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = this.repo.create({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    gender: dto.gender
  });
  return this.repo.save(user);
}


  async login(dto) {
    const user = await this.repo.findOne({ where: { email: dto.email, status: true } });

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