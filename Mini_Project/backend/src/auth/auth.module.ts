import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
        secret: process.env.JWT_SECRET || 'defaultSecret',
        signOptions: { expiresIn: '15m' }, 
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {

}
