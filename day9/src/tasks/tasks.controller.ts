import { Controller, Param, Body, ParseIntPipe, Get, Patch, Post, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/create-task.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto): Promise<Task> 
    {
        return this.taskService.create(createTaskDto);
    }

    @Get()
    findAll(): Promise<Task[]>
    {
        return this.taskService.findAll();
    }

    @Patch()
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<Task>{
        return this.taskService.update(id, updateTaskDto);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        ): Promise< { message: string }> {
            return this.taskService.remove(id)
        }
}
