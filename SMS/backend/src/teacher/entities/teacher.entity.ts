import { Entity, Column, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { ClassEntity } from "../../classes/entities/class.entity";
import { User } from "../../user/entities/user.entity";

@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    subject: string;

    @OneToOne(() => User, user => user.teacher, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @OneToMany(() => ClassEntity, classEntity => classEntity.classTeacher)
    @JoinColumn()
    classes: ClassEntity[];
}
