import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-welcome-email')
  async sendWelcomeEmail() {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
    };

    try {
      await this.mailService.sendWelcomeMail(user);
      return { message: 'Welcome email sent successfully' };
    } catch (error) {
      return { message: 'Error sending welcome email', error };
    }
  }

  @Get('send-confirmation-email')
  async sendConfirmationEmail() {
    const user = {
      email: 'pablod_ferrero@hotmail.com',
      name: 'Juan Pérez',
      confirmationLink: 'http://yourapplication.com/confirm?token=abc123',
    };

    try {
      await this.mailService.sendConfirmationMail(user);
      return { message: 'Confirmation email sent successfully' };
    } catch (error) {
      return { message: 'Error sending confirmation email', error };
    }
  }


  @Post('verified-email/:token')
  async verifiedEmail(@Param('token') token: string) {}
  @Post('send-coupon')
  async sendCoupon(
    @Body()
    data: {
      emails: string[];
      coupons: {
        couponCode: string;
        discountPercentage: number;
        expirationDate: string;
      }[];
    },
  ) {
    const { emails, coupons } = data;

    if (!emails || !coupons || emails.length !== coupons.length) {
      return {
        message:
          'Invalid data provided. Ensure emails and coupons are provided in equal numbers.',
      };
    }

    try {
      for (let i = 0; i < emails.length; i++) {
        const user = { email: emails[i] };
        const coupon = coupons[i];

        await this.mailService.sendCouponMail(user, coupon);
      }

      return { message: 'All coupons sent successfully!' };
    } catch (error) {
      console.error('Error sending coupons:', error);
      return { message: 'Error sending some coupons', error };
    }
  }

  @Post('send-order')
  async sendOrder(
    @Body()
    data: {
      email: string;
      name: string;
      orderDetails: {
        orderId: string;
        product: Array<{ name: string; type: 'digital' | 'physical' }>;
        total: number;
      };
    },
  ) {
    const { email, name, orderDetails } = data;

    try {
      await this.mailService.sendOrderMail({ email, name }, orderDetails);
      return { message: 'Order details email sent successfully!' };
    } catch (error) {
      console.error('Error sending order details:', error);
      return { message: 'Error sending order details email', error };
    }
  }

}





