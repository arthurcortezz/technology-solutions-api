import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserEntity } from './entities/user.entity';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: UserCreateDto): Promise<{
    user: UserInterface;
    message: string;
  }> {
    try {
      const entity = Object.assign(new UserEntity(), data);
      const userCreated = await this.usersRepository.save(entity);
      const user = await this.usersRepository.findOne({
        where: { id: userCreated.id },
      });

      return {
        user,
        message: 'O usuário foi criado com sucesso.',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possível criar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCpf(
    cpf: string,
    data: UserInterface | { id: number },
  ): Promise<UserInterface> {
    try {
      const id = data.id || 0;
      return await this.usersRepository.findOne({
        select: ['cpf'],
        where: {
          cpf,
          id: Not(id),
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(
    email: string,
    data: UserInterface | { id: number },
  ): Promise<UserInterface> {
    try {
      const id = data.id || 0;
      return await this.usersRepository.findOne({
        select: ['email'],
        where: {
          email,
          id: Not(id),
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userIdExists(id: number): Promise<UserInterface> {
    try {
      return await this.usersRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
