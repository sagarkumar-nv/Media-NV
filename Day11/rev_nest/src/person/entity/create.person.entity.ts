import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class CreatePersonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    age: number;

    @Column()
    role: string;

    @Column()
    experience: number;

    @Column()
    department: string;

    @CreateDateColumn()
    onboard: Date;

    @Column()
    married: boolean;

    @Column({ type: 'int', nullable: true }) // real DB column
    salary: number;

    @BeforeInsert()
    @BeforeUpdate()
    calculateSalary() {
        this.salary = this.age * 10000;
    }
}
