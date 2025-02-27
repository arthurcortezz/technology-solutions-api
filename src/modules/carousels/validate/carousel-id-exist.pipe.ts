import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';

import { CarouselEntity } from '../entities/carousel.entity';

@Injectable()
export class CarouselIdExistPipe implements PipeTransform<any> {
  constructor(
    @InjectRepository(CarouselEntity)
    private readonly carouselsRepository: Repository<CarouselEntity>,
  ) {}

  async transform(id: number) {
    const carousels = await this.carouselsRepository.findOne({ where: { id } });

    if (!carousels) {
      throw new NotFoundException(
        'Carrosel não encontrado',
        `Não foi possível encontrar um carrosel com esse ID: ${id}`,
      );
    }

    return id;
  }
}
