import { IsIn } from "class-validator";
import { ClassEntity } from "src/classes/entities/class.entity";
import { Student } from "src/student/entities/student.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ATTENDANCE_STATUS } from "src/common/enum/attendance.enum";
@Entity('attandance')
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date'})
    date: Date;

    @Column({
    type: 'enum',
    enum: ATTENDANCE_STATUS,
    default: ATTENDANCE_STATUS.PRESENT,
    })
    status: ATTENDANCE_STATUS;

    @ManyToOne(() => Student, student => student.attendances, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'studentId'})
    student: Student;

    @ManyToOne(() => ClassEntity)
    class: ClassEntity;
    
}
