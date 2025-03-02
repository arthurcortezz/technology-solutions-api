import {
  Get,
  Post,
  Body,
  UseGuards,
  Controller,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { JWTAuthGuard } from '../../auth/jwt-auth.guard';
import { AuthUser } from '../../utils/decorators/user.decorator';
import { AuthenticationService } from './authentication.service';
import { UserJwtInterface } from './interfaces/user-jwt.interface';
import { UserInterface } from '../users/interfaces/user.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}

  @Post('login')
  async login(
    @Body() data: LoginDto,
  ): Promise<{ user: UserJwtInterface; accessToken: string }> {
    return this.service.login(data);
  }

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  async me(@AuthUser() user: UserJwtInterface): Promise<UserJwtInterface> {
    try {
      return user;
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível obter os dados do usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('users')
  @UseGuards(JWTAuthGuard)
  async findAll(): Promise<UserInterface[]> {
    try {
      return this.service.findAll();
    } catch (error) {
      throw new HttpException(
        { message: 'Não foi possível obter os dados do usuário.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create-account')
  async createAccount(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    return this.service.createUser(createUserDto);
  }
}
