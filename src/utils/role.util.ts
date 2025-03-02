import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const Roles = (roles: string | string[]): CustomDecorator<string> =>
  SetMetadata('', Array.isArray(roles) ? roles : [roles]);
