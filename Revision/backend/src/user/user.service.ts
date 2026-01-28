import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  async findAll() {
  const data = await this.userRepo.find();
  if (data.length === 0) throw new NotFoundException('No users!');
  return data;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id }
    });

    if(!user) throw new NotFoundException('User not found!');
    const { password, ...safeUser} = user;
    return safeUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
      const user = await this.userRepo.findOne({
        where: { id }
      });
      if(!user) throw new NotFoundException('User not found!');

      if(updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 15)
      }
      Object.assign(user, updateUserDto);
      const updated = await this.userRepo.save(user);
      const { password, ...safeUser } = updated;
      return safeUser;
  }
}
