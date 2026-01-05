import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('city')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    metro: boolean;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    population: number

}
