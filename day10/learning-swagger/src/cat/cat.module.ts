import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { Cat } from './entity/cat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
   imports: [TypeOrmModule.forFeature([Cat])],
  controllers: [CatController],
  providers: [CatService]
})
export class CatModule {}
