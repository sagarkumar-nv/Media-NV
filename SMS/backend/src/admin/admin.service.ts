import { BadGatewayException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { ROLE } from 'src/common/enum/role.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class adminService {
    constructor(@InjectRepository(User)
    private repo: Repository<User>) { }

    async adminCreate(dto: CreateUserDto, creatorRole: ROLE) {

        if (!dto.role) {
            dto.role = ROLE.Student;
        }
        if (creatorRole === ROLE.Student) {
            throw new ForbiddenException('students cannot create users');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = this.repo.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
            gender: dto.gender
        });
        const existingUser = await this.repo.findOne({
            where: { email: dto.email }
        });
        if (existingUser) throw new BadGatewayException('Email already registered')

        return this.repo.save(user);
    }

    async getUserForadmin(performer: User) {
        if (performer.role === ROLE.Admin) {
            return this.repo.find({ where: { role: ROLE.Student && ROLE.Teacher && ROLE.Admin } })
        }
        throw new ForbiddenException('Only admin can check User list')
    }

    async updateUserByadmin(
        id: string,
        dto: Partial<CreateUserDto>,
        creatorRole: ROLE,
    ) {
        if (creatorRole !== ROLE.Admin) {
            throw new ForbiddenException('Only admin can update users');
        }

        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (dto.role && !Object.values(ROLE).includes(dto.role)) {
            throw new ForbiddenException('Invalid role');
        }

        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
        }

        Object.assign(user, dto);

        const updated = await this.repo.save(user);

        const { password, ...safeUser } = updated;
        return safeUser;
    }

    async softDeleteUserByadmin(userId: string, creatorRole: ROLE, adminId: string) {
        if (creatorRole !== ROLE.Admin) {
            throw new ForbiddenException('Only admin can delete users');
        }

        const user = await this.repo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (![ROLE.Student, ROLE.Teacher].includes(user.role)) {
            throw new ForbiddenException('admin can only delete students or teachers');
        }

        user.status = false;
        await this.repo.save(user);

        return {
            message: `User (${user.role}) deleted successfully`,
            deletedUserId: user.id,
        };
    }
}
