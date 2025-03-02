import { Post, Body, UseGuards, Controller } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserCreateDto } from './dtos/user-create.dto';
import { JWTAuthGuard } from '../../auth/jwt-auth.guard';
import { UserInterface } from './interfaces/user.interface';
import { Roles } from '../../utils/decorators/role.decorator';

@Controller('users')
@UseGuards(JWTAuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async create(
    @Body() data: UserCreateDto,
  ): Promise<{ user: UserInterface; message: string }> {
    const { user, message } = await this.service.create(data);
    return { user, message };
  }
}
