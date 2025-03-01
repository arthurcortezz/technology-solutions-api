import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ContactEntity } from './entities/contact.entity';
import { ContactCreateDto } from './dtos/contact-create.dto';
import { ContactInterface } from './interfaces/contacts-interface';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactsRepository: Repository<ContactEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async create(
    data: ContactCreateDto,
  ): Promise<{ contact: ContactInterface; message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const entity = Object.assign(new ContactEntity(), data);
      const contact = await this.contactsRepository.save(entity);

      await queryRunner.commitTransaction();
      return { contact, message: 'A mensagem foi enviada com sucesso.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        { message: 'Não foi possível criar a mensagem.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
