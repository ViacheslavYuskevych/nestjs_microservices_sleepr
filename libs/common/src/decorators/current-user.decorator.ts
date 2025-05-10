import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../models';

const getCurrentUser = (context: ExecutionContext): UserDocument => {
  const req: { user: UserDocument } = context.switchToHttp().getRequest();
  return req.user;
};

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => getCurrentUser(context),
);
