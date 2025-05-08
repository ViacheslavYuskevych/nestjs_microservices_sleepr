import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { ITokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    configService: ConfigService,
  ) {
    const secretOrKey = configService.get<string>('JWT_SECRET') ?? '';
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        (req: Request) => req?.cookies?.Authentication,
      ]),
      secretOrKey,
    });
  }

  async validate({ userId }: ITokenPayload) {
    try {
      return await this.userService.findOne(userId);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
