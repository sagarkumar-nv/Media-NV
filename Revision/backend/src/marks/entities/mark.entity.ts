import { Student } from "src/student/entities/student.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('marks')
export class Mark {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    subject: string;

    @Column()
    mark: number;

    @ManyToOne(() => Student, student => student.mark, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'studentId'})
    student: Student;
}
