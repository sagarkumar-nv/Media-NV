import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassEntity } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { User } from 'src/user/entities/user.entity';
import { ROLE } from 'src/common/enum/role.enum';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,
  ) { }
  async createClass(dto: CreateClassDto, admin: User) {
    if (admin.role !== ROLE.Admin) throw new ForbiddenException('Only admin can create classes');

    const teacher = await this.teacherRepo.findOne({ 
      where: { user: { id: dto.teacherId } }, 
      relations: ['user'],
    });
    if (!teacher) throw new NotFoundException('teacher not found');

    const newClass = this.classRepo.create({
      name: dto.className,
      section: dto.section,
      classTeacher: teacher,
    });

    const savedClass = await this.classRepo.save(newClass);
    return {
      ...savedClass,
      classteacher: {
        id: teacher.id,
        subject: teacher.subject,
        user: {
          id: teacher.user.id,
          name: teacher.user.name,
          email: teacher.user.email
        }
      }
    }
  }

  async updateClass(id: string, dto: UpdateClassDto, admin: User) {
    if (admin.role !== ROLE.Admin) throw new ForbiddenException('Only admin can update classes');

    const classEntity = await this.classRepo.findOne({ where: { id }, relations: ['classTeacher'] });
    if (!classEntity) throw new NotFoundException('Class not found');

    if (dto.teacherId) {
      const teacher = await this.teacherRepo.findOne({ 
        where: {user: { id: dto.teacherId }}, 
        relations: ['user'], 
      });
      if (!teacher) throw new NotFoundException('teacher not found');
      classEntity.classTeacher = teacher;
    }

    if (dto.className) classEntity.name = dto.className;
    if (dto.section) classEntity.section = dto.section;

    return this.classRepo.save(classEntity);
  }

  async getAllClasses() {
    return this.classRepo.find({ relations: ['classteacher'] });
  }

  async deleteClass(id: string, admin: User) {
    if (admin.role !== ROLE.Admin) throw new ForbiddenException('Only admin can delete classes');

    const classEntity = await this.classRepo.findOne({ where: { id } });
    if (!classEntity) throw new NotFoundException('Class not found');

    classEntity.status = false;
    return this.classRepo.save(classEntity);
  }
}
