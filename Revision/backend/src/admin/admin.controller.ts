import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../common/guards/authguard";
import { RoleGuard } from "../common/guards/roleguard";
import { Roles } from "src/common/decorators/roledecorator";
import { ROLE } from "src/common/enum/role.enum";

import { CreateClassDto } from "./dto/create-class.dto";
import { AssignTeacherDto } from "./dto/assign-teacher.dto";
import { AssignStudentsDto } from "./dto/assign-students.dto";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { CreateUserByAdminDto } from "./dto/create-user-by-admin.dto";
import { ApiResponse } from "src/common/api-res/api.res";

@Controller("admin")
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(ROLE.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ================= USERS =================

  @Get("users")
  async getAllUsers() {
    const data = await this.adminService.getAllUsers();
    return new ApiResponse(true, "Users details", data);
  }

  @Post("users")
  async createUser(@Body() dto: CreateUserByAdminDto) {
    //console.log(dto);
    const data = await this.adminService.createUser(dto);
    return new ApiResponse(true, "User created", data);
  }

  @Patch("users/:id/role")
  async updateRole(
    @Param("id") id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    const data = await this.adminService.updateUserRole(id, dto.role);
    return new ApiResponse(true, "User role updated", data);
  }

  // ================= CONVERSIONS =================

  @Patch("convert/student-to-teacher/:id")
  async convertStudent(@Param("id") id: string) {
    const data = await this.adminService.convertStudentToTeacher(id);
    return new ApiResponse(true, "Student converted to Teacher", data);
  }

  @Patch("convert/teacher-to-student/:id")
  async convertTeacher(@Param("id") id: string) {
    const data = await this.adminService.convertTeacherToStudent(id);
    return new ApiResponse(true, "Teacher converted to Student", data);
  }

  // ================= CLASSES =================

  @Post("classes")
  async createClass(@Body() dto: CreateClassDto) {
    const data = await this.adminService.createClass(dto);
    return new ApiResponse(true, "Class created", data);
  }

  @Patch("classes/:id/assign-teacher")
  async assignTeacher(
    @Param("id") classId: string,
    @Body() dto: AssignTeacherDto,
  ) {
    const data = await this.adminService.assignTeacher(
      classId,
      dto.teacherId,
    );
    return new ApiResponse(true, "Teacher assigned", data);
  }

  @Patch("classes/:id/assign-students")
  async assignStudents(
    @Param("id") classId: string,
    @Body() dto: AssignStudentsDto,
  ) {
    const data = await this.adminService.assignStudents(
      classId,
      dto.studentIds,
    );
    return new ApiResponse(true, "Students assigned", data);
  }

  @Get("classes/:id/students")
  async getClassStudents(@Param("id") classId: string) {
    const data = await this.adminService.getClassStudents(classId);
    return new ApiResponse(true, "Class students", data);
  }

  @Patch("users/:id/deactivate")
  deactivateUser(@Param("id") userId: string) {
    return this.adminService.deactivateUser(userId);
}
}
