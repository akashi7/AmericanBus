import { MailerService } from '@nestjs-modules/mailer';
import { BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(
    to: string,
    subject: string,
    from: string,
    text: string,
  ): Promise<{ message: string }> {
    try {
      const emailSent = await this.mailerService.sendMail({
        to,
        from,
        subject,
        text,
      });
      if (emailSent) return { message: 'Email sent successfully' };
    } catch (error) {
      console.log({ error });
      throw new BadGatewayException('Email not sent');
    }
  }
}
