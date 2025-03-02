import { Module } from '@nestjs/common';
import { MailService } from './nodemailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class NodemailerModule {}
