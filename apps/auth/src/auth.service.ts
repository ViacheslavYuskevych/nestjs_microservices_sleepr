import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from './users/models/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  login(user: UserDocument, response: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
    };

    const expiration = Number(this.configService.get('JWT_EXPIRATION'));
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiration);

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, { expires, httpOnly: true });
  }
}
