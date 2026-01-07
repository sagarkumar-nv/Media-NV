import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from './entity/cat.entity';
import { CreateCatDto } from './dto/create-cat-dto';

@Injectable()
export class CatService {
    constructor( @InjectRepository(Cat) 
                private readonly catRepo: Repository<Cat>)  {}

    async create(dto: CreateCatDto): Promise<Cat>
     {
        const cat = this.catRepo.create(dto);
        return await this.catRepo.save(cat);
    }

    async findAll(): Promise<Cat[]> {
        return await this.catRepo.find();
    }

    async findByBreed(breed: string): Promise<Cat[]> {
        return this.catRepo.find({ where: {breed}});
    }

    async update(id: number, dto: CreateCatDto): Promise<Cat> {

        const cat = await this.catRepo.findOne({
            where: { id },
        });
        if(!cat) {
            throw new NotFoundException('Cat Not Found')
        }
        const updatedCat = this.catRepo.merge(cat, dto)
        return await this.catRepo.save(updatedCat);
    }

    async remove(id: number): Promise<{msg: string}> {

        const res = await this.catRepo.delete(id);
        if(res.affected == 0) {
            throw new NotFoundException('Task Not Found');
        }
        return { msg: 'Cat data removed successfully.'}
    }
}
