import { ModuleRef } from '@nestjs/core';
import { OnModuleInit } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

import { CarouselsService } from '../carousels.service';
import { CarouselInterface } from '../interfaces/carousel.interface';

let service: CarouselsService;

@ValidatorConstraint({
  name: 'CarouselNameAlreadyExistConstraint',
  async: true,
})
export class CarouselNameAlreadyExistConstraint
  implements ValidatorConstraintInterface, OnModuleInit
{
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit(): void {
    service = this.moduleRef.get(CarouselsService);
  }

  async validate(
    name: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const data: CarouselInterface = Object.assign(validationArguments.object);
    const entity = await service.findByTitle(name, data);
    return !entity;
  }
}
