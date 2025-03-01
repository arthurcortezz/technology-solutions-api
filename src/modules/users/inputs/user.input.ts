import { IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType('UserFiltersInput')
export class UserFiltersInput {
  @Field({ nullable: true })
  @IsOptional()
  id?: number;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;
}
