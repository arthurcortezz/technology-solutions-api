import {
  IsString,
  Validate,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

import { CarouselNameAlreadyExistConstraint as CarouselNameAlreadyExistConstraint } from '../validate/carousel-name-already-exist.constraint';

export class CarouselCreateDto {
  @Validate(CarouselNameAlreadyExistConstraint, {
    message: 'Título: Já existe um carrossel com este título.',
  })
  @IsString({
    message: 'Título: O campo "title" precisa ser uma string.',
  })
  @IsNotEmpty({ message: 'Título: O campo do "title" é obrigatório.' })
  @MaxLength(50, {
    message: 'Título: O campo do "title" pode ter no máximo 50 caracteres.',
  })
  title: string;

  @IsString({
    message: 'Descrição: O campo "description" precisa ser uma string.',
  })
  @IsNotEmpty({ message: 'Descrição: O campo "description" é obrigatório.' })
  @MinLength(3, {
    message:
      'Descrição: O campo "description" precisa ter pelo menos 3 caracteres.',
  })
  @MaxLength(50, {
    message:
      'Descrição: O campo "description" pode ter no máximo 50 caracteres.',
  })
  description: string;

  @IsString({ message: 'Ícone: O campo "icon" precisa ser uma string.' })
  @IsNotEmpty({ message: 'Ícone: O campo "icon" é obrigatório.' })
  @MinLength(3, {
    message: 'Ícone: O campo "icon" precisa ter pelo menos 3 caracteres.',
  })
  @MaxLength(50, {
    message: 'Ícone: O campo "icon" pode ter no máximo 50 caracteres.',
  })
  icon: string;
}
