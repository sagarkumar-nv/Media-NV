import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "src/student/entities/student.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { ClassEntity } from "src/classes/entities/class.entity";
import { Mark } from "src/marks/entities/mark.entity";
import { Attendance } from "src/attendance/entities/attendance.entity";
import { UpdateStudentDto } from "../student/dto/update-student.dto";
import { CreateMarkDto } from "../marks/dto/create-mark.dto";
import { CreateAttendanceDto } from "../attendance/dto/create-attendance.dto";

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(ClassEntity) private classRepo: Repository<ClassEntity>,
    @InjectRepository(Mark) private markRepo: Repository<Mark>,
    @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>
  ) {}

  async getMyClass(userId: string) {
  const teacher = await this.teacherRepo.findOne({
    where: {
      user: { id: userId },
    },
    relations: ['class'],
  });

  if (!teacher) {
    throw new NotFoundException("Teacher not found");
  }

  if(!teacher.class) {
    throw new NotFoundException('Class has been not assigned yet...')
  }

  if (!teacher.class) {
    return null; // or throw exception (your choice)
  }

  return teacher.class;
}


  async getMyClassStudents(userId: string) {
  const student = await this.studentRepo.findOne({
    where: {
      user: { id: userId },
      isActive: true,
    },
    relations: [
      'class',
      'class.students',
      'class.students.user',
    ],
  });

  if (!student) {
    throw new NotFoundException("Student not found");
  }

  if (!student.class) {
    throw new NotFoundException("You are not assigned to any class");
  }

  return student.class.students.filter(s => s.isActive);
}


  async getStudentDetails(teacherId: string, studentId: string) {
  const teacher = await this.teacherRepo.findOne({
    where: { id: teacherId },
    relations: ['class'],
  });

  if (!teacher || !teacher.class) {
    throw new NotFoundException("No class assigned");
  }

  const student = await this.studentRepo.findOne({
    where: {
      id: studentId,
      isActive: true,
      class: { id: teacher.class.id },
    },
    relations: ['user', 'class', 'mark', 'attendance'],
  });

  if (!student) throw new NotFoundException("Student not found");

  return student;
}


  async updateStudent(
  teacherId: string,
  studentId: string,
  dto: UpdateStudentDto,
) {
  const teacher = await this.teacherRepo.findOne({
    where: { id: teacherId },
    relations: ['class'],
  });

  if (!teacher || !teacher.class) {
    throw new NotFoundException("No class assigned");
  }

  const student = await this.studentRepo.findOne({
    where: {
      id: studentId,
      isActive: true,
      class: { id: teacher.class.id },
    },
    relations: ['user'],
  });

  if (!student) throw new NotFoundException("Student not found");

  Object.assign(student.user, dto);
  await this.studentRepo.save(student.user);

  return student;
}


  async giveMark(
  teacherId: string,
  studentId: string,
  dto: CreateMarkDto,
) {
  const teacher = await this.teacherRepo.findOne({
    where: { id: teacherId },
    relations: ['class'],
  });

  if (!teacher || !teacher.class) {
    throw new NotFoundException("No class assigned");
  }

  const student = await this.studentRepo.findOne({
    where: {
      id: studentId,
      isActive: true,
      class: { id: teacher.class.id },
    },
  });

  if (!student) throw new NotFoundException("Student not found");

  const mark = this.markRepo.create({
    student,
    subject: dto.subject,
    mark: dto.mark,
  });

  return this.markRepo.save(mark);
}

  async markAttendance(
  teacherId: string,
  studentId: string,
  dto: CreateAttendanceDto,
) {
  const teacher = await this.teacherRepo.findOne({
    where: { id: teacherId },
    relations: ['class'],
  });

  if (!teacher || !teacher.class) {
    throw new NotFoundException("No class assigned");
  }

  const student = await this.studentRepo.findOne({
    where: {
      id: studentId,
      isActive: true,
      class: { id: teacher.class.id },
    },
    relations: ['class'],
  });

  if (!student) throw new NotFoundException("Student not found");

  const attendance = this.attendanceRepo.create({
    student,
    class: student.class,
    date: dto.date,
    status: dto.status,
  });

  return this.attendanceRepo.save(attendance);
}

async getAllMyStudentsData(teacherId: string) {
  const teacher = await this.teacherRepo.findOne({
    where: { id: teacherId },
    relations: [
      'class',
      'class.student',
      'class.student.user',
      'class.student.mark',
      'class.student.attendance',
    ],
  });

  if (!teacher || !teacher.class) {
    throw new NotFoundException("No class assigned");
  }

  return teacher.class.students.filter(s => s.isActive);
}


}
