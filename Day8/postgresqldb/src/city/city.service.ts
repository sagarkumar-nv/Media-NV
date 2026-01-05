import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
      private cityRepository: Repository<City>
  ) {}

    async create(cityData: Partial<City>):  
    Promise<City> {
        const city = this.cityRepository.create(cityData);
        return this.cityRepository.save(city);
    }
      async findAll(): Promise<City[]> {
         return this.cityRepository.find();
    }

      async findOne(id: number): Promise<City> {
        const city = await this.cityRepository.
        findOneBy({ id });
        if(!city){
          throw new NotFoundException(`Employee with ID ${id} not found.`)
        }
        return city;
      }

      async update(id: number, updatedData: Partial<City>): 
      Promise<City> {
        const city = await this.cityRepository.findOneBy({
          id
        });
        if(!city) {
          throw new NotFoundException(`City with ID ${id} not found.`);
        }
        const updated = Object.assign(city, updatedData);
        return this.cityRepository.save(updated);
      }

      async delete(id: number): Promise<{ message: string }> {
          const res = await this.cityRepository.delete(id);

          if(res.affected === 0) {
           throw new NotFoundException(`City not found with id: ${id}.`)
          }

          return { message: `City with ID: ${ id } has been deleted.`}
      }

        async search(filters: { name?: string; metro?: string}):
        Promise<City[]> {
          const query = this.cityRepository.createQueryBuilder('city');

          if(filters.name) {
            query.andWhere('city.name ILIKE :name',
              {name: `%${filters.name}%`}
            );
          }

          if(filters.metro) {
            query.andWhere('city.metro ILIKE :metro',
              {metro: filters.metro}
            );
          }

          return query.getMany();
        }

  }

