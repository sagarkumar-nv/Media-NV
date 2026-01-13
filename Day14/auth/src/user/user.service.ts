import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User)
    private readonly repo: Repository<User>,
    ) {}

    findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
    }

    create(user: Partial<User>) {
        return this.repo.save(user);
    }
}
