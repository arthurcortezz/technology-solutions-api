import {
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'contacts' })
@ObjectType()
export class ContactEntity {
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
  phone: string;

  @Column()
  @Field({ nullable: true })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Field()
  deletedAt?: Date;
}
