import * as crypto from 'crypto';

import { JwtService } from '@nestjs/jwt';
import { DataSource, Not, Repository } from 'typeorm';
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
import { CreateUserDto } from './dtos/create-user.dto';
import { ViewMenuByUserRolesEntity } from './entities/view-menu-by-user-roles.entity';
import { InvitesService } from '../invites/invites.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(ViewMenuByUserRolesEntity)
    private readonly viewMenusByRolesRepository: Repository<ViewMenuByUserRolesEntity>,

    private readonly jwtService: JwtService,

    private readonly dataSource: DataSource,

    private readonly inviteService: InvitesService,
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
    try {
      const userEntity = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['role'],
      });

      const menus = await this.viewMenusByRolesRepository.find({
        where: { roleId: userEntity.roleId },
      });

      const payload = {
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        phone: user.phone,
        menus,
        roleId: userEntity.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return { accessToken: this.jwtService.sign(payload), payload };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possível fazer o login.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    const transactionManager = queryRunner.manager;

    try {
      await queryRunner.startTransaction();

      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email já cadastrado!');
      }

      const invite = await this.inviteService.findByEmail(createUserDto.email);

      await this.inviteService.updateStatus(invite, 'accepted');

      const user = Object.assign(new UserEntity(), createUserDto);

      user.roleId = 3;

      user.hashPassword();

      const newUser = this.usersRepository.create(user);

      await transactionManager.save(newUser);

      await queryRunner.commitTransaction();

      return { message: 'Usuário criado com sucesso, faça o login.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possível criar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findByCpf(
    cpf: string,
    user: UserInterface | { id: number },
  ): Promise<UserInterface> {
    try {
      const id = user?.id || 0;
      return await this.usersRepository.findOne({
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

  async findAll(): Promise<UserInterface[]> {
    try {
      return await this.usersRepository.find({
        relations: ['role'],
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar os usuários.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
