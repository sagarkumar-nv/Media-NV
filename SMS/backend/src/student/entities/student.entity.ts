import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { ClassEntity } from "../../classes/entities/class.entity";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  rollno: string;

  @Column()
  grade: string;

  @OneToOne(() => User, user => user.student, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => ClassEntity, classEntity => classEntity.students, { nullable: true })
  @JoinColumn({ name: "class_id" })
  class: ClassEntity;
}
