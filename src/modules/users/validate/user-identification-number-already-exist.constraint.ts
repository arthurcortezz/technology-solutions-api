import { ModuleRef } from '@nestjs/core';
import { OnModuleInit } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersService } from '../users.service';
import { UserInterface } from '../interfaces/user.interface';

let service: UsersService;

@ValidatorConstraint({
  name: 'UserIdentificationNumberAlreadyExistConstraint',
  async: true,
})
export class UserIdentificationNumberAlreadyExistConstraint
  implements ValidatorConstraintInterface, OnModuleInit
{
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit(): void {
    service = this.moduleRef.get(UsersService);
  }

  async validate(
    cpf: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    if (cpf) {
      const data: UserInterface = Object.assign(validationArguments.object);
      const entity = await service.findByCpf(cpf, data);
      return !entity;
    }

    return true;
  }
}
