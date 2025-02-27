import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const role: string[] = this.reflector.get<string[]>(
      '',
      context.getHandler(),
    );
    if (
      err ||
      !user ||
      (role && !user.privileges.find((el: any) => el.key === role))
    ) {
      throw (
        err ||
        new UnauthorizedException(
          'Não autorizado! Você não tem permissão para acessar este recurso.',
        )
      );
    }
    return user;
  }
}
