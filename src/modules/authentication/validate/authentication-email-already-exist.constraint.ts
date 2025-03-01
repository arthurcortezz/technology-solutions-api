import { OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { AuthenticationService } from '../authentication.service';
import { UserInterface } from '../../users/interfaces/user.interface';


let service: AuthenticationService;

@ValidatorConstraint({ name: 'AuthenticationEmailAlreadyExist', async: true })
export class AuthenticationEmailAlreadyExist
  implements ValidatorConstraintInterface, OnModuleInit
{
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit(): void {
    service = this.moduleRef.get(AuthenticationService);
  }

  async validate(
    email: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const body: UserInterface = Object.assign(validationArguments.object);
    const entity = await service.findByEmail(email, { id: body.id });
    return !entity;
  }
}
