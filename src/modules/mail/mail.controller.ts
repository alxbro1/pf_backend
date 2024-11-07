import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('mail')
@ApiTags('Mail Service')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-welcome-email')
  @ApiOperation({ summary: 'Send a welcome email' })
  @ApiResponse({
    status: 200,
    description: 'Welcome email sent successfully',
    content: {
      'application/json': {
        example: { message: 'Welcome email sent successfully' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error sending welcome email',
    content: {
      'application/json': {
        example: {
          message: 'Error sending welcome email',
          error: 'Detailed error message',
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Send a confirmation email' })
  @ApiResponse({
    status: 200,
    description: 'Confirmation email sent successfully',
    content: {
      'application/json': {
        example: { message: 'Confirmation email sent successfully' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error sending confirmation email',
    content: {
      'application/json': {
        example: {
          message: 'Error sending confirmation email',
          error: 'Detailed error message',
        },
      },
    },
  })
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

  @Post('send-coupon')
  @ApiOperation({ summary: 'Send coupons to multiple users' })
  @ApiBody({
    description: 'Emails and coupons data',
    schema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          items: { type: 'string' },
        },
        coupons: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              couponCode: { type: 'string' },
              discountPercentage: { type: 'number' },
              expirationDate: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'All coupons sent successfully',
    content: {
      'application/json': {
        example: { message: 'All coupons sent successfully!' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided',
    content: {
      'application/json': {
        example: {
          message:
            'Invalid data provided. Ensure emails and coupons are provided in equal numbers.',
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Send order details to a user' })
  @ApiBody({
    description: 'Order details to send',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        name: { type: 'string' },
        orderDetails: {
          type: 'object',
          properties: {
            orderId: { type: 'string' },
            product: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string', enum: ['digital', 'physical'] },
                },
              },
            },
            total: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Order details email sent successfully',
    content: {
      'application/json': {
        example: { message: 'Order details email sent successfully!' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error sending order details email',
    content: {
      'application/json': {
        example: {
          message: 'Error sending order details email',
          error: 'Detailed error message',
        },
      },
    },
  })
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
  @Post('verified-email/:token')
  async verifiedEmail(@Param('token') token: string) {
    return await this.mailService.verifiedEmail(token);
  }
}





