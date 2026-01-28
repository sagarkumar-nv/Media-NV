import { Student } from "src/student/entities/student.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('marks')
export class Mark {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    subject: string;

    @Column()
    mark: number;

    @OneToOne(() => Student, student => student.mark)
    student: Student;
}
