import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsEmail, Min } from 'class-validator';

export class CreatePersonDto {
    @IsString()
    name: string

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    age: number

    @IsString()
    role: string

    @IsNumber()
    @Min(0)
    experience: number

    @IsString()
    department: string

    @IsBoolean()
    married: boolean;
}