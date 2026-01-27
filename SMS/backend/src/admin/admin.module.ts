import { Module } from '@nestjs/common';
import { adminService } from './admin.service';
import { adminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [adminService],
  controllers: [adminController]
})
export class adminModule { }
