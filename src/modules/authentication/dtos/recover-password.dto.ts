import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class RecoverPasswordDto {
  @IsDefined({ message: 'E-mail: O campo "email" deve ser válido!' })
  @IsEmail({}, { message: 'E-mail: O campo "email" deve ser válido!' })
  @IsNotEmpty({ message: 'E-mail: O campo "email" não pode ser vazio!' })
  email: string;
}
