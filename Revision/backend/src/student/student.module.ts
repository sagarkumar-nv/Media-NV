import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Student } from './entities/student.entity';
import { ClassEntity } from 'src/classes/entities/class.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Mark } from 'src/marks/entities/mark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, ClassEntity, Attendance, Mark ])
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
