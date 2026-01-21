import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional, IsIn } from "class-validator";
import { ROLE } from '../../common/enum/role.enum';
import { GENDER } from '../../common/enum/gender.enum';

export class RegisterUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsIn(Object.values(ROLE), {
        message: "Role must be STUDENT or TEACHER only."
    })
    @IsOptional()
    role?: ROLE;

    @IsIn(
        Object.values(GENDER), {
        message: "Gender must be MALE or FEMALE only."
    })
    @IsOptional()
    gender?: GENDER;
}
