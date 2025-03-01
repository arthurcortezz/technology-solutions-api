import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { UserEntity } from '../users/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtStrategy } from '../../providers/authentication/jwt.strategy';
import { UserAddressEntity } from '../users/entities/user-address.entity';
import { ClassTeacherEntity } from '../classes/entities/class-teachers.entity';
import { ClassStudentsEntity } from '../classes/entities/class-students.entity';
import { ViewMenuByUserRolesEntity } from './entities/view-menu-by-user-roles.entity';
import { AuthenticationTokenExistPipe } from './validate/authentication-token-exist.pipe';
import { ViewPrivilegesByUserRolesEntity } from './entities/view-privileges-by-user-roles.entity';
import { AuthenticationEmailAlreadyExist } from './validate/authentication-email-already-exist.constraint';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserAddressEntity,
      ClassTeacherEntity,
      ClassStudentsEntity,
      ViewMenuByUserRolesEntity,
      ViewPrivilegesByUserRolesEntity,
    ]),
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
    AuthenticationService,
    AuthenticationTokenExistPipe,
    AuthenticationEmailAlreadyExist,
    JwtStrategy,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
