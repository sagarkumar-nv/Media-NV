import { Controller, Get, Request, Patch, Body, UseGuards, Delete, Req } from '@nestjs/common'
import { UserService } from './user.service';
import { ApiResponse } from '../common/api_response/api.res';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private service: UserService) { }

@Get('all')
async getAllUsers(@Request() req) {
  const data = await this.service.findAllActive();
  return new ApiResponse(
    true,
    'All users fetched successfully',
    data
  );
}

  @Get('me')
  async getProfile(@Request() req) {
    const data = await this.service.findById(req.user.id);
    return new ApiResponse(
      true,
      'Got my profile',
      data
    )
  }
 
  @Patch('me')
  async updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    const data = await this.service.updateUserProfile(req.user.id, dto);
    return new ApiResponse(
      true,
      'Updated my profile',
      data
    )
  }

  @Delete('me')
  async deleteProfile(
    @Req() req,
  ) {
    const userId = req.user.id;
    const data = await this.service.deleteMe(userId);

    return new ApiResponse(
      true,
      'Profile deactivated successfully',
      data,
    );
  }


}