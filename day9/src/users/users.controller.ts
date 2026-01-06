import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

   // this i created before auth, now user can register through auth routes. 
    // @Post()
    // create(@Body() createUserDto: CreateUserDto) : Promise<User> {
    //     return this.userService.create(createUserDto);
    // }

    
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

}
