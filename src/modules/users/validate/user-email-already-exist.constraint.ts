import { OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersService } from '../users.service';
import { UserInterface } from '../interfaces/user.interface';

let service: UsersService;

@ValidatorConstraint({ name: 'UserEmailAlreadyExistConstraint', async: true })
export class UserEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface, OnModuleInit
{
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit(): void {
    service = this.moduleRef.get(UsersService);
  }

  async validate(
    email: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const data: UserInterface = Object.assign(validationArguments.object);
    const entity = await service.findByEmail(email, data);
    return !entity;
  }
}
