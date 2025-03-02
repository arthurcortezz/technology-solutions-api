import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class InviteCreateDto {
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
}
