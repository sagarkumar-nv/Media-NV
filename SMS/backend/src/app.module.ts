import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { teacherModule } from './teacher/teacher.module';
import { adminModule } from './admin/admin.module';
import { ClassesModule } from './classes/classes.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      entities: [__dirname + '/**/*.entity.js'],
      migrations: [__dirname + 'migrations/*.js'],

      synchronize: false,
      migrationsRun: false
    }),
    UserModule,
    AuthModule, teacherModule, adminModule, ClassesModule, StudentModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
