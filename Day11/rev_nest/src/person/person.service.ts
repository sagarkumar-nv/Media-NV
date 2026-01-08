import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonEntity } from './entity/create.person.entity';
import { CreatePersonDto } from './dto/create.person.dto';
import { UpdatePersonDto } from './dto/update.person.dto';

@Injectable()
export class PersonService {
    constructor(@InjectRepository(CreatePersonEntity)
                private readonly perRepo: Repository<CreatePersonEntity>
            ) {}

            async create(dto: CreatePersonDto): Promise<CreatePersonEntity> {
                try{
                    const existingPer = await this.perRepo.findOneBy({ email: dto.email });
                    if(existingPer) {
                        throw new BadRequestException('Email already exists');
                    }

                    const per = this.perRepo.create(dto);
                    const savePer = await this.perRepo.save(per);
                    return savePer;
                }catch(err){
                    throw new BadRequestException("Enter correct details:", err.message)
                }
            }

            async findAll(): Promise<CreatePersonEntity[]> {
                return await this.perRepo.find();
            }

            async findById(id: string): Promise<CreatePersonEntity> {
                try{
                const res = await this.perRepo.findOneBy({ id });
                if(!res){ 
                    throw new NotFoundException('Person Not Found');
                }
                return res;
            }catch(err){
                throw new BadRequestException(err);
            }
        }

            async update(id: string, dto: UpdatePersonDto): Promise<CreatePersonEntity> {
                try{
                    const per = await this.perRepo.findOne({
                        where: { id },
                    });
                    if(!per) {
                        throw new NotFoundException('Person Not Found');
                    }
                    const updPer = this.perRepo.merge(per, dto);
                    return await this.perRepo.save(updPer);
                }catch(err){
                        throw new BadRequestException(err);
                }
            }

            async remove(id: string): Promise<{msg: string}> {
                try{
                    const per = await this.perRepo.delete(id);
                    if(per.affected === 0) {
                        throw new NotFoundException('Person Not Found');
                    }
                    return { msg: 'Person Removed' }
                }catch(err){
                    throw new BadRequestException(err);
                }
            }
        
}
