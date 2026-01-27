import { BadGatewayException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE } from 'src/common/enum/role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Teacher } from './entities/teacher.entity';
import { CreateteacherDto } from './dto/create-teacher.dto';
import { UpdateClassDto } from 'src/classes/dto/update-class.dto';
import { UpdateteacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(@InjectRepository(User)
  private repo: Repository<User>,
) { }

  async createstudent(dto: CreateUserDto, creatorRole: ROLE) {

    if (!dto.role) {
      dto.role = ROLE.Student;
    }

    if (creatorRole === ROLE.Student) {
      throw new ForbiddenException('students cannot create users');
    }

    if (creatorRole === ROLE.Teacher && dto.role !== ROLE.Student) {
      throw new ForbiddenException('teachers can only create students');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      gender: dto.gender
    });
    const existingUser = await this.repo.findOne({
      where: { email: dto.email }
    });
    if (existingUser) throw new BadGatewayException('Email already registered')

    return this.repo.save(user);
  }

  async getstudentsForteacher(teacher: User) {
    if (teacher.role !== ROLE.Teacher) {
      throw new ForbiddenException('Only teacher can view students');
    }

    return this.repo.find({
      where: { role: ROLE.Student },
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async Updatestudent(teacher: User, studentId: string, dto: Partial<UpdateUserDto>) {
    if (teacher.role !== ROLE.Teacher) {
      throw new ForbiddenException('Only teacher can update students');
    }

    const student = await this.repo.findOne({
      where: { id: studentId, role: ROLE.Student },
    });

    if (!student) {
      throw new NotFoundException('student not found');
    }
    delete dto.role;

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(student, dto);
    const updated = await this.repo.save(student);

    const { password, ...safeUser } = updated;
    return safeUser;
  }

  async deletestudent(performer: User, studentId: string) {
    const student = await this.repo.findOne({
      where: {
        id: studentId,
        role: ROLE.Student,
      },
    });

    if (!student) {
      throw new NotFoundException('student not found');
    }

    if (performer.role === ROLE.Student) {
      throw new ForbiddenException('students are not allowed to delete users');
    }

    if (performer.role === ROLE.Teacher) {
      await this.repo.remove(student);
      return { message: 'student deleted successfully by teacher' };
    }

    if (performer.role === ROLE.Admin) {
      await this.repo.remove(student);
      return { message: 'student deleted successfully by admin' };
    }
  }
}
