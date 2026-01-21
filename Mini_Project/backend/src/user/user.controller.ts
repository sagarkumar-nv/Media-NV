import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateUserDto } from './dto/create.user.dto';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ROLE } from '../common/enum/role.enum';
import { ApiResponse } from '../common/api_response_handling/api.res';

@Controller('user')
export class UserController {
  constructor(private service: UserService) { }

  //common
  @UseGuards(JwtAuthGuard)
@Get('all')
async getAllUsers(@Request() req) {
  const data = await this.service.getAllUsers();
  return new ApiResponse(
    true,
    'All users fetched successfully',
    data
  );
}


  // Anyone can get their own profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const data = await this.service.findById(req.user.id);
    return new ApiResponse(
      true,
      'Got my profile',
      data
    )
  }

  // Update own profile
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req, @Body() dto: Partial<CreateUserDto>) {
    const data = await this.service.updateUserProfile(req.user.id, dto, req.user.role);
    return new ApiResponse(
      true,
      'Updated my profile',
      data
    )
  }

//-------------------------------------------
// Common for teacher and admin
//get all students

@UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN', 'TEACHER')
  @Get('students')
  async getSTUDENTs(@Request() req) {
    const data = await this.service.getSTUDENTsForUser(req.user);
    return new ApiResponse(
      true,
      'Got users details',
      data
    )
  }
  
  //Create user 
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLE.ADMIN,  ROLE.TEACHER)
  @Post('admin-create')
  async adminCreate(@Body() dto: CreateUserDto, @Request() req) {
    const data = await this.service.adminCreate(dto, req.user.role);
    return new ApiResponse(
      true,
      'New User Created',
      data
    )
  }
  // Update a student
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN', 'TEACHER')
  @Patch('students/:id')
  async updateSTUDENT(@Param('id') id: number, @Body() dto: Partial<CreateUserDto>, @Request() req) {
    const data = await this.service.updateSTUDENT(req.user, +id, dto);
    return new ApiResponse(
      true,
      'User updated successfully',
      data
    )
  }
//delete a student
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN', 'TEACHER')
  @Delete('students/:id')
  async deleteSTUDENT(@Param('id') id: number, @Request() req) {
    const data = await this.service.deleteSTUDENT(req.user, +id);
    return new ApiResponse(
      true,
      'User Deleted successfully',
      data
    )
  }
//---------------------------------------

  // ADMIN: Get all users
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  async findAllUsers() {
    const data = await this.service.findAll();
    return new ApiResponse(
      true,
      'User List',
      data
    )
  }

  // ADMIN: Update any user
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() dto: Partial<CreateUserDto>, @Request() req) {
    const data = await this.service.updateUserByADMIN(+id, dto, req.user.role);
    return new ApiResponse(
      true,
      'User Updated successfully',
      data
    )
  }
  // ADMIN: Delete any user
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Request() req) {
    const data = await this.service.deleteUser(+id, req.user.role);
    return new ApiResponse(
      true,
      'User Deleted successfully',
      data
    )
  }
}
