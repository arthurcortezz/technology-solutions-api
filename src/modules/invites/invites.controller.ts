import {
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { InvitesService } from './invites.service';
import { JWTAuthGuard } from '../../auth/jwt-auth.guard';
import { InviteCreateDto } from './dtos/invite-create.dto';
import { InviteInterface } from './interfaces/invites-interface';

@Controller('invites')
@UseInterceptors(ClassSerializerInterceptor)
export class InvitesController {
  constructor(private readonly service: InvitesService) {}

  @Get()
  @UseGuards(JWTAuthGuard)
  async findAll(): Promise<InviteInterface[]> {
    return this.service.findAll();
  }

  @Get('status')
  @UseGuards(JWTAuthGuard)
  async chartStatus(): Promise<{ data: any; message: string }> {
    const data = await this.service.countByStatus();
    return { data, message: 'Contagem de convites por status.' };
  }

  @Get('roles')
  @UseGuards(JWTAuthGuard)
  async chartRoles(): Promise<{ data: any; message: string }> {
    const data = await this.service.countByRoleId();
    return { data, message: 'Contagem de usuários por roleId.' };
  }

  @Get(':token')
  async findOne(@Param() data: { token: string }): Promise<InviteInterface> {
    return this.service.findOne(data.token);
  }

  @Post()
  @UseGuards(JWTAuthGuard)
  async create(
    @Body() data: InviteCreateDto,
  ): Promise<{ invite: InviteInterface; message: string }> {
    return this.service.create(data);
  }
}
