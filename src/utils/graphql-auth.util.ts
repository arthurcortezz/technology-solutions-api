import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const contextHost = new ExecutionContextHost([req], null, ctx.getHandler());
    return super.canActivate(contextHost);
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): any {
    const role: string[] = this.reflector.get<string[]>(
      '',
      context.getHandler(),
    );
    if (
      err ||
      !user ||
      (role && !user.privileges.find((el) => el.key === role))
    ) {
      throw err || new UnauthorizedException('Não autorizado.');
    }
    return user;
  }
}
