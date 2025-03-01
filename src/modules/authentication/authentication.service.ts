import * as crypto from 'crypto';

import { JwtService } from '@nestjs/jwt';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpStatus,
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { LoginDto } from './dtos/login.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UserJwtInterface } from './interfaces/user-jwt.interface';
import { UserInterface } from '../users/interfaces/user.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: LoginDto): Promise<{ user: UserJwtInterface; accessToken: string }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        select: ['id', 'name', 'email', 'cpf', 'phone', 'password'],
      });

      if (!user || !(await user.checkPassword(password))) {
        throw new BadRequestException('Essas credencias estão incorretas');
      }

      delete user.password;
      const { accessToken, payload } = await this.signToken(user);

      return { user: payload, accessToken };
    } catch (error) {
      console.log('🚀 ~ AuthenticationService ~ error:', error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possivel realizar o login.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(
    email: string,
    user: UserInterface | { id: number },
  ): Promise<UserInterface> {
    try {
      const id = user?.id || 0;
      return await this.usersRepository.findOne({
        where: {
          email,
          id: Not(id),
        },
        relations: [
          'role',
          'company',
          'address',
          'address.city',
          'address.city.state',
        ],
        select: ['id', 'name', 'email', 'cpf', 'phone', 'password'],
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signToken(
    user: UserInterface,
  ): Promise<{ accessToken: string; payload: UserJwtInterface }> {
    const payload = {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { accessToken: this.jwtService.sign(payload), payload };
  }

  async hasAgreedTermService(
    userId: number,
  ): Promise<{ message: string; user: UserJwtInterface; accessToken: string }> {
    try {
      let user = await this.usersRepository.findOneOrFail({
        where: { id: userId },
      });

      if (!user?.acceptedAt) {
        const acceptedAt = new Date();
        acceptedAt.setHours(acceptedAt.getHours() + 3);
        await this.usersRepository.update(userId, { acceptedAt });
      }

      user = await this.usersRepository.findOne({
        where: { id: userId },
        select: ['id', 'name', 'email', 'cpf', 'phone', 'password'],
      });

      const { accessToken, payload } = await this.signToken(user);

      return {
        message: 'Termo de serviço foi aceito',
        accessToken,
        user: payload,
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível aceitar o termo de serviço.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
