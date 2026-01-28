import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator'
import { ROLE } from 'src/common/enum/role.enum';
export class CreateUserDto {
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
    gender?: string;

    @IsIn(Object.values(ROLE), {
        message: "Role must be Student ot Teacher."
    })
    role?: ROLE;

    @IsString()
    contact: string;

}
