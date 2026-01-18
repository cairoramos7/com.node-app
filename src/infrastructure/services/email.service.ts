import nodemailer, { Transporter } from 'nodemailer';
import IEmailService from '../../domain/services/email.service';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService implements IEmailService {
  private transporter: Transporter;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport(config as any);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error: any) {
      console.error(`Error sending email to ${to}:`, error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

export default EmailService;
