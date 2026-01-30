import { IsOptional, IsString } from "class-validator";

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  roll_no?: string;
}
