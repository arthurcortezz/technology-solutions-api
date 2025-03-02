import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvitesService } from './invites.service';
import { InviteEntity } from './entities/invites.entity';
import { InvitesController } from './invites.controller';
import { MailService } from '../../utils/nodemailer/nodemailer.service';

@Module({
  exports: [InvitesService],
  providers: [InvitesService, MailService, ConfigService],
  controllers: [InvitesController],
  imports: [TypeOrmModule.forFeature([InviteEntity])],
})
export class InvitesModule {}
