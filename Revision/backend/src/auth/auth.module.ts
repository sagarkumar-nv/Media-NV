import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';
import { JwtStrategy } from './strategy/auth.strategy';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m'}
    }),
    TypeOrmModule.forFeature([User, Teacher, Student]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
