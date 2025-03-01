import {
  Post,
  Body,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { ContactsService } from './contacts.service';
import { ContactCreateDto } from './dtos/contact-create.dto';
import { ContactInterface } from './interfaces/contacts-interface';

@Controller('contacts')
@UseInterceptors(ClassSerializerInterceptor)
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Post()
  async create(
    @Body() data: ContactCreateDto,
  ): Promise<{ contact: ContactInterface; message: string }> {
    return this.service.create(data);
  }
}
