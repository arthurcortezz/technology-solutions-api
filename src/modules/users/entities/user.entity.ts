import * as bcrypt from 'bcryptjs';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToOne,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id?: number;

  @Column()
  @Field({ nullable: true })
  name: string;

  @Column()
  @Field({ nullable: true })
  email: string;

  @Column()
  @Field({ nullable: true })
  cpf: string;

  @Column()
  @Field({ nullable: true })
  phone: string;

  @Column({ select: false })
  @Field({ nullable: true })
  password: string;

  @Column({ name: 'accepted_at' })
  @Field({ nullable: true })
  acceptedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Field()
  deletedAt?: Date;

  constructor(data: Partial<UserEntity> = {}) {
    Object.assign(this, data);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return (await bcrypt.compare(plainPassword, this.password)) as boolean;
  }
}
