import { UserDocument } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

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
