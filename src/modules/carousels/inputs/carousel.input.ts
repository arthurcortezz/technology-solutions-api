import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType('CarouselFiltersInput')
export class CarouselFiltersInput {
  @Field({ nullable: true })
  @IsOptional()
  id?: number;

  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  icon?: string;
}
