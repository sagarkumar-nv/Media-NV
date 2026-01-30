import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from 'src/common/api-res/api.res';
import { JwtAuthGuard } from 'src/common/guards/authguard';
import { ROLE } from 'src/common/enum/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ================= ME =================

  @Get('me')
  async getMyProfile(@Req() req) {
    const data = await this.userService.findOne(req.user);
    console.log('user',data);
    if(!data) return null;
    return new ApiResponse(true, 'My profile', data);
  }

  // ================= USERS =================
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllUsers() {
    const data = await this.userService.findAll();
    return new ApiResponse(true, 'User list!', data);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUser(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const data = await this.userService.findOne(id);
    return new ApiResponse(true, 'Searched User!', data);
  }

  // ================= UPDATE =================
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException('You can update only your own profile');
    }

    const data = await this.userService.update(id, dto);
    return new ApiResponse(true, 'Profile updated successfully', data);
  }

}
