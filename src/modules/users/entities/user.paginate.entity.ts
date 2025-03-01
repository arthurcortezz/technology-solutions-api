import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';

@ObjectType()
export class UserPaginateEntity {
  @Field(() => [UserEntity])
  rows: UserEntity[];

  @Field()
  count: number;
}
