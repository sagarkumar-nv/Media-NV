import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, IsOptional, IsEnum } from 'class-validator'
import { ROLE } from 'src/common/enum/role.enum';
export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsString({ message: "Gender must be Male, Female or Others."})
    @IsOptional()
    gender?: string;

    @IsOptional()
    @IsEnum(ROLE) 
    role?: ROLE;

}
