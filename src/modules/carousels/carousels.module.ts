import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarouselsService } from './carousels.service';
import { CarouselsResolver } from './carousels.resolver';
import { CarouselEntity } from './entities/carousel.entity';
import { CarouselsController } from './carousels.controller';
import { CarouselIdExistPipe } from './validate/carousel-id-exist.pipe';
import { CarouselNameAlreadyExistConstraint } from './validate/carousel-name-already-exist.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([CarouselEntity])],
  controllers: [CarouselsController],
  providers: [
    CarouselsService,
    CarouselsResolver,
    CarouselIdExistPipe,
    CarouselNameAlreadyExistConstraint,
  ],
  exports: [CarouselsService],
})
export class CarouselsModule {}
