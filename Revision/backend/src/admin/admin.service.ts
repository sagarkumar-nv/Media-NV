import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { User } from "src/user/entities/user.entity";
import { Student } from "src/student/entities/student.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { ClassEntity } from "src/classes/entities/class.entity";
import { ROLE } from "src/common/enum/role.enum";

import { CreateClassDto } from "./dto/create-class.dto";
import { CreateUserByAdminDto } from "./dto/create-user-by-admin.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(ClassEntity) private classRepo: Repository<ClassEntity>,
  ) {}

  // ================= USERS =================

  async getAllUsers() {
    return await this.userRepo.find({
      relations: ["student", "teacher"]
    });
  }

  async createUser(dto: CreateUserByAdminDto) {
    console.log(dto);
    const exist = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (exist) throw new BadRequestException("Email already exists");

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      contact:dto.contact,
      role: dto.role,
      gender: dto.gender,
    });

    await this.userRepo.save(user);

    // simple role-based insert
    if (dto.role === ROLE.Student) {
      const student = this.studentRepo.create({ user });
      await this.studentRepo.save(student);
    }

    if (dto.role === ROLE.Teacher) {
      const teacher = this.teacherRepo.create({ user });
      await this.teacherRepo.save(teacher);
    }

    return user;
  }

  async updateUserRole(userId: string, newRole: ROLE) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["student", "teacher"],
    });

    if (!user) throw new NotFoundException("User not found");
    if (user.role === newRole) return user;

    // deactivate existing role entity
    if (user.role === ROLE.Student && user.student) {
      user.student.isActive = false;
      await this.studentRepo.save(user.student);
    }

    if (user.role === ROLE.Teacher && user.teacher) {
      user.teacher.isActive = false;
      await this.teacherRepo.save(user.teacher);
    }

    user.role = newRole;
    return this.userRepo.save(user);
  }

  // ================= CONVERSIONS =================

  async convertStudentToTeacher(userId: string) {
  const user = await this.userRepo.findOne({
    where: { id: userId },
  });

  if (!user) throw new NotFoundException("User not found");

  const student = await this.studentRepo.findOne({
    where: { user: { id: userId } },
    relations: ["user"],
  });

  if (!student)
    throw new BadRequestException("User is not a student");

  const teacherExists = await this.teacherRepo.findOne({
    where: { user: { id: userId } },
  });

  if (teacherExists)
    throw new BadRequestException("Teacher already exists");

  student.isActive = false;
  await this.studentRepo.save(student);

  const teacher = this.teacherRepo.create({ user });
  await this.teacherRepo.save(teacher);

  user.role = ROLE.Teacher;
  return this.userRepo.save(user);
}


  async convertTeacherToStudent(userId: string) {
  const user = await this.userRepo.findOne({
    where: { id: userId },
  });

  if (!user) throw new NotFoundException("User not found");

  const teacher = await this.teacherRepo.findOne({
    where: { user: { id: userId } },
    relations: ["user"],
  });

  if (!teacher)
    throw new BadRequestException("User is not a teacher");

  const studentExists = await this.studentRepo.findOne({
    where: { user: { id: userId } },
  });

  if (studentExists)
    throw new BadRequestException("Student already exists");

  // deactivate teacher
  teacher.isActive = false;
  await this.teacherRepo.save(teacher);

  // create student
  const student = this.studentRepo.create({ user });
  await this.studentRepo.save(student);

  // update role
  user.role = ROLE.Student;
  return this.userRepo.save(user);
}


  // ================= CLASSES =================

  async createClass(dto: CreateClassDto) {
    return this.classRepo.save(dto);
  }

  async assignTeacher(classId: string, teacherId: string) {
    const classEntity = await this.classRepo.findOne({
      where: { id: classId },
    });
    if (!classEntity) throw new NotFoundException("Class not found");

    const teacher = await this.teacherRepo.findOne({
      where: { id: teacherId },
      relations: ["user"],
    });
    if (!teacher) throw new NotFoundException("Teacher not found");

    if (teacher.user.role !== ROLE.Teacher) {
      throw new BadRequestException("User is not a teacher");
    }

    classEntity.teacher = teacher;
    return this.classRepo.save(classEntity);
  }

  async assignStudents(classId: string, studentIds: string[]) {
  const classEntity = await this.classRepo.findOne({
    where: { id: classId },
  });
  if (!classEntity) throw new NotFoundException("Class not found");

  const students = await this.studentRepo.find({
    where: {
        id: In(studentIds),
    },
    relations: ["user"],
  });

  if (students.length !== studentIds.length) {
    throw new BadRequestException("Some students not found");
  }

  students.forEach((s) => {
    if (s.user.role !== ROLE.Student) {
      throw new BadRequestException("Non-student detected");
    }
    s.class = classEntity;
  });

  return this.studentRepo.save(students);
}


  async getClassStudents(classId: string) {
    return this.studentRepo.find({
      where: { class: { id: classId } },
      relations: ["user"],
    });
  }

  async deactivateUser(userId: string) {
  const user = await this.userRepo.findOne({
    where: { id: userId },
    relations: ["student", "teacher"],
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.status === false) {
    throw new BadRequestException("User already inactive");
  }

  user.status = false;

  if (user.student) {
    user.student.isActive = false;
    await this.studentRepo.save(user.student);
  }

  if (user.teacher) {
    user.teacher.isActive = false;
    await this.teacherRepo.save(user.teacher);
  }

  await this.userRepo.save(user);

  return {
    message: "User, student & teacher deactivated successfully",
  };
}
}
