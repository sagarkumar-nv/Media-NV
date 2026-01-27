import { IsString } from "class-validator";

export class CreateteacherDto { 
    @IsString()
    subject: string;

    @IsString()
    userId: string;

    @IsString()
    classId: string;
}
