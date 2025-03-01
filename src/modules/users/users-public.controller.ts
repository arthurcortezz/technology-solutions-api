import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserInterface } from './interfaces/user.interface';
import { UserPublicCreateDto } from './dtos/user-public-create.dto';

@Controller('public/users')
export class UsersPublicController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async create(
    @Body() data: UserPublicCreateDto,
  ): Promise<{ user: UserInterface; message: string }> {
    return await this.service.createPublic(data);
  }
}
