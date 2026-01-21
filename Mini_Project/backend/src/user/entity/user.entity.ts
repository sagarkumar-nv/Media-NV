import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ROLE } from '../../common/enum/role.enum';
import { GENDER } from '../../common/enum/gender.enum';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ROLE,
        default: ROLE.STUDENT
    })
    role: ROLE;

    @Column({
        type: 'enum',
        enum: GENDER,
        default: GENDER.FEMALE
    })
    gender: GENDER;

    @Column({ default: true })
    status: boolean;
}