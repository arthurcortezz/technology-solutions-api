import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AppDataSource } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { CarouselsModule } from './modules/carousels/carousels.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule,
    ContactsModule,
    CarouselsModule,
    AuthenticationModule,
    TypeOrmModule.forRoot(AppDataSource.options),
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
})
export class AppModule {}
