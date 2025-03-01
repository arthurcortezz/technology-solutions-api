import * as bcrypt from 'bcryptjs';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserAddressEntity } from './user-address.entity';

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

  @Column({ name: 'person_type' })
  @Field({ nullable: true })
  personType: string;

  @Column({ name: 'identification_number' })
  @Field({ nullable: true })
  identificationNumber: string;

  @Column()
  @Field({ nullable: true })
  phone: string;

  @Column({ select: false })
  @Field({ nullable: true })
  password: string;

  @Column({ name: 'remember_token' })
  @Field()
  rememberToken: string;

  @Column({ name: 'reset_password_at' })
  @Field()
  resetPasswordAt: Date;

  @Column({ name: 'accepted_at' })
  @Field({ nullable: true })
  acceptedAt?: Date;

  @OneToOne(() => UserAddressEntity, (address) => address.user, {
    cascade: true,
  })
  @Field(() => UserAddressEntity, { nullable: true })
  address?: UserAddressEntity;

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

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2a\$\d+\$/.test(this.password)) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async updatePassword?(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return (await bcrypt.compare(plainPassword, this.password)) as boolean;
  }
}
