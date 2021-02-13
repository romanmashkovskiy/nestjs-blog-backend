import * as bcrypt from 'bcryptjs';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordTokenExpires: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  validateEmailToken: string;

  @Column({ nullable: true })
  validateEmailTokenExpires: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
