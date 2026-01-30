import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  UseGuards,
  Req,
} from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { JwtAuthGuard } from "src/common/guards/authguard";
import { RoleGuard } from "src/common/guards/roleguard";
import { Roles } from "src/common/decorators/roledecorator";
import { ROLE } from "src/common/enum/role.enum";
import { UpdateStudentDto } from "../student/dto/update-student.dto";
import { CreateMarkDto } from "../marks/dto/create-mark.dto";
import { CreateAttendanceDto } from "../attendance/dto/create-attendance.dto";
import { ApiResponse } from "src/common/api-res/api.res";

@Controller("teacher")
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(ROLE.Teacher)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  // ================= CLASS =================

  @Get("my-class")
  async getMyClass(@Req() req) {
    const data = await this.teacherService.getMyClass(req.user.id);
    return new ApiResponse(true, "Your assigned class", data);
  }

  @Get("my-class/students")
  async getMyClassStudents(@Req() req) {
    const data = await this.teacherService.getMyClassStudents(req.user.id);
    return new ApiResponse(true, "Class students fetched", data);
  }

  // ================= STUDENT =================

  @Get("student/:id")
  async getStudentDetails(
    @Req() req,
    @Param("id") studentId: string,
  ) {
    const data = await this.teacherService.getStudentDetails(
      req.user.id,
      studentId,
    );
    return new ApiResponse(true, "Student details", data);
  }

  @Patch("student/:id")
  async updateStudent(
    @Req() req,
    @Param("id") studentId: string,
    @Body() dto: UpdateStudentDto,
  ) {
    const data = await this.teacherService.updateStudent(
      req.user.id,
      studentId,
      dto,
    );
    return new ApiResponse(true, "Student updated", data);
  }

  // ================= MARKS =================

  @Post("student/:id/marks")
  async giveMark(
    @Req() req,
    @Param("id") studentId: string,
    @Body() dto: CreateMarkDto,
  ) {
    const data = await this.teacherService.giveMark(
      req.user.id,
      studentId,
      dto,
    );
    return new ApiResponse(true, "Mark assigned", data);
  }

  // ================= ATTENDANCE =================

  @Post("student/:id/attendance")
  async markAttendance(
    @Req() req,
    @Param("id") studentId: string,
    @Body() dto: CreateAttendanceDto,
  ) {
    const data = await this.teacherService.markAttendance(
      req.user.id,
      studentId,
      dto,
    );
    return new ApiResponse(true, "Attendance marked", data);
  }
}
// GET    /teacher/my-class
// GET    /teacher/my-class/students
// GET    /teacher/student/:id
// PATCH  /teacher/student/:id
// POST   /teacher/student/:id/marks
// POST   /teacher/student/:id/attendance
