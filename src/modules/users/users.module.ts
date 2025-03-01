import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UserIdExistPipe } from './validate/user-id-exist.pipe';
import { UserIdExistConstraint } from './validate/user-id-exist.constraint';
import { UserEmailAlreadyExistConstraint } from './validate/user-email-already-exist.constraint';
import { UserIdentificationNumberAlreadyExistConstraint } from './validate/user-identification-number-already-exist.constraint';

@Module({
  controllers: [UsersController],
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersService,
    UserIdExistPipe,
    UserIdExistConstraint,
    UserEmailAlreadyExistConstraint,
    UserIdentificationNumberAlreadyExistConstraint,
  ],
})
export class UsersModule {}
