import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { User } from 'src/user/entities/user.entity';
import { ClassEntity } from 'src/classes/entities/class.entity';
import { Mark } from 'src/marks/entities/mark.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Teacher, ClassEntity, Mark, Attendance])
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
