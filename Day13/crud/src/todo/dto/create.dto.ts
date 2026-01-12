import { IsOptional, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateTask {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    status: boolean;
    
}