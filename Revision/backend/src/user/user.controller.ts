import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from 'src/common/api-res/api.res';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  async getAll(){
    const data = await this.userService.findAll();
    return new ApiResponse (
      true,
      "User list!",
      data
    )
  }
  @Get(':id')
    async findUser(@Param('id') id: string) {
      const data = await this.userService.findOne(id);
      return new ApiResponse(
        true,
        "Searched User!",
        data
      )
    }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const data = await this.userService.update(id, dto);
    return new ApiResponse(
      true,
      'User Updated Successfully',
      data
    )
  }

}
