import { Body, Controller, Get, Param, Patch, Post, ParseIntPipe, Delete } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create.person.dto';
import { UpdatePersonDto } from './dto/update.person.dto';
import { CreatePersonEntity } from './entity/create.person.entity';


@Controller('person')
export class PersonController {
  constructor(private readonly perS: PersonService) {}

  @Post()
  create(@Body() perDto: CreatePersonDto) {
    return this.perS.create(perDto);
  }

  @Get()
  findAll() {
    return this.perS.findAll();
  }

  @Get(':id')
findById(@Param('id') id: string) {  
  return this.perS.findById(id);
}

@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
  return this.perS.update(id, dto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.perS.remove(id);
}
}

