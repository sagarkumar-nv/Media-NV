import { Controller, Get, Post, Put, Body, Query, Param, Delete, UseGuards } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { LearningAuthGuard } from '../auth/learning-auth/learning-auth.guard';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService:
     CityService) {}

  @Post()
  async createCity(@Body() body: Partial<City>):
  Promise <City> {
    return this.cityService.create(body);
  }

  @UseGuards(LearningAuthGuard)
  @Get()
  async findAll(): Promise<City[]> {
    return this.cityService.findAll()
  }

  @Get('search')
  async searchCity(@Query('name') name?:string,
                    @Query('metro') metro?:string,
                  ):
                  Promise<City[]>{
                    return this.cityService.search({
                      name, metro
                    })
    }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<City> {
    return this.cityService.findOne(Number(id));
  }

  @Put(':id')
  async updateCity (
    @Param('id') id: number,
    @Body() body: Partial<City>,
  ): Promise<City> {
    return this.cityService.update(id, body);
  }

  @Delete(':id')
  async deleteCity(@Param('id') id: number): Promise<{
    message: string }> {
      return this.cityService.delete(Number(id));
    }
}

