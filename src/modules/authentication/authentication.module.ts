import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '../auth/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationEmailAlreadyExist } from './validate/authentication-email-already-exist.constraint';
import { AuthenticationCpfAlreadyExist } from './validate/authentication-cpf-already-exist.constraint';
import { ViewMenuByUserRolesEntity } from './entities/view-menu-by-user-roles.entity';
import { InvitesModule } from '../invites/invites.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    InvitesModule,
    TypeOrmModule.forFeature([UserEntity, ViewMenuByUserRolesEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    JwtStrategy,
    AuthenticationService,
    AuthenticationCpfAlreadyExist,
    AuthenticationEmailAlreadyExist,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
