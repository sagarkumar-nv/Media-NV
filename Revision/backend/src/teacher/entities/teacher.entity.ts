import { ClassEntity } from "src/classes/entities/class.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('teacher')
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    subject: string;

    @OneToOne(() => User, user => user.teacher)
    @JoinColumn({ name: 'userId'})
    user: User;

    @OneToOne(() => ClassEntity, classes => classes.teacher)
    class: ClassEntity;

    @Column({ default: true })
    isActive: boolean;

}
