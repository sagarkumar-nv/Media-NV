import { Injectable, ForbiddenException, NotFoundException, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.user.dto';
import { ROLE } from '../common/enum/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) { }

  //common
  async getAllUsers() {
  return this.repo.find({
    select: ['id', 'name', 'email', 'role'], // exclude password
  });
}

  // Anyone can see their profile(ADMIN/ TEACHER/ STUDENT)
  async findById(userId: number) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const { password, ...safeUser } = user;
    return safeUser;
  }

  //Anyone can update their profile
  async updateUserProfile(userId: number, dto: Partial<User>, role: ROLE) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    const updated = await this.repo.save(user);
    const { password, ...safeUser } = updated;
    return safeUser;
  }
  //------------------------------------------
  // Common for teacher and admin
  //get all students

  async adminCreate(dto: CreateUserDto, creatorRole: ROLE) {

    if (!dto.role) {
    dto.role = ROLE.STUDENT;
  }

  // STUDENT cannot create anyone
  if (creatorRole === ROLE.STUDENT) {
    throw new ForbiddenException('Students cannot create users');
  }

  // TEACHER can only create STUDENT
  if (creatorRole === ROLE.TEACHER && dto.role !== ROLE.STUDENT) {
    throw new ForbiddenException('Teachers can only create students');
  }

  // ADMIN can create anyone (no restriction)

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = this.repo.create({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    role: dto.role
  });
  const existingUser = await this.repo.findOne({
    where: { email: dto.email }
  });
  if(existingUser)  throw new BadGatewayException('Email already registered')

  return this.repo.save(user);
}


  async getSTUDENTsForUser(performer: User) {
    if (performer.role === ROLE.ADMIN) {
      return this.repo.find({ where: { role: ROLE.STUDENT && ROLE.TEACHER } });
    } else if (performer.role === ROLE.TEACHER) {
      // Optionally filter by TEACHER assignment if you add TEACHERId
      return this.repo.find({ where: { role: ROLE.STUDENT } });
    } else {
      throw new ForbiddenException('Only TEACHER or admin can view students');
    }
  }
  // Update a student(ADMIN/TEACHER)
  async updateSTUDENT(performer: User, studentId: number, dto: Partial<User>) {
    const student = await this.repo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('STUDENT not found');

    // TEACHERs can only edit students
    if (performer.role === ROLE.TEACHER && student.role !== ROLE.STUDENT) {
      throw new ForbiddenException('TEACHERs can only edit students');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(student, dto);
    const updated = await this.repo.save(student);
    const { password, ...safeUser } = updated;
    return safeUser;
  }

  // Delete a student
  async deleteSTUDENT(performer: User, studentId: number) {
    const student = await this.repo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('STUDENT not found');

    // TEACHERs can only delete students
    if (performer.role === ROLE.TEACHER && student.role !== ROLE.STUDENT) {
      throw new ForbiddenException('TEACHERs can only delete students');
    }

    await this.repo.remove(student);
    return { message: 'STUDENT deleted successfully' };
  }

  // ------------------------
  // Find all users (admin view)
  // ------------------------
  findAll() {
    return this.repo.find({
      select: ['id', 'name', 'email', 'role'],
    });
  }
  
  // ------------------------
  // Update any user (admin only)
  // ------------------------
  async updateUserByADMIN(id: number, dto: Partial<CreateUserDto>, creatorRole: ROLE) {
    if (creatorRole !== ROLE.ADMIN) {
      throw new ForbiddenException('Only ADMIN can update users');
    }

    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    const updated = await this.repo.save(user);
    const { password, ...safeUser} = updated;
    return safeUser;
  }

  // Delete user (admin only)
  async deleteUser(id: number, creatorRole: ROLE) {
    if (creatorRole !== ROLE.ADMIN) {
      throw new ForbiddenException('Only ADMIN can delete users');
    }

    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.repo.remove(user);
    const { password, email, ...safeUser} = updated;
    return { message: 'User deleted successfully', email};
  }

  
}
