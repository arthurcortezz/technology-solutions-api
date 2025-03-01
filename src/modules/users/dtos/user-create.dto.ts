import { IsCPF } from 'brazilian-class-validator';
import {
  IsEmail,
  Matches,
  IsString,
  Validate,
  MaxLength,
  IsDefined,
  MinLength,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

import { PersonTypeEnum } from '../enum/person-type.enum';
import { Match } from '../../../utils/decorators/match.decorator';
import { UserEmailAlreadyExistConstraint } from '../validate/user-email-already-exist.constraint';
import { UserIdentificationNumberAlreadyExistConstraint } from '../validate/user-identification-number-already-exist.constraint';

export class UserCreateDto {
  @IsDefined({
    message: 'Nome: O campo do "name" deve ser válido.',
  })
  @IsString({
    message: 'Nome: O campo do "name" deve ser uma string.',
  })
  @IsNotEmpty({
    message: 'Nome: O campo do "name" não pode ser vazio.',
  })
  @MinLength(2, {
    message: 'Nome: O campo do "name" deve possuir no mínimo 2 caracteres.',
  })
  @MaxLength(50, {
    message: 'Nome: O campo do "name" deve possuir no máximo 50 caracteres.',
  })
  name: string;

  @IsNotEmpty({ message: 'E-mail: O campo do "email" não pode ser vazio.' })
  @Validate(UserEmailAlreadyExistConstraint, {
    message: 'E-mail: Já existe um Usuário com este Email.',
  })
  @IsDefined({ message: 'E-mail: O campo do "email" deve ser válido.' })
  @IsString({ message: 'E-mail: O campo do "email" deve ser uma string.' })
  @IsEmail({}, { message: 'E-mail: O campo "email" deve ser válido.' })
  email: string;

  @ValidateIf((obj) => obj.personType === PersonTypeEnum.FISICA)
  @IsDefined({
    message: 'CPF: O campo "cpf" deve ser válido!',
  })
  @IsString({ message: 'CPF: O campo "cpf" deve ser uma string!' })
  @MinLength(11, {
    message: 'CPF: O campo "cpf" precisa ter pelo menos 11 caracteres.',
  })
  @MaxLength(11, {
    message: 'CPF: O campo "cpf" precisa ter pelo menos 11 caracteres.',
  })
  @IsCPF({ message: 'O campo "cpf" precisa ser válido.' })
  @Matches(/^[0-9]*$/, { message: 'CPF: Somente números são permitidos.' })
  @Validate(UserIdentificationNumberAlreadyExistConstraint, {
    message: 'Já existe um Usuário com este CPF.',
  })
  cpf: string;

  @IsNotEmpty({ message: 'Telefone: O campo "phone" é obrigátorio.' })
  @Matches(/^[0-9]*$/, { message: 'Telefone: Somente números são permitidos.' })
  @IsString({ message: 'Telefone: O campo "phone" deve ser uma string.' })
  phone: string;

  @ValidateIf((obj) => obj.confirmPassword)
  @IsDefined({
    message: 'Senha: O campo "password" deve ser válido!',
  })
  @IsString({ message: 'Senha: O campo "password" deve ser uma string.' })
  @IsNotEmpty({ message: 'Senha: O campo "password" não pode ser vázio.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha é muito fraca, por favor utilize uma senha forte.',
  })
  password: string;

  @ValidateIf((obj) => obj.password)
  @IsDefined({
    message: 'Confirmação da senha: O campo "confirmPassword" deve ser válido!',
  })
  @IsString({
    message:
      'Confirmação da senha: O campo "confirmPassword" deve ser uma string.',
  })
  @IsNotEmpty({
    message:
      'Confirmação da senha: O campo "confirmPassword" não pode ser vázio.',
  })
  @Match('password', {
    message: 'As senhas não coincidem-se, por favor tente novamente.',
  })
  confirmPassword: string;
}
