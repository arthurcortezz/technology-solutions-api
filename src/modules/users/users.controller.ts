import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UserCreateDto } from './dtos/user-create.dto';
import { UserUpdateDto } from './dtos/user-update.dto';
import { JWTAuthGuard } from '../../auth/jwt-auth.guard';
import { UserInterface } from './interfaces/user.interface';
import { Roles } from '../../utils/decorators/role.decorator';
import { UserIdExistPipe } from './validate/user-id-exist.pipe';
import { AuthUser } from '../../utils/decorators/user.decorator';
import { UserFilterInterface } from './interfaces/user-filter.interface';
import { UserJwtInterface } from '../authentication/interfaces/user-jwt.interface';

@Controller('users')
@UseGuards(JWTAuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Roles('USERS_LISTAR')
  @Get()
  async findAll(
    @AuthUser() currentUser: UserJwtInterface,
    @Query() filters: UserFilterInterface,
  ): Promise<UserInterface[]> {
    return this.service.findAll(currentUser, filters);
  }

  @Get(':id')
  @Roles('USERS_LISTAR')
  async findOne(
    @Param('id', ParseIntPipe, UserIdExistPipe) id: number,
    @AuthUser() currentUser: UserJwtInterface,
  ): Promise<UserInterface> {
    return this.service.findOne(id, currentUser);
  }

  @Post()
  @Roles('USERS_CRIAR')
  async create(
    @Body() data: UserCreateDto,
    @AuthUser() currentUser: UserJwtInterface,
  ): Promise<{ user: UserInterface; message: string }> {
    const { user, message } = await this.service.create(data, currentUser);
    return { user, message };
  }

  @Put(':id')
  @Roles('USERS_MODIFICAR')
  async update(
    @Param('id', ParseIntPipe, UserIdExistPipe) id: number,
    @Body() data: UserUpdateDto,
    @AuthUser() currentUser: UserJwtInterface,
  ): Promise<{ user: UserInterface; message: string }> {
    return this.service.update(id, data, currentUser);
  }

  @Delete(':id')
  @Roles('USERS_REMOVER')
  async delete(
    @Param('id', ParseIntPipe, UserIdExistPipe) id: number,
    @AuthUser() currentUser: UserJwtInterface,
  ): Promise<{ message: string }> {
    return this.service.delete(id, currentUser);
  }
}
