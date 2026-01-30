import { IsDateString, IsEnum } from "class-validator";
import { ATTENDANCE_STATUS } from "../../common/enum/attendance.enum"


export class CreateAttendanceDto {
  @IsDateString()
  date: string;

  @IsEnum(ATTENDANCE_STATUS)
  status: ATTENDANCE_STATUS;
}
