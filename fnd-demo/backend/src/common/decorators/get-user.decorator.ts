// common/decorators/get-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/user.entity';

export const GetUser = createParamDecorator(
  (_data, _ctx: ExecutionContext): User => {
    const { user } = _ctx.switchToHttp().getRequest();
    return user;
  },
);
