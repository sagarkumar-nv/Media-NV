import { PartialType } from '@nestjs/mapped-types';
import { CreateTask } from './create.dto';

export class UpdateTaskDto extends PartialType(CreateTask) {}