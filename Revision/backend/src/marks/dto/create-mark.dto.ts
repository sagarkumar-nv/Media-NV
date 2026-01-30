import { IsString, IsNumber } from "class-validator";

export class CreateMarkDto {
  @IsString()
  subject: string;

  @IsNumber()
  mark: number;
}
