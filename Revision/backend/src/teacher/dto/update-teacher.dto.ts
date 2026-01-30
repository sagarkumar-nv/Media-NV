import { IsOptional, IsString } from "class-validator";

export class UpdateTeacherDto {
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
  subject?: string;
}
