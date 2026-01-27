import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClassService } from './classes.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/enum/role.enum';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ApiResponse } from 'src/common/api_response/api.res';

@Controller('classes')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  @Roles(ROLE.Admin)
  @Post()
  async createClass(@Body() dto: CreateClassDto, @Request() req) {
    const data = await this.classService.createClass(dto, req.user);
    return new ApiResponse(true, 'Class created successfully', data);
  }

  @Roles(ROLE.Admin)
  @Patch(':id')
  async updateClass(@Param('id') id: string, @Body() dto: UpdateClassDto, @Request() req) {
    const data = await this.classService.updateClass(id, dto, req.user);
    return new ApiResponse(true, 'Class updated successfully', data);
  }

  @Roles(ROLE.Admin)
  @Delete(':id')
  async deleteClass(@Param('id') id: string, @Request() req) {
    const data = await this.classService.deleteClass(id, req.user);
    return new ApiResponse(true, 'Class deleted successfully', data);
  }

  @Roles(ROLE.Admin, ROLE.Teacher)
  @Get()
  async getAllClasses() {
    const data = await this.classService.getAllClasses();
    return new ApiResponse(true, 'Classes fetched successfully', data);
  }
}
