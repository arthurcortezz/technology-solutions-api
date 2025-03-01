import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsDefined({ message: 'O campo "email" deve ser válido!' })
  @IsEmail({}, { message: 'O campo "email" deve ser válido!' })
  @IsNotEmpty({ message: 'O campo "email" não pode ser vazio!' })
  email: string;

  @IsDefined({ message: 'Senha: O campo "password" deve ser válido!' })
  @IsString({ message: 'Senha: O campo "password" deve ser uma string!' })
  @IsNotEmpty({ message: 'Senha: O campo "password" não pode ser vazio!' })
  password: string;
}
