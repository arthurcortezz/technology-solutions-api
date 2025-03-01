import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AuthenticationEmailAlreadyExist } from '../validate/authentication-email-already-exist.constraint';
import { Transform, Type } from 'class-transformer';
import { PersonTypeEnum } from '../../users/enum/person-type.enum';
import { IsCNPJ, IsCPF } from 'brazilian-class-validator';
import { UserIdentificationNumberAlreadyExistConstraint } from '../../users/validate/user-identification-number-already-exist.constraint';
import { UserAddressDto } from '../../users/dtos/user-address.dto';

export class EditProfileDto {
  @IsNotEmpty({ message: 'ID do Usuário: O campo de ID é obrigátorio.' })
  @IsInt({
    message: 'ID do Usuário: O campo de ID precisa ser um inteiro.',
  })
  id: number;

  @IsNotEmpty({ message: 'Nome: O campo "name" é obrigatório' })
  @IsDefined({ message: 'Nome: O campo "name" deve ser válido!' })
  @IsString({ message: 'Nome: O campo "name" deve ser uma string!' })
  name: string;

  @Validate(AuthenticationEmailAlreadyExist, {
    message: 'Esse e-mail já está sendo utilizado por outra conta.',
  })
  @IsDefined({ message: 'E-mail: O campo "email" deve ser válido!' })
  @IsString({ message: 'E-mail: O campo "email" deve ser uma string!' })
  @IsNotEmpty({ message: 'E-mail: O campo "email" não pode ser vazio!' })
  @IsEmail({}, { message: 'E-mail: O campo "email" deve ser válido!' })
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

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => UserAddressDto)
  address?: UserAddressDto;
}
