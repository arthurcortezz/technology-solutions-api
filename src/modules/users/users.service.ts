import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { UserInterface } from './interfaces/user.interface';
import { UserFilterInterface } from './interfaces/user-filter.interface';
import { PersonTypeEnum } from './enum/person-type.enum';
import { UserPublicCreateDto } from './dtos/user-public-create.dto';
import { UserJwtInterface } from '../authentication/interfaces/user-jwt.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(
    data: UserCreateDto,
    currentUser: UserJwtInterface,
  ): Promise<{
    user: UserInterface;
    message: string;
    generatePassword: string;
  }> {
    try {
      const acceptedAt = new Date();
      acceptedAt.setHours(acceptedAt.getHours() + 3);

      const cpf = data.cpf;
      const cnpj = data.cnpj;
      delete data.cpf;
      delete data.cnpj;

      const currentCompanyId =
        currentUser.role.id !== RolesProtectedEnum.ADM_GERAL
          ? currentUser.company.id
          : data.companyId;

      const entity = Object.assign(new UserEntity(), {
        ...data,
        cpf: data.cpf,
        password: data.password,
      });
      const userCreated = await this.usersRepository.save(entity);
      const user = await this.usersRepository.findOne({
        where: { id: userCreated.id },
        relations: ['company', 'role'],
      });

      return {
        user,
        message: 'O usuário foi criado com sucesso.',
        generatePassword,
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

  async update(
    id: number,
    data: UserUpdateDto,
    currentUser: UserJwtInterface,
  ): Promise<{ user: UserInterface; message: string }> {
    try {
      await this.verifyUser(id, currentUser);
      let user: UserEntity = Object.assign(new UserEntity(), data);

      if (!data.password) {
        delete user.password;
      } else {
        user.password = await user.updatePassword(data.password);
      }

      const currentCompanyId =
        currentUser.role.id !== RolesProtectedEnum.ADM_GERAL
          ? currentUser.company.id
          : data.companyId;

      const entity = Object.assign(new UserEntity(), {
        ...user,
        id,
        identificationNumber:
          data.personType === PersonTypeEnum.JURIDICA ? data.cnpj : data.cpf,
        companyId:
          data.roleId === RolesProtectedEnum.ADM_GERAL
            ? null
            : currentCompanyId,
      });
      await this.usersRepository.save({ id, ...entity });

      user = await this.usersRepository.findOne({ where: { id } });
      return { user, message: 'O usuário foi atualizado com sucesso.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possível atualizar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: number,
    currentUser: UserJwtInterface,
  ): Promise<{ message: string }> {
    try {
      await this.verifyUser(id, currentUser);
      await this.usersRepository.softDelete(id);
      return { message: 'O usuário foi removido com sucesso.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possível excluir o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  verifyUserByCurrentUser(
    user: UserInterface,
    currentUser: UserJwtInterface,
  ): boolean {
    let visible = true;
    if (currentUser.role.id !== RolesProtectedEnum.ADM_GERAL) {
      if (
        RolesProtectedEnum.ALUNO === currentUser.role.id &&
        user.id !== currentUser.id
      ) {
        visible = false;
      } else if (
        [RolesProtectedEnum.COORDENADOR, RolesProtectedEnum.PROFESSOR].includes(
          currentUser.role.id,
        ) &&
        (currentUser.company.id !== user.companyId ||
          (currentUser.company.id === user.companyId &&
            currentUser.role.id > user.roleId))
      ) {
        visible = false;
      }
    }

    if (!visible) {
      throw new HttpException(
        { message: 'Usuário não possui autorização para realizar essa ação.' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  async userIdExists(userId: number): Promise<UserInterface> {
    try {
      return await this.usersRepository.findOne({
        where: {
          id: userId,
          deletedAt: null,
        },
        select: ['id'],
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
