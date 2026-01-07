import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCatDto {
    @ApiProperty({ example: 'Milo'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'persian'})
    @IsString()
    @IsNotEmpty()
    breed: string;

    @ApiProperty({ example: 2})
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    age: number;

    
}