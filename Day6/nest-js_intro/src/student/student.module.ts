import { Module } from '@nestjs/common';
import { STUDENTService } from './student.service';
import { STUDENTController } from './student.controller';

@Module({
  providers: [STUDENTService],
  controllers: [STUDENTController]
})
export class STUDENTModule { }
