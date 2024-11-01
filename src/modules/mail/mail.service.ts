import {
  BadRequestException,
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
          path: 'C:/Users/Windows 10/Desktop/horizon.png',
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
    const tokenGenerated = await randomBytes(30).toString('hex');

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
          path: 'C:/Users/Windows 10/Desktop/horizon.png',
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
    orderDetails: { orderId: string; items: string; total: number },
  ) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Your Order Details at GameVault',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; color: #333; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
        </div>
        <h2 style="color: #007BFF; text-align: center;">Thank you for your order, ${user.name}!</h2>
        <p style="font-size: 16px; text-align: center;">We are pleased to inform you that your order has been successfully received.</p>
        
        <div style="background-color: #ffffff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Order Details</h3>
          <p style="margin: 8px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p style="margin: 8px 0;"><strong>Items:</strong> ${orderDetails.items}</p>
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
    `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'C:/Users/Windows 10/Desktop/horizon.png',
          cid: 'logo@gamevault',
        },
      ],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Order email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending order email:', error);
    }
  }

  async sendPreparationMail(
    user: { email: string; name: string },
    orderId: string,
  ) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Your Order is Being Prepared',
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f2f2f2;">
        <h2 style="color: #333;">Hello, ${user.name}!</h2>
        <p>We are pleased to inform you that your order #${orderId} is being prepared.</p>
        <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
        <p>We are working to get it ready for shipment soon!</p>
        <p>Stay tuned for more updates!</p>
      </div>
    `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'C:/Users/Windows 10/Desktop/horizon.png',
          cid: 'logo@gamevault',
        },
      ],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Preparation email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending preparation email:', error);
    }
  }

  async sendDispatchedMail(
    user: { email: string; name: string },
    orderId: string,
    trackingNumber: string,
  ) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Your order has been dispatched!',
      html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f2f2f2;">
      <h2 style="color: #333;">Hello, ${user.name}!</h2>
      <p>Your order #${orderId} has been dispatched!</p>
      <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
      <p>The tracking number for your order is: <strong>${trackingNumber}</strong>.</p>
      <p>You can follow the shipment on the courier's website with this number.</p>
      <p style="color: #333;">Thank you for choosing <strong>GameVault</strong>.</p>
    </div>
  `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'C:/Users/Windows 10/Desktop/horizon.png',
          cid: 'logo@gamevault',
        },
      ],
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Dispatched email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending dispatched email:', error);
    }
  }

  async sendOnTheWayMail(
    user: { email: string; name: string },
    orderId: string,
    trackingNumber: string,
  ) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Your order is on its way',
      html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f2f2f2;">
      <h2 style="color: #333;">Hello, ${user.name}!</h2>
      <p>We want to inform you that your order #${orderId} is on its way.</p>
      <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
      <p>You can track the shipment status with this tracking number: <strong>${trackingNumber}</strong>.</p>
      <p>Thank you for choosing <strong>GameVault</strong>.</p>
    </div>
  `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'C:/Users/Windows 10/Desktop/horizon.png',
          cid: 'logo@gamevault',
        },
      ],
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`On the way email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending on the way email:', error);
    }
  }

  async sendDeliveredMail(
    user: { email: string; name: string },
    orderId: string,
  ) {
    const mailOptions = {
      from: "'GameVault' <pablobattola@gmail.com>",
      to: user.email,
      subject: 'Your order has been delivered!',
      html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f2f2f2;">
      <h2 style="color: #333;">Hello, ${user.name}!</h2>
      <p>We are pleased to inform you that your order #${orderId} has been successfully delivered.</p>
      <img src="cid:logo@gamevault" alt="GameVault" style="width: 100%; max-width: 600px;"/>
      <p>We hope you enjoy your purchase.</p>
      <p>Thank you for trusting <strong>GameVault</strong>. If you have any questions, feel free to contact us.</p>
    </div>
  `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'C:/Users/Windows 10/Desktop/horizon.png',
          cid: 'logo@gamevault',
        },
      ],
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Delivered email sent: ${info.messageId}`);
    } catch (error) {
      console.error('Error sending delivered email:', error);
    }
  }

  async verifiedEmail(token: string) {
    const result = await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.tokenConfirmation, token))
      .returning();

    if (result.length === 0)
      throw new BadRequestException(`Token invalid or deprecated.`);
  }
}
