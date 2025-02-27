import { Field, ObjectType } from '@nestjs/graphql';

import { CarouselEntity } from './carousel.entity';

@ObjectType()
export class CarouselPaginateEntity {
  @Field(() => [CarouselEntity])
  rows: CarouselEntity[];

  @Field()
  count: number;
}
