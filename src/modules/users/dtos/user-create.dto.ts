import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';

import { Match } from '../../../shared/decorators/match.decorator';
import { Transform } from 'class-transformer';
import { IsCNPJ, IsCPF } from 'brazilian-class-validator';

import { CompanyIdExistConstraint } from '../../companies/validate/company-id-exist.constraint';
import { PersonTypeEnum } from '../enum/person-type.enum';
import { RolesProtectedEnum } from '../../roles/enum/roles.enum';
import { RoleIdExistConstraint } from '../../roles/validate/role-id-exist.constraint';
import { UserEmailAlreadyExistConstraint } from '../validate/user-email-already-exist.constraint';
import { UserIdentificationNumberAlreadyExistConstraint } from '../validate/user-identification-number-already-exist.constraint';
import { IsTrueConstraint } from '../../../shared/validate/is-true.constraint';

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

  @IsDefined({
    message: 'Tipo Pessoa: O campo de "personType" deve ser válido.',
  })
  @Transform(({ value }) => value.toUpperCase().trim())
  @IsEnum(PersonTypeEnum, {
    message: `Tipo Pessoa: O campo de "personType" deve ser válido (${Object.values(
      PersonTypeEnum,
    ).join(', ')})`,
  })
  personType: string;

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

  @ValidateIf((obj) => obj.personType === PersonTypeEnum.JURIDICA)
  @IsDefined({
    message: 'CNPJ: O campo "cnpj" deve ser válido!',
  })
  @IsString({
    message: 'CNPJ: O campo "cnpj" deve ser uma string!',
  })
  @MinLength(14, {
    message: 'CNPJ: O campo "cnpj" precisa ter pelo menos 14 caracteres.',
  })
  @MaxLength(14, {
    message: 'CNPJ: O campo "cnpj" precisa ter pelo menos 14 caracteres.',
  })
  @IsCNPJ({
    message: 'CNPJ: O campo "cnpj" precisa ser válido.',
  })
  @Matches(/^[0-9]*$/, { message: 'CNPJ: Somente números são permitidos.' })
  @Validate(UserIdentificationNumberAlreadyExistConstraint, {
    message: 'Já existe um Usuário com este CNPJ.',
  })
  cnpj: string;

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

  @IsNotEmpty({
    message: 'ID do Perfil de acesso: O campo "roleId" não pode ser vázio.',
  })
  @Validate(RoleIdExistConstraint, {
    message: 'Não existe um Perfil com esse ID.',
  })
  roleId: number;

  @ValidateIf((obj) => obj.roleId !== RolesProtectedEnum.ADM_GERAL)
  @IsNotEmpty({ message: 'Empresa: O campo "companyId" é obrigátorio.' })
  @IsInt({ message: 'Empresa: O campo "companyId" deve ser um inteiro.' })
  @Validate(CompanyIdExistConstraint, {
    message: 'Não existe uma Empresa com esse ID.',
  })
  companyId: number;

  @IsOptional()
  @IsBoolean({
    message:
      'Necessário aceitar o termo de serviço: O campo deve ser um booleano',
  })
  @Validate(IsTrueConstraint, {
    message: 'Necessário aceitar o termo de serviço',
  })
  hasAgreedTermService: boolean;
}
