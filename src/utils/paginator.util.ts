import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class PaginatorInput {
  @Field({ nullable: true })
  @IsOptional()
  perPage: number;

  @Field({ nullable: true })
  @IsOptional()
  pageNumber: number;
}
