import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}

   @Post('register')
    register(@Body(new ValidationPipe()) dto: RegisterUserDto) {
        return this.service.register(dto);
    }


    @Post('login')
    login(@Body() dto: LoginUserDto) {
        return this.service.login(dto);
    }

}
