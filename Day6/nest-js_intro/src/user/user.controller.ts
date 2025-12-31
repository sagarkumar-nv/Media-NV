import { Controller, Get } from '@nestjs/common';

@Controller('user')             //Decorator
export class UserController {
    @Get()
    getUser() {
        return "Welcome to my first NestJS Application!";
    }
}
