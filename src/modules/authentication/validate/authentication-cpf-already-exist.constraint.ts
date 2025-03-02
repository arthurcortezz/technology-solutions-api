import { ModuleRef } from "@nestjs/core";
import { OnModuleInit } from "@nestjs/common";
import {
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from "class-validator";

import { AuthenticationService } from "../authentication.service";
import { UserInterface } from "../../users/interfaces/user.interface";

let service: AuthenticationService;

@ValidatorConstraint({
  name: "AuthenticationCpfAlreadyExist",
  async: true,
})
export class AuthenticationCpfAlreadyExist
  implements ValidatorConstraintInterface, OnModuleInit
{
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit(): void {
    service = this.moduleRef.get(AuthenticationService);
  }

  async validate(
    cpf: string,
    validationArguments: ValidationArguments
  ): Promise<boolean> {
    const body: UserInterface = Object.assign(
      validationArguments.object
    );
    const entity = await service.findByCpf(cpf, { id: body.id });
    return !entity;
  }
}
