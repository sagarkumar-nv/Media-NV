import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/update-auth.dto';
import { ApiResponse } from '../common/api_response/api.res';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}

   @Post('register')
    async register(@Body() dto: RegisterUserDto) {
        const data = await this.service.register(dto);
        return new ApiResponse(true, "User registered successfully", data);
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
