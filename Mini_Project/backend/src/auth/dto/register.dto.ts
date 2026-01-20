import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from "class-validator";
import { ROLE } from '../../common/enum/role.enum';
import { GENDER } from '../../common/enum/gender.enum';

export class RegisterUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail({ })
    email: string;

    @MinLength(6)
    password: string;

    @IsEnum(ROLE)
    @IsOptional()
    role?: ROLE;

    @IsEnum(GENDER)
    @IsOptional()
    gender?: GENDER;
}
