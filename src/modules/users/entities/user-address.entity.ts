import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';
import { CityEntity } from '../../cities/entities/city.entity';

@Entity({ name: 'users_address' })
@ObjectType()
export class UserAddressEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ name: 'street' })
  @Field({ nullable: true })
  street: string;

  @Column({ name: 'number' })
  @Field({ nullable: true })
  number: string;

  @Column({ name: 'complement' })
  @Field({ nullable: true })
  complement: string;

  @Column({ name: 'neighborhood' })
  @Field({ nullable: true })
  neighborhood: string;

  @Column({ name: 'cep' })
  @Field({ nullable: true })
  cep: string;

  @Column({ name: 'city_id' })
  @Field({ nullable: true })
  cityId: number;

  @OneToOne(() => CityEntity, (city) => city.userAddress)
  @JoinColumn({ name: 'city_id' })
  city?: CityEntity;

  @Column({ name: 'user_id' })
  @Field({ nullable: true })
  userId: number;

  @OneToOne(() => UserEntity, (user) => user.address)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

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
