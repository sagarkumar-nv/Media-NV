import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ROLE } from 'src/common/enum/role.enum';

@Injectable()
export class UserService {
    constructor(
      @InjectRepository(User)
      private repo: Repository<User>,
    ) { }

    async findAllActive() {
    return this.repo.createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.role', 'user.gender'])
      .where('user.status = :status', { status: true })
      .getMany();
    }
    async findById(userId: string) {
    const user = await this.repo.findOne({
        where: { id: userId, status: true }
    });

    if (!user) throw new NotFoundException('User not found or deleted');

    const { password, ...safeUser } = user;
    return safeUser;
}
    async updateUserProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id: userId, status: true } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

      if (dto.role) delete dto.role;

    Object.assign(user, dto);
    const updated = await this.repo.save(user);
    const { password, ...safeUser } = updated;
    return safeUser;
  }

  async deleteMe(userId: string) {
    if(!userId) {
      throw new BadRequestException('User Id missing from JWT');
    }

    const user = await this.repo.findOne({
      where: { id: userId }
    })

    if(!user) {
      throw new NotFoundException('User not found');
    }

    user.status = false;
    await this.repo.save(user);

    return { id: userId};
  }

}
