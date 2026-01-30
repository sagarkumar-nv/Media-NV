import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async findAll() {
    return this.userRepo.find({
      relations: ['student', 'teacher'],
      select: {
        password: false, // 🔐 never leak password
      },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['student', 'teacher'],
    });

    if (!user) throw new NotFoundException('User not found');

    const { password, ...safeUser } = user;
    return { ...safeUser };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

}
