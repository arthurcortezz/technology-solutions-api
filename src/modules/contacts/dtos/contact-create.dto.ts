import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class ContactCreateDto {
  @IsString({
    message: 'Nome: O campo "name" precisa ser uma string.',
  })
  @IsNotEmpty({ message: 'Nome: O campo do "name" é obrigatório.' })
  @MaxLength(50, {
    message: 'Nome: O campo do "name" pode ter no máximo 50 caracteres.',
  })
  name: string;

  @IsString({
    message: 'E-mail: O campo "email" precisa ser uma string.',
  })
  @IsNotEmpty({ message: 'E-mail: O campo "email" é obrigatório.' })
  @MinLength(3, {
    message: 'E-mail: O campo "email" precisa ter pelo menos 3 caracteres.',
  })
  @MaxLength(150, {
    message: 'E-mail: O campo "email" pode ter no máximo 150 caracteres.',
  })
  email: string;

  @IsString({ message: 'Telefone: O campo "phone" precisa ser uma string.' })
  @IsNotEmpty({ message: 'Telefone: O campo "phone" é obrigatório.' })
  @MinLength(3, {
    message: 'Telefone: O campo "phone" precisa ter pelo menos 3 caracteres.',
  })
  @MaxLength(50, {
    message: 'Telefone: O campo "phone" pode ter no máximo 50 caracteres.',
  })
  phone: string;

  @IsString({ message: 'Mensagem: O campo "message" precisa ser uma string.' })
  @IsNotEmpty({ message: 'Mensagem: O campo "message" é obrigatório.' })
  @MinLength(3, {
    message: 'Mensagem: O campo "message" precisa ter pelo menos 3 caracteres.',
  })
  @MaxLength(250, {
    message: 'Mensagem: O campo "message" pode ter no máximo 250 caracteres.',
  })
  message: string;
}
