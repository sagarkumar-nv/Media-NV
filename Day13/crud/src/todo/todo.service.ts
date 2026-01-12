import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entity/create.task.entity';
import { CreateTask } from './dto/create.dto';
import { UpdateTaskDto } from './dto/update.dto';

@Injectable()
export class TodoService {
        constructor(@InjectRepository(Task)
                    private readonly taskRepo: Repository<Task>) {}

        async create(createTaskDto: CreateTask) {
            try{
                const task = this.taskRepo.create(createTaskDto)
                return await this.taskRepo.save(task);  
            }catch(err){
                throw new BadRequestException(err.message)
            }
        }

        async findAll() {
            return await this.taskRepo.find();
        }

        async findById(id: string){
            try{
                const task = await this.taskRepo.findOneBy({id})
                if(!task) {
                    throw new NotFoundException('Task not Found');
                }
                return task;
            }catch(err){
                throw new BadRequestException(err);
            }
        }

        async update(id: string, dto: UpdateTaskDto) {
            try{
            const task = await this.taskRepo.findOne({
                where: { id }
            })
            if(!task) {
                throw new NotFoundException('Task not found.')
            }
            Object.assign(task, dto);
            return task;
            }catch(err){
                throw new BadRequestException(err);
            }
        }

        async removeTask(id: string) {
            try{
            const task = await this.taskRepo.delete(id);
            if(task.affected == 0){
                throw new NotFoundException('Task Not Found.')
            }
            return task;
            }catch(err){
                throw new BadRequestException(err)
            }
        }
}
