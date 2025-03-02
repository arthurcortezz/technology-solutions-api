import {
  Length,
  IsEmail,
  Matches,
  IsString,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined({ message: 'O campo "name" é obrigatório!' })
  @IsString({ message: 'O campo "name" deve ser uma string!' })
  @IsNotEmpty({ message: 'O campo "name" não pode ser vazio!' })
  name: string;

  @IsDefined({ message: 'O campo "email" deve ser válido!' })
  @IsEmail({}, { message: 'O campo "email" deve ser um e-mail válido!' })
  @IsNotEmpty({ message: 'O campo "email" não pode ser vazio!' })
  email: string;

  @IsDefined({ message: 'O campo "cpf" é obrigatório!' })
  @IsString({ message: 'O campo "cpf" deve ser uma string!' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'O campo "cpf" deve estar no formato XXX.XXX.XXX-XX!',
  })
  cpf: string;

  @IsDefined({ message: 'O campo "phone" é obrigatório!' })
  @IsString({ message: 'O campo "phone" deve ser uma string!' })
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
    message: 'O campo "phone" deve estar no formato (XX) XXXXX-XXXX!',
  })
  phone: string;

  @IsDefined({ message: 'O campo "cep" é obrigatório!' })
  @IsString({ message: 'O campo "cep" deve ser uma string!' })
  @Matches(/^\d{5}-\d{3}$/, {
    message: 'O campo "cep" deve estar no formato XXXXX-XXX!',
  })
  cep: string;

  @IsDefined({ message: 'O campo "uf" é obrigatório!' })
  @IsString({ message: 'O campo "uf" deve ser uma string!' })
  @Length(2, 2, { message: 'O campo "uf" deve ter exatamente 2 caracteres!' })
  uf: string;

  @IsDefined({ message: 'O campo "city" é obrigatório!' })
  @IsString({ message: 'O campo "city" deve ser uma string!' })
  @IsNotEmpty({ message: 'O campo "city" não pode ser vazio!' })
  city: string;

  @IsDefined({ message: 'O campo "neighborhood" é obrigatório!' })
  @IsString({ message: 'O campo "neighborhood" deve ser uma string!' })
  @IsNotEmpty({ message: 'O campo "neighborhood" não pode ser vazio!' })
  neighborhood: string;

  @IsDefined({ message: 'O campo "street" é obrigatório!' })
  @IsString({ message: 'O campo "street" deve ser uma string!' })
  @IsNotEmpty({ message: 'O campo "street" não pode ser vazio!' })
  street: string;

  @IsDefined({ message: 'O campo "password" deve ser válido!' })
  @IsString({ message: 'O campo "password" deve ser uma string!' })
  @IsNotEmpty({ message: 'O campo "password" não pode ser vazio!' })
  @Length(6, 20, {
    message: 'O campo "password" deve ter entre 6 e 20 caracteres!',
  })
  password: string;

  @IsDefined({ message: 'O campo "cPassword" deve ser válido!' })
  @IsString({ message: 'O campo "cPassword" deve ser uma string!' })
  @IsNotEmpty({ message: 'O campo "cPassword" não pode ser vazio!' })
  cPassword: string;
}
