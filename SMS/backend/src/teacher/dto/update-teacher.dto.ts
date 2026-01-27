import { PartialType } from '@nestjs/mapped-types';
import { CreateteacherDto } from './create-teacher.dto';

export class UpdateteacherDto extends PartialType(CreateteacherDto) { }
