import { BadRequestException, Injectable, Res, Response, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register.dto';
import { ROLE } from 'src/common/enum/role.enum';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private repo: Repository<User>,
        @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
        @InjectRepository(Student) private studentRepo: Repository<Student>,
        private jwt: JwtService
    ){}

    async register(dto: RegisterUserDto) {
        const exist = await this.repo.findOne({ 
            where: { email: dto.email }
        });
        if(exist) throw new BadRequestException('Email alredy exist!');
        if(dto.role === ROLE.Admin) throw new BadRequestException('Unauthorized! You cannot register as Admin.')
        
        const hashedPassword = await bcrypt.hash(dto.password, 15);
       // console.log(hashedPassword)

        const role = dto.role === 'Teacher' ? ROLE.Teacher : ROLE.Student;

        //const { role, ...userData } = CreateUSerDto;

        const user = this.repo.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
            gender: dto.gender
        });

        const savedUser = await this.repo.save(user);
    
        if (role === ROLE.Student) {
            const student = this.studentRepo.create({
            user: savedUser,
            });
            await this.studentRepo.save(student);
        }

        if (role === ROLE.Teacher) {
            const teacher = this.teacherRepo.create({
            user: savedUser,
            });
            await this.teacherRepo.save(teacher);
        }


        return this.repo.save(user);
    }

    async login(dto: LoginUserDto) {

        const user = await this.repo.findOne({
            where: { email: dto.email}
        });
        
        if (!user || user.status === false) {
            throw new UnauthorizedException("Account is inactive");
        }
        if(!user) throw new BadRequestException('User not found! check the email!.')
        
        const match = await bcrypt.compare(dto.password, user.password);

        if(!match) throw new BadRequestException('Incorrect Password!');

        const token = await this.jwt.sign(
             {id: user.id, role: user.role},
             { secret: process.env.JWT_SECRET, expiresIn: '30m' } 
        );

        const refreshToken = await this.jwt.sign(
             {id: user.id, role: user.role},
             { secret: process.env.JWT_SECRET, expiresIn: '15d' } 
        );


        const { password, ...safeUser } = user;

        return { token, refreshToken, safeUser }
    }
}
