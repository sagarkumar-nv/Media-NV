import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { ApiResponse } from 'src/common/api_response_handling/api.res';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}

   @Post('register')
    async register(@Body(new ValidationPipe()) dto: RegisterUserDto) {
        const data = await this.service.register(dto);
        return new ApiResponse(
            true,
            "User registerd successfully",
            data
        )
    }



    @Post('login')
    async login(@Body() dto: LoginUserDto) {
        const data = await this.service.login(dto);
        return new ApiResponse(
            true,
            "User loggedIn successfully",
            data
        )
    }

}
