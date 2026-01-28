import { ROLE } from "src/common/enum/role.enum";
import { Student } from "src/student/entities/student.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true})
    contact?: string;

    @Column({
        type: 'enum',
        enum: ROLE,
        default: ROLE.Student
    })
    role?: ROLE;

    @Column({nullable: true})
    gender?: string;

    @Column({default: true})
    status: boolean;

    @OneToOne(() => Student, student => student.user)
    student: Student;

    @OneToOne(() => Teacher, teacher => teacher.user)
    teacher: Teacher;

    @CreateDateColumn( { nullable: true })
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
}
