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

import { Roles } from '../../utils/role.util';
import { CarouselsService } from './carousels.service';
import { JWTAuthGuard } from '../../auth/jwt-auth.guard';
import { CarouselUpdateDto } from './dtos/carousel-update.dto';
import { CarouselCreateDto } from './dtos/carousel-create.dto';
import { CarouselIdExistPipe } from './validate/carousel-id-exist.pipe';
import { CarouselInterface } from './interfaces/carousel.interface';

@Controller('carousels')
@UseInterceptors(ClassSerializerInterceptor)
export class CarouselsController {
  constructor(private readonly service: CarouselsService) {}

  // Rota de listar sem autenticação
  @Get()
  @Roles('CAROUSELS_LISTAR')
  async findAll(): Promise<CarouselInterface[]> {
    return this.service.findAll();
  }

  // Rota de detalhes com autenticação
  @Get(':id')
  @Roles('CAROUSELS_LISTAR')
  @UseGuards(JWTAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe, CarouselIdExistPipe) id: number,
  ): Promise<CarouselInterface> {
    return this.service.findOne(id);
  }

  // Rota de criação com autenticação
  @Post()
  @Roles('CAROUSELS_CRIAR')
  @UseGuards(JWTAuthGuard)
  async create(
    @Body() data: CarouselCreateDto,
  ): Promise<{ carousel: CarouselInterface; message: string }> {
    return this.service.create(data);
  }

  // Rota de atualização com autenticação
  @Put(':id')
  @Roles('CAROUSELS_MODIFICAR')
  @UseGuards(JWTAuthGuard)
  async update(
    @Param('id', ParseIntPipe, CarouselIdExistPipe) id: number,
    @Body() data: CarouselUpdateDto,
  ): Promise<{ carousel: CarouselInterface; message: string }> {
    return this.service.update(id, data);
  }

  // Rota de deletação com autenticação
  @Delete(':id')
  @Roles('CAROUSELS_REMOVER')
  @UseGuards(JWTAuthGuard)
  async delete(
    @Param('id', ParseIntPipe, CarouselIdExistPipe) id: number,
  ): Promise<{ message: string }> {
    return this.service.delete(id);
  }
}
