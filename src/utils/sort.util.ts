import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType()
export class SortInput {
  @Field({ nullable: true })
  @IsOptional()
  field: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sort: Sort;
}
