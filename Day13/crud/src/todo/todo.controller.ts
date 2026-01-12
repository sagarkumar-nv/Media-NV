import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTask } from './dto/create.dto';
import { UpdateTaskDto } from './dto/update.dto';
import { ApiResponse } from '../common/api-response';


@Controller('todo')
export class TodoController {
    constructor(private readonly task: TodoService) {}
    @Post()
    async create(@Body() dto: CreateTask){
        const data = await this.task.create(dto);
        return new ApiResponse(true, 'Task Added', data);
    }

    @Get()
    async findAll(){
        const task = await this.task.findAll()
        return new ApiResponse(true, "Tasks fetched succesfully ", task )
    }

    @Get(':id')
    async findById(@Param('id') id: string){
        const task = await this.task.findById(id);
        return new ApiResponse(true, "Task fetched succesfully", task);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dtoU: UpdateTaskDto){
        const task =  await this.task.update(id, dtoU);
        return new ApiResponse(true, "Task Updated Succesfully.", task);
    }

    @Delete(':id')
    async delete(@Param() id: string){
        const task = await this.task.removeTask(id);
        return new ApiResponse(true, "Task Deleted Succesfully.", task);
    }

}
