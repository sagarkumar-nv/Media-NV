import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { ROLE } from "src/common/enum/role.enum";

export class CreateTeacherDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  // teacher-specific
  @IsOptional()
  @IsString()
  subject?: string;

  @IsEnum(ROLE)
  role: ROLE.Teacher;
}
