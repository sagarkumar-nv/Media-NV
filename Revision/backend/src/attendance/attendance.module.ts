import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { Attendance } from './entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Attendance])
  ]
})
export class AttendanceModule {}
