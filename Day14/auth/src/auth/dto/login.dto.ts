import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from '../../user/dto/user.dto';

export class LoginDto extends PartialType(CreateUserDto) {}