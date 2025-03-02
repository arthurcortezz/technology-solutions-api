import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { CarouselsService } from './carousels.service';
import { JWTAuthGuard } from '../../auth/jwt-auth.guard';
import { CarouselUpdateDto } from './dtos/carousel-update.dto';
import { CarouselCreateDto } from './dtos/carousel-create.dto';
import { CarouselInterface } from './interfaces/carousel.interface';
import { CarouselIdExistPipe } from './validate/carousel-id-exist.pipe';

@Controller('carousels')
@UseInterceptors(ClassSerializerInterceptor)
export class CarouselsController {
  constructor(private readonly service: CarouselsService) {}

  @Get()
  async findAll(): Promise<CarouselInterface[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe, CarouselIdExistPipe) id: number,
  ): Promise<CarouselInterface> {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JWTAuthGuard)
  async create(
    @Body() data: CarouselCreateDto,
  ): Promise<{ carousel: CarouselInterface; message: string }> {
    return this.service.create(data);
  }

  @Put(':id')
  @UseGuards(JWTAuthGuard)
  async update(
    @Param('id', ParseIntPipe, CarouselIdExistPipe) id: number,
    @Body() data: CarouselUpdateDto,
  ): Promise<{ carousel: CarouselInterface; message: string }> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  async delete(
    @Param('id', ParseIntPipe, CarouselIdExistPipe) id: number,
  ): Promise<{ message: string }> {
    return this.service.delete(id);
  }
}
