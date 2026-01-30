import { Attendance } from "src/attendance/entities/attendance.entity";
import { ClassEntity } from "src/classes/entities/class.entity";
import { Mark } from "src/marks/entities/mark.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('student')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    roll_no: string;

    @OneToOne(() => User, user => user.student)
    @JoinColumn({name: 'userId'})
    user: User;

    @ManyToOne(() => ClassEntity, classentity => classentity.students, {nullable: true})
    @JoinColumn({name: 'classId'})
    class: ClassEntity;

    @OneToMany(() => Attendance, attendance => attendance.student)
    attendances: Attendance[];

    @OneToMany(() => Mark, mark => mark.student)
    mark: Mark[];

    @Column({ default: true})
    isActive: boolean;

}
