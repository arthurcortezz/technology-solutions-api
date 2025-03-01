import { ModuleRef } from '@nestjs/core';
import { OnModuleInit } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UsersService } from '../users.service';

let service: UsersService;

@ValidatorConstraint({ name: 'UserIdExistConstraint', async: true })
export class UserIdExistConstraint
  implements ValidatorConstraintInterface, OnModuleInit
{
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit(): void {
    service = this.moduleRef.get(UsersService);
  }

  async validate(
    userId: number,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    if (userId && typeof userId === 'number') {
      const entity = await service.userIdExists(userId);
      return entity ? true : false;
    } else if (userId && Array.isArray(userId)) {
      userId.forEach(async (id) => {
        const entity = await service.userIdExists(id);
        if (!entity) {
          return false;
        }
      });
      return true;
    }
  }
}
