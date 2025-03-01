import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { UserEntity } from '../../modules/users/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data: keyof UserEntity, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);

export const AuthUserGraphQL = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const contextHost = new ExecutionContextHost(
      [req],
      undefined,
      ctx.getHandler(),
    );
    const request = contextHost.switchToHttp().getRequest();

    return request.user;
  },
);
