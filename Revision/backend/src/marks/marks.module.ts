import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mark } from './entities/mark.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Student, Mark]
    )
  ]
})
export class MarksModule {}
