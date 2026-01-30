import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ROLE } from "src/common/enum/role.enum";

export class CreateUserByAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(ROLE)
  role: ROLE; // Student | Teacher

  // optional (teacher only)
  @IsOptional()
  subject?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsString()
  @IsOptional()
  gender?: string
}
