import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactsService } from './contacts.service';
import { ContactEntity } from './entities/contact.entity';
import { ContactsController } from './contacts.controller';

@Module({
  exports: [ContactsService],
  providers: [ContactsService],
  controllers: [ContactsController],
  imports: [TypeOrmModule.forFeature([ContactEntity])],
})
export class ContactsModule {}
