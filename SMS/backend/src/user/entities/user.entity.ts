import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { ROLE } from '../../common/enum/role.enum';
import { Student } from "../../student/entities/student.entity";
import { Teacher } from "../../teacher/entities/teacher.entity";

@Entity('UserData')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ROLE,
        default: ROLE.User
    })
    role: ROLE;

    @Column({ nullable: true })
    gender: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Student, student => student.user)
    student: Student;

    @OneToOne(() => Teacher, teacher => teacher.user)
    teacher: Teacher;

}