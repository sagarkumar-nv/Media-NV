import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/create-task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepo: Repository<Task>,
    ) {}


    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.taskRepo.create({
            title: createTaskDto.title,
            completed: createTaskDto.completed ?? false,
            user: { id: createTaskDto.userId},
        });
        return await this.taskRepo.save(task);
    }

    async findAll(): Promise<Task[]> {
        return await this.taskRepo.find({
            relations: ['user']
        });
    }


    async update(
        id: number,
        updateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
        const task = await this.taskRepo.findOne({
            where: { id },
        });

        if(!task) {
            throw new NotFoundException('Task Not Found.');
        }

        Object.assign(task, updateTaskDto);
        return await this.taskRepo.save(task)
    }


    async remove(id: number): Promise<{message: string}> {

        const result = await this.taskRepo.delete(id);

        if(result.affected === 0){
            throw new NotFoundException('Task not Found');
        }
        return { message: 'Task deleted successfully'}
    }
}
