import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "../../common/base.common.entities";

@Entity('usersnew')
export class User extends BaseEntity {
    @Column()
    name: string;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column({ default: true })
    isActive: boolean;

}