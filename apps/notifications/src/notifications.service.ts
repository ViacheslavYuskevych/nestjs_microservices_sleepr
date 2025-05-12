import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  private readonly _smtpUser: string;
  private readonly _transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor(configService: ConfigService) {
    const host = configService.get<string>('SMTP_HOST');
    const port = configService.get<number>('SMTP_PORT');
    const pass = configService.get<string>('SMTP_APP_PASSWORD');
    this._smtpUser = configService.get<string>('SMTP_USER') ?? '';

    console.log('pass', pass);
    console.log('this._smtpUser', this._smtpUser);

    this._transporter = nodemailer.createTransport({
      host,
      port,
      service: 'gmail',
      secure: true,
      auth: {
        user: this._smtpUser,
        pass,
      },
    });
  }

  async notifyEmail({ email }: NotifyEmailDto) {
    try {
      await this._transporter.sendMail({
        from: this._smtpUser,
        to: email,
        subject: 'Activation letter',
        text: '',
        html: `
          <h1>TEST</h1>
        `,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
