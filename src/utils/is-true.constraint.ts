import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsTrueConstraint', async: false })
export class IsTrueConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return value === true;
  }

  defaultMessage(): string {
    return 'Campo deve ser true';
  }
}
