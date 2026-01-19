import { Repository, DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { Injectable } from "@nestjs/common";


export class UserRepo extends Repository<User> {
    async paginate(page: number, limit: number) {
        return this.createQueryBuilder("u")
        .skip((page-1) *limit)
        .take(limit)
        .getManyAndCount();
    }

    findByEmail(email: string) {
        return this.findOne({where: { email } });
    }
}