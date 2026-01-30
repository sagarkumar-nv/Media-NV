import { IsEnum } from "class-validator";
import { ROLE } from "src/common/enum/role.enum";

export class UpdateUserRoleDto {
  @IsEnum(ROLE)
  role: ROLE;
}
