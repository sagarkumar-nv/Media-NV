import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../student/entities/student.entity';
import { ClassEntity } from '../classes/entities/class.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,

    @InjectRepository(ClassEntity)
    private classRepo: Repository<ClassEntity>,
  ) {}

  async assignClass(studentId: string, classId: string) {
    const student = await this.studentRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const classEntity = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['classTeacher'], // assuming classTeacher is a relation
    });

    if (!classEntity) throw new NotFoundException('Class not found');

    student.class = classEntity;
    return this.studentRepo.save(student);
  }

  async getMyClass(userId: string) {
    const student = await this.studentRepo.findOne({
      where: { id: userId },
      relations: ['class', 'class.classTeacher'],
    });

    if (!student || !student.class) {
      throw new NotFoundException('No class assigned');
    }

    return {
      className: student.class.name,
      section: student.class.section,
      teacher: {
        name: student.class.classTeacher?.user?.name,
        email: student.class.classTeacher?.user?.email,
      },
    };
  }
}
