import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;

    @IsNumber()
    userId: number;
}