import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE } from '../../auth/common/enum/role.enum';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
     username: string;

     @Column({ unique: true})
     email: string;
     
     @Column()
     password: string;

     @Column({ 
        type: 'enum',
        enum: ROLE,
        default: ROLE.User,
     })
     role: ROLE;

     @CreateDateColumn()
     createdAt: Date;
}