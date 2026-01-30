import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassEntity, Student, Teacher])
  ]
})
export class ClassesModule {}
