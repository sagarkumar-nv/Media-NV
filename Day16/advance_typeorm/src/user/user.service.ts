import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepo } from './user.repository';
import { CreateUserDto } from './dto/createuser.dto';
import { UpdateUserDto } from './dto/updateuser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repo: UserRepo
    ) {}

    async create(dto: CreateUserDto) {
        const user = this.repo.create(dto);
        return this.repo.save(user);
    }

    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.repo.paginate(page, limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit)
        };
    }

    async findOne(id: number) {
    return this.repo.findOne({ where: { id } });
    }

    async update(id: number, dto: UpdateUserDto) {
        await this.repo.update(id, dto);
        return this.findOne(id);
    }

    async softDelete(id: number) {
        return this.repo.softDelete(id);
    }
}
