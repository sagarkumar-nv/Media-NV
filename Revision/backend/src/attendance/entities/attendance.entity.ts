import { IsIn } from "class-validator";
import { Student } from "src/student/entities/student.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('attandance')
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: Date})
    date: Date;

   @IsIn(['Present', 'Absent'])
    status: string = 'Present';

    @OneToOne(() => Student, student => student.attendance)
    student: Student;

    
}
