import { IsNotEmpty, IsString } from "class-validator";

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  className: string;

  @IsString()
  @IsNotEmpty()
  section: string;
}
