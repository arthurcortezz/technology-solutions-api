import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { ActionMenuEntity } from './action-menu.entity';

@Entity({ name: 'privileges' })
@ObjectType()
export class PrivilegeEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id?: number;

  @Column({ name: 'role_id' })
  @Field()
  roleId: number;

  @Column({ name: 'action_menu_id' })
  @Field()
  actionMenuId: number;

  @ManyToOne(() => ActionMenuEntity, (actionsMenu) => actionsMenu.privileges)
  @JoinColumn({ name: 'action_menu_id' })
  @Field(() => ActionMenuEntity, { nullable: true })
  actionsMenus?: ActionMenuEntity;

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
