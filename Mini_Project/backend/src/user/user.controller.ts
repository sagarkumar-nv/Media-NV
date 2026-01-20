import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('user')
export class UserController {
    constructor(private service:UserService){}
    @Get()
    find() {
        return this 
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles('ADMIN')
    @Post('admin-create')
    adminCreate(@Body() dto: CreateUserDto, @Request() req) {
    return this.service.adminCreate(dto, req.user.role);
    }


}
