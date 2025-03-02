import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MenuEntity } from './menu.entity';
import { ActionEntity } from './action.entity';
import { PrivilegeEntity } from './privilege.entity';

@Entity({ name: 'actions_menus' })
@ObjectType()
export class ActionMenuEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id?: number;

  @Column({ name: 'action_id' })
  @Field()
  actionId: number;

  @Column({ name: 'menu_id' })
  @Field()
  menuId: number;

  @ManyToOne(() => MenuEntity, (menu) => menu.actionsMenus)
  @JoinColumn({ name: 'menu_id' })
  @Field(() => MenuEntity, { nullable: true })
  menu?: MenuEntity;

  @OneToOne(() => ActionEntity)
  @JoinColumn({ name: 'action_id' })
  @Field(() => ActionEntity, { nullable: true })
  action?: ActionEntity;

  @OneToMany(() => PrivilegeEntity, (privilege) => privilege.actionsMenus, {
    cascade: true,
  })
  @Field(() => [PrivilegeEntity], { nullable: true })
  privileges?: PrivilegeEntity[];

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
