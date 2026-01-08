import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePersonEntity } from './entity/create.person.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CreatePersonEntity])],
  providers: [PersonService],
  controllers: [PersonController]
})
export class PersonModule {}
