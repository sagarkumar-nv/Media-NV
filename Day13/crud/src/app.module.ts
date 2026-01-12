import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo/todo.controller';
import { TodoModule } from './todo/todo.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: [__dirname + '/**/*.entity.js'],
      migrations: [__dirname + '/migrations/*.js'],
      synchronize: false,
      migrationsRun: false
    }),

    TodoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
