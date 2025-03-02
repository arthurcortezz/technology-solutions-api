import * as crypto from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InviteEntity } from './entities/invites.entity';
import { InviteCreateDto } from './dtos/invite-create.dto';
import { InviteInterface } from './interfaces/invites-interface';
import { MailService } from 'src/utils/nodemailer/nodemailer.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly invitesRepository: Repository<InviteEntity>,

    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    private readonly nodemailerService: MailService,

    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<InviteInterface[]> {
    try {
      const invites = await this.invitesRepository.find({
        where: { deletedAt: null },
        order: { createdAt: 'DESC' },
      });

      if (!invites) {
        throw new HttpException(
          { message: 'Convites não encontrados.' },
          HttpStatus.NOT_FOUND,
        );
      }
      return invites;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Não foi possível encontrar os convites.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(token: string): Promise<InviteInterface> {
    try {
      const invite = await this.invitesRepository.findOne({
        where: { inviteCode: token },
      });

      if (!invite) {
        throw new HttpException(
          { message: 'Convite não encontrado.' },
          HttpStatus.NOT_FOUND,
        );
      }
      return invite;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Não foi possível criar o convite.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string): Promise<InviteInterface> {
    try {
      const invite = await this.invitesRepository.findOne({
        where: { email },
      });

      if (!invite) {
        throw new HttpException(
          { message: 'Convite não encontrado.' },
          HttpStatus.NOT_FOUND,
        );
      }
      return invite;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Não foi possível criar o convite.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    data: InviteCreateDto,
  ): Promise<{ invite: InviteInterface; message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existingInvite = await this.invitesRepository.findOne({
        where: { email: data.email },
      });

      if (existingInvite) {
        throw new HttpException(
          { message: 'Já existe um convite enviado para este e-mail.' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const inviteCode = this.generateRandomCode();

      const entity = Object.assign(new InviteEntity(), {
        ...data,
        status: 'pending',
        inviteCode: inviteCode,
      });
      const invite = await this.invitesRepository.save(entity);

      await this.nodemailerService.sendMail(
        data.email,
        'Convite para o sistema',
        `Olá, você foi convidado para acessar o sistema. Para aceitar o convite, acesse o link: ${process.env.APP_FRONTEND_URL}/cadastro/${inviteCode}`,
      );

      await queryRunner.commitTransaction();
      return { invite, message: 'O convite foi enviado com sucesso.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        { message: 'Não foi possível criar o convite.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  generateRandomCode(): string {
    return crypto.randomBytes(20).toString('hex');
  }

  updateStatus(
    invite: InviteInterface,
    status: string,
  ): Promise<InviteInterface> {
    return this.invitesRepository.save({
      ...invite,
      status: status,
    });
  }

  async countByStatus() {
    try {
      const result = await this.invitesRepository
        .createQueryBuilder('invites')
        .select('invites.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('invites.status')
        .getRawMany();
      return result;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível listar o gráfico.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async countByRoleId() {
    try {
      const result = await this.usersRepository
        .createQueryBuilder('user')
        .innerJoin('user.role', 'role')
        .select('role.name', 'role')
        .addSelect('COUNT(user.id)', 'count')
        .groupBy('role.name')
        .getRawMany();

      return result;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível listar o gráfico.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
