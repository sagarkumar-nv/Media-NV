import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  className: string;

  @IsNotEmpty()
  section: string;

  @IsUUID()
  teacherId: string;
}
