import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../../utils/role.util';
import { SortInput } from '../../utils/sort.util';
import { CarouselsService } from './carousels.service';
import { CarouselEntity } from './entities/carousel.entity';
import { PaginatorInput } from '../../utils/paginator.util';
import { CarouselFiltersInput } from './inputs/carousel.input';
import { GraphqlAuthGuard } from '../../utils/graphql-auth.util';
import { CarouselInterface } from './interfaces/carousel.interface';
import { CarouselPaginateEntity } from './entities/carousel.paginate.entity';

@Resolver(() => CarouselEntity)
@UseGuards(GraphqlAuthGuard)
export class CarouselsResolver {
  constructor(private readonly service: CarouselsService) {}

  @Roles('CAROUSELS_LISTAR')
  @Query(() => CarouselPaginateEntity)
  async carousels(
    @Args('filters') filters: CarouselFiltersInput,
    @Args('sort') sort: SortInput,
    @Args('paginator') paginator: PaginatorInput,
  ): Promise<{ rows: CarouselInterface[]; count: number }> {
    return this.service.findAllAPaginate(filters, sort, paginator);
  }
}
