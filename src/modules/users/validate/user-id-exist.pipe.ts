import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserIdExistPipe implements PipeTransform<any> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async transform(id: number) {
    const admin = await this.userRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(
        'Usuário não encontrado',
        `Não foi possível encontrar um usuário com esse ID: ${id}`,
      );
    }

    return id;
  }
}
