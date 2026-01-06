import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTaskDto {

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;

}


// export class UpdateTaskDto extends PartialType(CreateTaskDto) {}   ...cleaner way