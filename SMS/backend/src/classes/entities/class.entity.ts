import { Teacher } from "../../teacher/entities/teacher.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "../../student/entities/student.entity";

@Entity('Classes')
export class ClassEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    section: string;

    @ManyToOne(() => Teacher, teacher => teacher.classes)
    @JoinColumn({ name: 'teacher_id' })
    classTeacher: Teacher;

    @OneToMany(() => Student, student => student.class)
    students: Student[];

    @Column({ default: true })
    status: boolean;

}
