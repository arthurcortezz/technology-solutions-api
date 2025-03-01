import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class AuthenticationTokenExistPipe implements PipeTransform<any> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async transform(token: string) {
    const user = await this.usersRepository.findOne({
      where: { rememberToken: token },
    });

    if (!user) {
      throw new NotFoundException(
        'Não existe nenhuma solicitação de redefinição com esse token.',
      );
    }

    return token;
  }
}
