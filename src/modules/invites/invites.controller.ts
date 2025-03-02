import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { InvitesService } from './invites.service';
import { InviteCreateDto } from './dtos/invite-create.dto';
import { InviteInterface } from './interfaces/invites-interface';

@Controller('invites')
@UseInterceptors(ClassSerializerInterceptor)
export class InvitesController {
  constructor(private readonly service: InvitesService) {}

  @Get(':token')
  async findOne(@Param() data: { token: string }): Promise<InviteInterface> {
    return this.service.findOne(data.token);
  }

  @Post()
  async create(
    @Body() data: InviteCreateDto,
  ): Promise<{ invite: InviteInterface; message: string }> {
    return this.service.create(data);
  }
}
