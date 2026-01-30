import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { ClassEntity } from 'src/classes/entities/class.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([
      User,
      Student,
      Teacher,
      ClassEntity,
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
