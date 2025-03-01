import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { createOrder } from 'src/utils/create-order.util';
import { CarouselEntity } from './entities/carousel.entity';
import { CarouselCreateDto } from './dtos/carousel-create.dto';
import { CarouselUpdateDto } from './dtos/carousel-update.dto';
import { createFilters } from '../../utils/create-filters.utils';
import { createPaginator } from 'src/utils/create-paginator.util';
import { SortInterface } from 'src/utils/interfaces/sort.interface';
import { CarouselInterface } from './interfaces/carousel.interface';
import { PaginatorInterface } from 'src/utils/interfaces/paginator.interface';
import { CarouselFilterInterface } from './interfaces/carousel-filter.interface';

@Injectable()
export class CarouselsService {
  constructor(
    @InjectRepository(CarouselEntity)
    private readonly carouselsRepository: Repository<CarouselEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filters?: CarouselFilterInterface,
  ): Promise<CarouselInterface[]> {
    try {
      const where = createFilters(filters);
      return await this.carouselsRepository.find({
        where,
        order: { title: 'ASC' },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar os carrousels.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<CarouselInterface> {
    try {
      return await this.carouselsRepository
        .createQueryBuilder('carousel')
        .where('carousel.id = :id', { id })
        .orderBy('carousel.id', 'ASC')
        .getOne();
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o carrossel.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllAPaginate(
    filters?: CarouselFilterInterface,
    sort?: SortInterface,
    paginator?: PaginatorInterface,
  ): Promise<{ rows: CarouselInterface[]; count: number }> {
    try {
      const { skip, take } = createPaginator(paginator);
      const order = createOrder(sort);

      const where = createFilters(filters);

      const [rows, count] = await this.carouselsRepository.findAndCount({
        where,
        order,
        skip,
        take,
      });
      return { rows, count };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar os carrosseis.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByTitle(
    title: string,
    data: CarouselInterface,
  ): Promise<CarouselInterface> {
    try {
      const id = data.id || 0;
      return await this.carouselsRepository.findOne({
        select: ['title'],
        where: {
          title,
          id: Not(id),
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o carrossel.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    data: CarouselCreateDto,
  ): Promise<{ carousel: CarouselInterface; message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entity = Object.assign(new CarouselEntity(), data);
      const carousel = await this.carouselsRepository.save(entity);

      await queryRunner.commitTransaction();
      return { carousel, message: 'O carrossel foi criado com sucesso.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        { message: 'Não foi possível criar o carrossel.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    data: CarouselUpdateDto,
  ): Promise<{ carousel: CarouselInterface; message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.carouselsRepository.update(id, data);

      await queryRunner.commitTransaction();
      const carousel = await this.carouselsRepository.findOne({
        where: { id },
      });
      return { carousel, message: 'O carrossel foi atualizado com sucesso.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        { message: 'Não foi possível atualizar o carrossel.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      await this.carouselsRepository.delete(id);

      return { message: 'O carrossel foi removido com sucesso' };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível excluir o carrossel.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
