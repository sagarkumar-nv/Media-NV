import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { ROLE } from '../common/enum/role.enum'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User)
    private repo: Repository<User>
    ) {}

    create(data) {
        return this.repo.save(data);
    }

    findAll() {
        return this.repo.find();
    }

   async adminCreate(dto: CreateUserDto, creatorRole: ROLE) {
  if (dto.role === ROLE.ADMIN && creatorRole !== ROLE.ADMIN) {
    throw new ForbiddenException('Only admins can create another admin');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = this.repo.create({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    role: dto.role,
  });

  return this.repo.save(user);
}

}
