import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/enum/role.enum';
import { ApiResponse } from '../common/api_response/api.res';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';


@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // Admin assigns class to student
  @Patch(':id/assign-class/:classId')
  @Roles(ROLE.Admin)
  async assignClass(
    @Param('id') studentId: string,
    @Param('classId') classId: string,
  ) {
    const data = this.studentService.assignClass(studentId, classId);
    return new ApiResponse (
      true,
      "Class Assign to Student",
      data
    )
  }

  // Student fetches their own class
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('class/me')
  @Roles(ROLE.Student)
  getMyClass(@Req() req) {
    const data = this.studentService.getMyClass(req.user.id);
    return new ApiResponse(
      true,
      "Class records",
      data
    )
  }
}
