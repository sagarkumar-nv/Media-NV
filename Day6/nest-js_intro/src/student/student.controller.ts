import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';
import { STUDENTService } from './student.service'

@Controller('student')
export class STUDENTController {
    constructor(private readonly studentService: STUDENTService) { };

    @Get()
    getAll() {
        return this.studentService.getAllSTUDENTs();
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.studentService.getSTUDENTById(Number(id))
    }

    @Post()
    create(@Body() body: { name: string; age: number }) {
        return this.studentService.createSTUDENT(body);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: { name: string; age: number }) {
        return this.studentService.updateSTUDENT(Number(id), body);
    }

    @Patch(':id')
    patch(@Param('id') id: string, @Body() body: Partial<{ name: string, age: number }>) {
        return this.studentService.patchSTUDENT(Number(id), body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.studentService.deleteSTUDENT(Number(id));
    }
}
