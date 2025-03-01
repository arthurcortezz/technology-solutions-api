import * as crypto from 'crypto';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Not, Repository } from 'typeorm';

import { UserJwtInterface } from './interfaces/user-jwt.interface';

import { LoginDto } from './dtos/login.dto';
import { RecoverPasswordDto } from './dtos/recover-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { EditProfileDto } from './dtos/edit-profile.dto';
import { EditPasswordDto } from './dtos/edit-password.dto';

import { UserEntity } from '../users/entities/user.entity';
import { UserInterface } from '../users/interfaces/user.interface';
import { ViewMenuByUserRolesEntity } from './entities/view-menu-by-user-roles.entity';
import { ViewPrivilegesByUserRolesEntity } from './entities/view-privileges-by-user-roles.entity';
import { PersonTypeEnum } from '../users/enum/person-type.enum';
import { RolesProtectedEnum } from '../roles/enum/roles.enum';
import { UserAddressEntity } from '../users/entities/user-address.entity';
import { ClassStudentsEntity } from '../classes/entities/class-students.entity';
import { ClassTeacherEntity } from '../classes/entities/class-teachers.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(ViewMenuByUserRolesEntity)
    private readonly viewMenusByRolesRepository: Repository<ViewMenuByUserRolesEntity>,

    @InjectRepository(ViewPrivilegesByUserRolesEntity)
    private readonly viewPrivilegesByRolesRepository: Repository<ViewPrivilegesByUserRolesEntity>,

    @InjectRepository(ClassStudentsEntity)
    private readonly classStudentRepository: Repository<ClassStudentsEntity>,

    @InjectRepository(ClassTeacherEntity)
    private readonly classTeacherRepository: Repository<ClassTeacherEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: LoginDto): Promise<{ user: UserJwtInterface; accessToken: string }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: [
          'role',
          'company',
          'address',
          'address.city',
          'address.city.state',
        ],
        select: [
          'id',
          'name',
          'email',
          'personType',
          'identificationNumber',
          'phone',
          'password',
          'roleId',
          'acceptedAt',
        ],
      });

      if (!user || !(await user.checkPassword(password))) {
        throw new BadRequestException('Essas credencias estão incorretas');
      }

      if (user.role.id !== RolesProtectedEnum.ADM_GERAL && !user.company) {
        throw new HttpException(
          { message: 'Usuário não possui associação com nenhuma empresa' },
          HttpStatus.BAD_REQUEST,
        );
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
        select: [
          'id',
          'name',
          'email',
          'personType',
          'identificationNumber',
          'phone',
          'password',
          'roleId',
          'acceptedAt',
        ],
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível encontrar o usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editProfile(
    id: number,
    data: EditProfileDto,
  ): Promise<{ message: string; user: UserJwtInterface; accessToken: string }> {
    try {
      let user = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: ['address'],
      });
      const cpf = data.cpf;
      const cnpj = data.cnpj;
      delete data.cpf;
      delete data.cnpj;

      await this.usersRepository.save({
        ...user,
        ...data,
        id,
        identificationNumber:
          data.personType === PersonTypeEnum.JURIDICA ? cnpj : cpf,
        address: data.address
          ? {
              ...user.address,
              ...data.address,
              id: user.address?.id ?? null,
            }
          : undefined,
      });
      user = await this.usersRepository.findOne({
        where: { email: data.email },
        relations: [
          'role',
          'company',
          'address',
          'address.city',
          'address.city.state',
        ],
        select: [
          'id',
          'name',
          'email',
          'personType',
          'identificationNumber',
          'phone',
          'password',
          'roleId',
          'acceptedAt',
        ],
      });

      const { accessToken, payload } = await this.signToken(user);

      return {
        message: 'O dados foram atualizados com sucesso!',
        accessToken,
        user: payload,
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível modificar os dados.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editPassword(
    id: number,
    body: EditPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: [
          'role',
          'company',
          'address',
          'address.city',
          'address.city.state',
        ],
        select: [
          'id',
          'name',
          'email',
          'personType',
          'identificationNumber',
          'phone',
          'password',
          'roleId',
          'acceptedAt',
        ],
      });

      if (!(await user.checkPassword(body.password))) {
        throw new HttpException(
          { message: 'A senha atual está incorreta.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.usersRepository.update(id, {
        password: await user.updatePassword(body.newPassword),
      });

      return { message: 'Sua senha foi alterada com sucesso!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possível editar a senha.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async recoverPassword(
    body: RecoverPasswordDto,
  ): Promise<{ user: UserInterface; token: string }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: body.email },
      });

      if (user) {
        if (
          (new Date().getTime() - new Date(user.resetPasswordAt).getTime()) /
            60000 <
            15 &&
          user.rememberToken !== null
        ) {
          throw new HttpException(
            {
              message:
                'A redefinição de senha já foi solicitada. Tente mais tarde!',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const passwordRecoveryToken = crypto
          .createHash('md5')
          .update(`${user.email}${Date.now()}`)
          .digest('hex');

        await this.usersRepository.save({
          id: user.id,
          rememberToken: passwordRecoveryToken,
          resetPasswordAt: new Date(),
        });

        return { user, token: passwordRecoveryToken };
      }

      return { user: null, token: null };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possível enviar a recuperação da senha.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkResetToken(token: string): Promise<UserEntity> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { rememberToken: token },
      });
    } catch (error) {
      throw new NotFoundException(
        'Não existe nenhuma solicitação de redefinição com esse token!',
      );
    }
  }

  async resetPassword(
    token: string,
    body: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { rememberToken: token },
      });

      const currentTime = new Date().getTime();
      const expiresAt = new Date(
        user.resetPasswordAt.getTime() + 60 * 60 * Number(24) * 1000,
      );

      if (currentTime > expiresAt.getTime()) {
        throw new HttpException(
          { message: 'Esse token está expirado!' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const password = await user.updatePassword(body.password);
      Object.assign(user, { password, rememberToken: null });
      await this.usersRepository.save(user);

      return { message: 'A senha foi redefinida com sucesso!' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Não foi possível redefinir a senha.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signToken(
    user: UserInterface,
  ): Promise<{ accessToken: string; payload: UserJwtInterface }> {
    const menus = await this.viewMenusByRolesRepository.find({
      where: { roleId: user.roleId },
    });

    const privileges = await this.viewPrivilegesByRolesRepository.find({
      where: {
        roleId: user.roleId,
      },
      select: ['key'],
    });

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      personType: user.personType,
      identificationNumber: user.identificationNumber,
      phone: user.phone,
      role: user.role,
      company: user.company,
      menus,
      privileges,
      acceptedAt: user.acceptedAt,
      address: user.address,
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
        relations: [
          'role',
          'company',
          'address',
          'address.city',
          'address.city.state',
        ],
        select: [
          'id',
          'name',
          'email',
          'personType',
          'identificationNumber',
          'phone',
          'password',
          'roleId',
          'acceptedAt',
        ],
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

  async getClassesMatters(
    user: UserJwtInterface,
  ): Promise<{ class: string; matter: string }[] | null> {
    if (user.role.id === RolesProtectedEnum.PROFESSOR) {
      const classes = await this.classTeacherRepository.find({
        where: { teacherId: user.id },
        relations: ['class', 'matter', 'class.classStudents'],
      });
      if (classes) {
        return classes.map((classMatter) => ({
          class: classMatter.class.name,
          matter: classMatter.matter.name,
          quantityStudents: classMatter.class.classStudents.length,
        }));
      }
    } else if (user.role.id === RolesProtectedEnum.ALUNO) {
      const classes = await this.classStudentRepository.findOne({
        where: { userId: user.id },
        relations: [
          'class',
          'class.teachers',
          'class.classStudents',
          'class.teachers.class',
          'class.teachers.matter',
        ],
      });
      if (classes) {
        return classes.class.teachers.map((classMatter) => ({
          class: classMatter.class.name,
          matter: classMatter.matter.name,
          quantityStudents: classes.class.classStudents.length,
        }));
      }
    } else {
      return null;
    }
  }
}
