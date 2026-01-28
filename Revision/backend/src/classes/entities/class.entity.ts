import { Student } from "src/student/entities/student.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('classes')
export class ClassEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    className: string;

    @Column()
    section: string;

    @OneToMany(() => Student, student => student.class)
    student: Student;

    @OneToOne(() => Teacher, teacher => teacher.class)
    @JoinColumn({ name: 'teacherId'})
    teacher: Teacher;

}
