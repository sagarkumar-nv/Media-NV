import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/create-task.entity';
import { LoggerMiddleware } from '../middleware/logger/logger.middleware';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([Task])]
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
            .apply(LoggerMiddleware)
            .forRoutes('tasks');
  }
}
