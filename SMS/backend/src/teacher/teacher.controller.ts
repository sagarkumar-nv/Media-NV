import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from 'src/common/enum/role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { ApiResponse } from '../common/api_response/api.res';
import { UserService } from 'src/user/user.service';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService,
              private readonly userService: UserService
  ) { }

  @Post()
  async createstudent(
    @Body() dto: CreateUserDto,
    @Request() req,
  ) {
    const data = await this.teacherService.createstudent(
      dto,
      req.user.role,
    );

    return new ApiResponse(
      true,
      'student created successfully',
      data,
    );
  }

  @Get('students')
  async getstudents(@Request() req) {
    const data = await this.teacherService.getstudentsForteacher(req.user);

    return new ApiResponse(
      true,
      'students fetched successfully',
      data,
    );
  }

  @Patch('students/:id')
  async updatestudent(
    @Param('id') id: string,
    @Body() dto: Partial<UpdateUserDto>,
    @Request() req,
  ) {
    const data = await this.teacherService.Updatestudent(
      req.user,
      id,
      dto,
    );

    return new ApiResponse(
      true,
      'student updated successfully',
      data,
    );
  }

  @Delete('students/:id')
  async deletestudent(
    @Param('id') id: string,
    @Request() req,
  ) {
    const data = await this.teacherService.deletestudent(
      req.user,
      id,
    );

    return new ApiResponse(
      true,
      'student deleted successfully',
      data,
    );
  }
}
