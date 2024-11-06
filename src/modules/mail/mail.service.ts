import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { db } from '../../config/db';
import { users } from '../../../db/schemas/users.schema';
import { eq } from 'drizzle-orm';


@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pablobattola@gmail.com',
        pass: 'uyrt jyqg jvfq nien',
      },
    });
  }

  async sendWelcomeMail(user: { email: string; name: string }) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Welcome to GameVault',
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f2f2f2;">
        <h2 style="color: #333;">Hello, ${user.name}!</h2>
        <p>Welcome to <strong>GameVault</strong>! We are glad you're here.</p>
        <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
        <p>To explore our platform, click the button below:</p>
        <a href="https://gamevault.com/explore" 
           style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">
          Explore GameVault
        </a>
        <p style="margin-top: 20px; color: #777;">If you have any questions, feel free to contact us.</p>
        <p style="color: #333;">Enjoy your experience at GameVault!</p>
      </div>
    `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730565786/dlin5sg99n8avumxxpal.jpg',
          cid: 'logo@gamevault',
        },
      ],
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }

  async sendConfirmationMail(user: { email: string; name: string }) {
    const tokenGenerated = randomBytes(30).toString('hex');

    const result = await db
      .update(users)
      .set({ tokenConfirmation: tokenGenerated })
      .where(eq(users.email, user.email))
      .returning();

    if (result.length === 0)
      throw new NotFoundException(`User with email ${user.email} not found.`);

    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Confirm Your Account',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
        </div>
        <h2 style="color: #333;">Hello ${user.name},</h2>
        <p style="font-size: 16px; color: #555;">
          Thank you for joining GameVault! We are excited to have you with us.
          To get started, please confirm your account by clicking the button below.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3001/mail/verified-email/${tokenGenerated}" style="padding: 15px 25px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Confirm Account
          </a>
        </div>
        <p style="font-size: 14px; color: #777;">
          If the button doesn't work, copy and paste the following link into your browser:
          <br/>
          <a href="http://localhost:3001/mail/verified-email/${tokenGenerated}" style="color: #007bff;">http://localhost:3001/mail/verified-email/${tokenGenerated}</a>
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <img src="https://wallpapercave.com/wp/wp4892943.jpg" alt="Thank you" style="width: 100%; max-width: 600px;"/>
        </div>
      </div>
    `,
      attachments: [
        {
          filename: 'horizon.png',
          path: 'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730565786/dlin5sg99n8avumxxpal.jpg',
          cid: 'logo@gamevault',
        },
        {
          filename: 'footer-image.png',
          path: 'https://wallpapercave.com/wp/wp4892943.jpg',
          cid: 'footer@gamevault',
        },
      ],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }

  async sendOrderMail(
    user: { email: string; name: string },
    orderDetails: {
      orderId: string;
      product: Array<{ name: string; type: 'digital' | 'physical' }>;
      total: number;
    },
  ) {
    const hasPhysicalProducts = orderDetails.product.some(
      (product) => product.type === 'physical',
    );

    let htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #333; color: #fff; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
    </div>
    <h2 style="color: #007BFF; text-align: center;">Thank you for your order, ${user.name}!</h2>
    <p style="font-size: 16px; text-align: center;">We are pleased to inform you that your order has been successfully received.</p>
    
    <div style="background-color: #444; border: 1px solid #555; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #fff; border-bottom: 1px solid #555; padding-bottom: 10px;">Order Details</h3>
      <p style="margin: 8px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p style="margin: 8px 0;"><strong>Items:</strong></p>
      <ul style="list-style: none; padding: 0;">
        ${orderDetails.product
          .map(
            (product) => `
          <li style="margin-bottom: 5px; color: #fff;">
            ${product.name}
            ${product.type === 'physical' ? '<strong style="color: yellow;"> - This item will be shipped!</strong>' : ''}
          </li>
        `,
          )
          .join('')}
      </ul>
      <p style="margin: 8px 0;"><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
    </div>

    <p style="font-size: 16px; text-align: center;">To see more details about your order, click the button below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="https://gamevault.com/orders/${orderDetails.orderId}" 
        style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px;">
        View My Order
      </a>
    </div>

    <p style="font-size: 14px; text-align: center; margin-top: 20px;">If you have any questions, feel free to <a href="https://gamevault.com/contact" style="color: #007BFF;">contact us</a>.</p>
    <p style="font-size: 14px; text-align: center;">We hope you enjoy your purchase!<br>The GameVault Team</p>
  </div>
`;

    if (hasPhysicalProducts) {
      htmlContent += `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #444; color: #fff; border-radius: 8px;">
      <p style="font-size: 16px; text-align: center;">
        <strong>Notice:</strong> Your order contains physical products. These will be shipped to you.
      </p>
      <p style="font-size: 16px; text-align: center;">
        Once your order is delivered, you can update its status by clicking the following link:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="http://localhost:3001/orders/deliver/${orderDetails.orderId}" 
          style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px;">
          Mark as Delivered
        </a>
      </div>
    </div>
  `;
    }

    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Your Order Details at GameVault',
      html: htmlContent,
      attachments: [
        {
          filename: 'logo.png',
          path: 'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730565786/dlin5sg99n8avumxxpal.jpg',
          cid: 'logo@gamevault',
        },
      ],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Order email sent: ${info.messageId}`);
    } catch (error) {
      console.error(
        'Error sending order email or marking order as delivered:',
        error,
      );
    }
  }

  async sendDeliveredConfirmationMail(user: { email: string }) {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #333; color: #fff; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
      </div>
      <h2 style="color: #28a745; text-align: center;">Thank You for Your Purchase!</h2>
      <p style="font-size: 16px; text-align: center;">Hello,</p>
      <p style="font-size: 16px; text-align: center;">Your order has been successfully delivered. We hope you are enjoying your purchase!</p>
      
      <div style="background-color: #444; border: 1px solid #555; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #fff; border-bottom: 1px solid #555; padding-bottom: 10px;">Thank You for Shopping with Us!</h3>
        <p style="margin: 8px 0; color: #ddd;">We hope you're enjoying your purchase. If you need any help or have any questions, feel free to reach out to us.</p>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <a href="https://gamevault.com/contact" 
          style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px;">
          Contact Us
        </a>
      </div>

      <p style="font-size: 14px; text-align: center; margin-top: 20px;">Thank you again for choosing GameVault. We look forward to serving you again!</p>
      <p style="font-size: 14px; text-align: center;">Best regards,<br>The GameVault Team</p>
    </div>
  `;

    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Thank You for Your Purchase!',
      html: htmlContent,
      attachments: [
        {
          filename: 'logo.png',
          path: 'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730565786/dlin5sg99n8avumxxpal.jpg',
          cid: 'logo@gamevault',
        },
      ],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Purchase confirmation email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending purchase confirmation email:', error);
    }
  }

  async sendCouponMail(
    user: { email: string },
    coupon: {
      couponCode: string;
      discountPercentage: number;
      expirationDate: string;
    },
  ) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Congratulations! Here’s Your Gift Coupon!',
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">🎉 Hello, ${user.email}! 🎉</h2>
        <p>We are thrilled to present you with an exclusive gift coupon!</p>
        <div style="border: 2px dashed #4CAF50; padding: 20px; margin: 20px auto; width: 80%; max-width: 600px; border-radius: 10px; background-color: #e9f8e9;">
          <h3 style="color: #4CAF50; font-size: 24px;">Coupon Code: <strong style="font-size: 28px;">${coupon.couponCode}</strong></h3>
          <p style="font-size: 20px;">Discount: <strong style="color: #ff5722; font-size: 26px;">${coupon.discountPercentage}% OFF</strong></p>
          <p style="font-size: 18px;">Valid until: <strong>${coupon.expirationDate}</strong></p>
        </div>
        <p>Use this code on your next purchase and enjoy your discount!</p>
        <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
        <p>Thank you for being a part of <strong>GameVault</strong>.</p>
      </div>
    `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'https://res.cloudinary.com/dnfslkgiv/image/upload/v1730565786/dlin5sg99n8avumxxpal.jpg',
          cid: 'logo@gamevault',
        },
      ],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Coupon email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending coupon email:', error);
    }
  }
}
