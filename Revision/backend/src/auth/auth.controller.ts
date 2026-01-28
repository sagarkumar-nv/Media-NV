import { Body, Controller, Post, Res, Req, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { ApiResponse } from 'src/common/api-res/api.res';
import { LoginUserDto } from './dto/login.dto';
import type { Response,Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService,
        private jwt: JwtService
    ) { }

    @Post('register')
    async register(@Body() dto: RegisterUserDto) {
        const data = await this.service.register(dto);
        return new ApiResponse(
            true,
            'Congrats! You registered successfully.',
            data
        );
    }

    @Post('login')
    async login(@Body() dto: LoginUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { token, refreshToken, safeUser } = await this.service.login(dto);
        res.cookie("token", token, {
            httpOnly: true, secure: false, sameSite: 'lax', maxAge: 15*60*1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7*24*60*60*1000
        })

        return new ApiResponse(
            true,
            'Logged In Successfully.',
            safeUser
        );
    }

    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken)   throw new NotFoundException('Refresh Token not found.');

        const user = await this.jwt.verify(refreshToken);
        const token = await this.jwt.sign(
             user,
             { secret: process.env.JWT_SECRET, expiresIn: '15m' } 
        );

        res.cookie("token", token, {
            httpOnly: true, secure: false, sameSite: 'lax', maxAge: 15*60*1000
        });
        return { message: 'token retrieve successfully' }
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return {
        success: true,
        message: 'Logged out successfully',
    };
    };

    @Post('me')
    checkToken(@Req() req: Request) {
        const refreshToken = req.cookies?.refreshToken;

        if(!refreshToken) {
            throw new UnauthorizedException('Refresh token missing!');
        }
    }
}
