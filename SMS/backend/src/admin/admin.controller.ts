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
import { adminService } from './admin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/enum/role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiResponse } from 'src/common/api_response/api.res';

@Controller('admin')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(ROLE.Admin)
export class adminController {
  constructor(private readonly adminService: adminService) { }

  @Post('create-user')
  async createUser(@Body() dto: CreateUserDto, @Request() req) {
    const data = await this.adminService.adminCreate(dto, req.user.role);
    return new ApiResponse(true, 'User created successfully', data);
  }

  @Get('users')
  async getAllUsers(@Request() req) {
    const data = await this.adminService.getUserForadmin(req.user);
    return new ApiResponse(true, 'All users fetched successfully', data);
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: Partial<CreateUserDto>,
    @Request() req,
  ) {
    const data = await this.adminService.updateUserByadmin(
      id,
      dto,
      req.user.role,
    );

    return new ApiResponse(true, 'User updated successfully', data);
  }

  @Delete('users/:id')
  async softDeleteUser(@Param('id') id: string, @Request() req) {
    const data = await this.adminService.softDeleteUserByadmin(
      id,
      req.user.role,
      req.user.id,
    );

    return new ApiResponse(true, 'User deleted successfully', data);
  }
}
