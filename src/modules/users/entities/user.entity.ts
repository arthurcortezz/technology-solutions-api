import * as bcrypt from 'bcryptjs';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEntity } from './role.entity';

@Entity({ name: 'users' })
@ObjectType()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id?: number;

  @Column()
  @Field({ nullable: true })
  name: string;

  @Column({ unique: true })
  @Field({ nullable: true })
  email: string;

  @Column({ unique: true })
  @Field({ nullable: true })
  cpf: string;

  @Column()
  @Field({ nullable: true })
  phone: string;

  @Column()
  @Field({ nullable: true })
  cep: string;

  @Column()
  @Field({ nullable: true })
  uf: string;

  @Column()
  @Field({ nullable: true })
  city: string;

  @Column()
  @Field({ nullable: true })
  neighborhood: string;

  @Column()
  @Field({ nullable: true })
  street: string;

  @Column({ select: false })
  @Field({ nullable: true })
  password: string;

  @Column({ name: 'role_id' })
  @Field({ nullable: true })
  roleId: number;

  @OneToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  @Field(() => RoleEntity, { nullable: true })
  role?: RoleEntity;

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

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2a\$\d+\$/.test(this.password)) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
