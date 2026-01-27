import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, IsIn, IsString } from "class-validator";
import { ROLE } from '../../common/enum/role.enum';

export class RegisterUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsIn(Object.values(ROLE), {
        message: "Role must be student or teacher only."
    })
    @IsOptional()
    role?: ROLE;

    @IsOptional()
    @IsIn(['male', 'female', 'other'])
    gender?: string;

}
