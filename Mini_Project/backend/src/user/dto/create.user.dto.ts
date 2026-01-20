// create-user.dto.ts
import { IsNotEmpty, IsEmail, MinLength, IsEnum } from 'class-validator';
import { ROLE } from '../../common/enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(ROLE)
  role: ROLE;
}
