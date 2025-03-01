import { IsDefined, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from '../../../shared/decorators/match.decorator';

export class EditPasswordDto {
  @IsNotEmpty({ message: 'Senha atual: O campo "password" é obrigatório.' })
  @IsDefined({ message: 'Senha atual: O campo "password" deve ser válido!' })
  @IsString({ message: 'Senha atual: O campo "password" deve ser uma string!' })
  password: string;

  @IsNotEmpty({
    message: 'Nova senha: O campo "newPassword" é obrigatório.',
  })
  @IsDefined({
    message: 'Nova senha: O campo "newPassword" deve ser válido!',
  })
  @IsString({
    message: 'Nova senha: O campo "newPassword" deve ser uma string!',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha é muito fraca, por favor utilize uma senha forte.',
  })
  newPassword: string;

  @IsNotEmpty({
    message: 'Confirmação da senha: O campo "confirmPassword" é obrigatório.',
  })
  @IsDefined({
    message: 'Confirmação da senha: O campo "confirmPassword" deve ser válido!',
  })
  @IsString({
    message:
      'Confirmação da senha: O campo "confirmPassword" deve ser uma string!',
  })
  @Match('newPassword', {
    message: 'As senhas não coincidem, por favor tente novamente.',
  })
  confirmPassword: string;
}
