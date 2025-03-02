import {
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { ActionMenuEntity } from './action-menu.entity';

@Entity({ name: 'menus' })
@ObjectType()
export class MenuEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id?: number;

  @Column()
  @Field({ nullable: true })
  name: string;

  @Column()
  @Field({ nullable: true })
  route: string;

  @Column({ name: 'key' })
  @Field({ nullable: true })
  key: string;

  @Column()
  @Field({ nullable: true })
  icon: string;

  @OneToMany(() => ActionMenuEntity, (actionsMenu) => actionsMenu.menu, {
    cascade: true,
  })
  @JoinColumn({ name: 'action_id' })
  @Field(() => [ActionMenuEntity], { nullable: true })
  actionsMenus: ActionMenuEntity[];

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
