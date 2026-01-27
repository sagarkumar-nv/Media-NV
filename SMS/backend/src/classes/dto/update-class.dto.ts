import { IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsNotEmpty()
  className?: string;

  @IsOptional()
  @IsNotEmpty()
  section?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;
}
