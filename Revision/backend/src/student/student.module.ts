import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Student } from './entities/student.entity';
import { ClassEntity } from 'src/classes/entities/class.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Mark } from 'src/marks/entities/mark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, ClassEntity, Attendance, Mark ])
  ]
})
export class StudentModule {}
