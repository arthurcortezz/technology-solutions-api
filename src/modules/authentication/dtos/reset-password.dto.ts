import { IsDefined, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from '../../../shared/decorators/match.decorator';
export class ResetPasswordDto {
  
  @IsDefined({ message: 'Senha: O campo "password" deve ser válido.' })
  @IsString({ message: 'Senha: O campo "password" deve ser uma string.' })
  @IsNotEmpty({ message: 'Senha: O campo "password" não pode ser vazio.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha é muito fraca, por favor utilize uma senha forte.',
  })
  password: string;

  @IsDefined({
    message:
      'Confirmação da senha: O campo  "confirmPassword" deve ser válido.',
  })
  @IsString({
    message:
      'Confirmação da senha: O campo "confirmPassword" deve ser uma string.',
  })
  @IsNotEmpty({
    message:
      'Confirmação da senha: O campo "confirmPassword" não pode ser vazio.',
  })
  @Match('password', { message: 'As senhas não coincidem, por favor tente novamente.'})
  confirmPassword: string;
}
