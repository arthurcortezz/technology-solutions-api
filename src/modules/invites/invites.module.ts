import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvitesService } from './invites.service';
import { InviteEntity } from './entities/invites.entity';
import { InvitesController } from './invites.controller';
import { MailService } from '../../utils/nodemailer/nodemailer.service';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  exports: [InvitesService],
  providers: [InvitesService, MailService, ConfigService],
  controllers: [InvitesController],
  imports: [TypeOrmModule.forFeature([InviteEntity, UserEntity])],
})
export class InvitesModule {}
