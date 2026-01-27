import { Module } from '@nestjs/common';
import { ClassService } from './classes.service';
import { ClassController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { User } from 'src/user/entities/user.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity, User, Teacher])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassesModule {}
